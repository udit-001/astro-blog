---
title: Celery Alternative for Django - Huey
description: Trying out a lightweight asynchronous task queue as an alternative to Celery with Django
date: 2022-05-08
tags:
  - django
  - huey
---
---

## Background

So today I will be talking about a Celery alternative named [Huey](https://huey.readthedocs.io/en/latest/index.html), which comes with a much easier setup than [Celery](https://docs.celeryq.dev/) and is much smaller in size compared to Celery.

The reason why I decided to try out Huey is because I have faced some issues with Celery sometimes for doing some common tasks because the documentation isn't too great.

For those who don't know what Celery is or haven't used it before, Huey is an asynchronous task queue which allows you to perform scheduled tasks or long running tasks in the background.

## Prerequisites

We will be installing the following packages:

- redis
- django
- huey
- requests (optional, needed for the demo)

## Github Repo

The following blog comes accompanied with a github repo, that you can use to test out the demo project that we will be creating.

[Click here to view repo.](https://github.com/Idiomatic-Programmers/huey-demo)

## Project Setup

### Create Project Directory

Open the terminal and type the following to create a directory, you can skip this step and do it from File Explorer itself.

```bash
mkdir huey_demo
```

### Virtual Environment

- Let us create a virtualenv first to install our project dependencies:

```bash
    python -m venv venv
```

- Activate the virtualenv (Linux):

```bash
    source venv/bin/activate
```

### Installing dependencies

Type the following command in the terminal to install all the dependencies:

```bash
pip install Django==4.0.4 redis==4.2.2 huey==2.4.3
```

At the time of writing this article, these were the versions I tested out this setup with, keep an eye on the Github Repo for any updates as per the latest version in the future.

### Create Project

- Create the django project by typing the following command in terminal:

```bash
    django-admin startproject django_huey_demo
```

- Change directory into django project directory:

```bash
    cd django_huey_demo
```

- Create the app under our project:

```bash
    python manage.py startapp demo
```

- Include the created app into project `settings.py`, make the following changes:

```python
    INSTALLED_APPS = [
        # Existing Apps
        "demo.apps.DemoConfig",  # <== Add this line
    ]
```

- Set debug mode to `False` in `settings.py`:

```python
    DEBUG=False
```

    We are setting Debug to False so that we can see how Huey runs in production, more on this later.

## Project Overview

Now that we are done setting up our project, it is a good time to take you over what we will be building today.
We will fetch "Word of the Day" daily from [Wordnik API](https://developer.wordnik.com/). Then we will store the word, its definition, and an example of the word in a sentence to our database.

We will setup a periodic task using Huey which will fetch the Word of the Day and store it.

For storing the word we will be creating a Django Model of the same.

## Getting Wordnik API Key

You can follow [this guide](https://developer.wordnik.com/gettingstarted) to obtain the API key.

## Coding our project

### Add Huey to our Project

We need to add Huey to installed apps of our project, so make the following changes in `settings.py` file:

```python
INSTALLED_APPS = [
    # Existing apps
    'huey.contrib.djhuey', # <== Add this line
]
```

### Install Redis

We need to install Redis for Huey to store information about queued tasks in it, like we used to do with Celery as well. You can refer to the following [link](https://redis.io/download/#redis-downloads) to install redis based on your specific operating system.

If you're comfortable with using Docker, you can use the following command:

```plain
docker run --name redis_huey -p 6379:6379 -d redis
```

By default, Huey will try connecting to Redis server running on `localhost:6379`. If it isn't present, it will raise an error.

### Model Definition

1. Add the following code to your `demo/models.py` file:

```python
    from django.db import models

    class Word(models.Model):
        word = models.CharField(max_length=200)
        part_of_speech = models.CharField(max_length=100)
        definition = models.TextField()
        example = models.TextField()

        def __str__(self):
            return self.word
```

2. Make migrations:

```bash
    python manage.py makemigrations demo
```

3. Apply migrations:

```bash
    python manage.py migrate demo
```

### Task Definition

Create a file named `tasks.py` in demo app directory. The reason why we named our file `tasks.py` is to help Huey auto discover the tasks present in our registered apps, if we named our file anything other than that, we would have to manually register our task. If you would like to know more you can check out the Huey documentation [here](https://huey.readthedocs.io/en/latest/imports.html#imports).

Before we write the task definition we need to install an additional dependency `requests`. Install it by typing the following in your terminal:

```bash
pip install requests==2.27.1
```

Now comes the code:

```python
import requests
from django.conf import settings
from huey import crontab
from huey.contrib.djhuey import db_periodic_task

from demo.models import Word


@db_periodic_task(crontab(hour="18", minute="00"))
def fetch_daily_word():
    r = requests.get(
        f"https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key={settings.WORDNIK_API_KEY}")
    data = r.json()
    Word.objects.get_or_create(
        word=data["word"],
        part_of_speech=data["definitions"][0]["partOfSpeech"],
        definition=data["definitions"][0]["text"],
        example=data["examples"][0]["text"]
    )
```

Add the following line in your project settings:

```python
WORDNIK_API_KEY = "api-key-here"
```

This codeblock might be a lot to take in, so let's go over the things in it one by one:

1. **Huey Decorator**

```python
    from huey.contrib.djhuey import db_periodic_task
```

    This is a decorator provided by Huey to register periodic task that involve working with database, this decorator automatically closes the database connection upon task completion, for more details, you can refer [here.](https://huey.readthedocs.io/en/latest/contrib.html#tasks-that-execute-queries)

2. **Crontab Schedule**

```python
    @db_periodic_task(crontab(hour="18", minute="00"))
```

    We are passing the argument `crontab(hour="18", minute="00")` to our periodic task decorator, this tells Huey to run our task at 6pm everyday. You can make use of [this website](https://crontab.guru/) to create your crontab schedules, I use it everytime.

3. **Wordnik API Key**

```python
    from django.conf import settings

    # Usage
    ## settings.WORDNIK_API_KEY
```

    `from django.conf import settings` is the standard way to import any data from our project settings, it is useful in cases where we have multiple settings files setup for different environment so it will know which file to pick from without us having to worry about it. It finds out which settings file we are using from the `DJANGO_SETTINGS_MODULE` environment variable. But you don't have to worry about these details.

    Then we are using the key in our wordnik API call.

4. **Wordnik API Call**

```python
    r = requests.get(
    f"https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key={settings.WORDNIK_API_KEY}")
```

    Here we are making use of the requests module to make a GET request to the wordnik API while passing our API Key for authentication.

5. **Storing word in database**

```python
    data = r.json()
    Word.objects.get_or_create(
        word=data["word"],
        part_of_speech=data["definitions"][0]["partOfSpeech"],
        definition=data["definitions"][0]["text"],
        example=data["examples"][0]["text"]
    )
```

    After parsing the API response we are storing the word definition in our database. We are making use of `get_or_create` method instead of `create` method here so that we don't create multiple copies of the same word in our database if that word is ever repeated by the Wordnik API.

6. **Wordnik API Response**
    Here is what the Wordnik API response for Word of the Day endpoint looks like. Some of the irrelevant sections of the response has been truncated for brevity purposes.

```json
    {
    "word": "stolon",
    "definitions": [
        {
        "source": "ahd-5",
        "text": "A long thin stem that usually grows horizontally along the ground and produces roots and shoots at widely spaced nodes, as in a strawberry plant.",
        "note": null,
        "partOfSpeech": "noun"
        },
        // More definitions here...
    ],
    "publishDate": "2022-05-08T03:00:00.000Z",
    "examples": [
        {
        "title": "4.1 Nursery establishment",
        "text": "A stolon is a stem that grows along the ground, producing at its nodes new plants with roots and upright stems.",
        // Additional data here...
        },
        // More examples here...
    ],
        // Additional fields here...
    }
```

### Running Huey Worker

You can start the Huey worker by typing the following command in your terminal:

```bash
python manage.py run_huey
```

You can pass multiple flags to the above command which will change what gets logged to the console, such as:

- `-v, --verbose` - verbose logging (includes DEBUG level)
- `-q, --quiet` - minimal logging
- `-S, --simple` - simple logging format (“time message”)

To look at various other options for logging, checkout the docs [here](https://huey.readthedocs.io/en/latest/guide.html#logging).

## What else can you do with Huey?

### Task Decorators

Huey comes with multiple task decorators depending on what operations you are performing within the task.
I'll explain in brief what all of those do below.
Here is the import statement for all the decorators:

```python
from huey.contrib.djhuey import task, periodic_task, db_task, db_periodic_task
```

- `task`: A regular task
- `periodic_task` : When you want to run a task periodically based on a schedule
- `db_task` : When you want to perform db operations within your task
- `db_periodic_task` : When you want to perform db operations in a periodic task

### Crontab Examples

Let me show you some more examples of how you can use crontab to schedule your tasks.

- `crontab(minute='*/3')` would schedule the task to run every three minute
- `crontab(hour='*/3', minute='5')` would create a task that will run at 5 minute past every third hour.
- `crontab(minute='00', hour='10', month='*/2', day_of_week='*/5')` would create a task that would run on every 5th day of the week, of every 2nd month at 10:00 AM.

### Scheduling Tasks

For example, you have the following task defined inside `tasks.py`:

```python
from huey.contrib.djhuey import task

@task()
def count():
    for i in range(10):
        print(i)
```

Now you want to call this task, but want it to run after 5 seconds, you can do the following:

```python
count.schedule(delay=5)
```

`delay` parameter takes values in seconds, so if you want it to execute after 5 minutes specify 300 seconds.

### Retrying tasks that fail

Suppose you add the following logic to our existing task:

```python
@db_periodic_task(crontab(hour="18", minute="00"), retries=2)
def fetch_daily_word():
    r = requests.get(
        f"https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key={settings.WORDNIK_API_KEY}")
    if r.status_code != 200:
        raise Exception("Unable to fetch data from Wordnik API")  ## Add this logic
    else:
        data = r.json()
        Word.objects.get_or_create(
            word=data["word"],
            part_of_speech=data["definitions"][0]["partOfSpeech"],
            definition=data["definitions"][0]["text"],
            example=data["examples"][0]["text"]
        )
```

So we added the logic to check for status code of the response, and if it is something other than 200, it will retry that task upto 2 times. But these retries would happen without any time gap between the two attempts. Now what if you want to delay out multiple attempts of this task, we can do that by passing the `retry_delay` argument, it accepts values in seconds.

```python
@db_periodic_task(crontab(hour="18", minute="00"), retries=2, retry_delay=10)
```

This will cause a 10 second delay between multiple attempts.

### Development Mode

Huey comes with a default setting which makes working with Huey during development in Django easier. So whenever you have `DEBUG=True` present in your `settings.py` file, tasks will be executed synchronously just like regular function calls. The purpose of this is to avoid running both Redis and an additional consumer process while developing or running tests. You can read more about this [here](https://huey.readthedocs.io/en/latest/contrib.html#debug-and-synchronous-execution).

For this, we need to add the following line in `settings.py`:

```python
HUEY = {}
```

However, if you want to override this behaviour, you can add the following Huey config instead:

```python
HUEY = {
    "immediate": False
}
```

If you have the above config mentioned in `settings.py` while having `DEBUG=True` Huey will require you to setup Redis and run huey worker using `run_huey` command.

## Celery vs Huey

Some observations about Huey as compared to Celery are:

- Smaller footprint of dependencies as compared to Celery. Celery installs kombu and billiards along with it. Meanwhile, huey doesn't have any dependencies.
- Lesser services needed to be run for periodic tasks, Celery requires running beat service and a worker service to work with periodic task meanwhile we only need to run one service using the `run_huey` command.

## References

1. [Huey Docs](https://huey.readthedocs.io/en/latest/index.html)
2. [Wordnik API](https://developer.wordnik.com/gettingstarted)
3. [Associated Github Repo](https://github.com/Idiomatic-Programmers/huey-demo)
