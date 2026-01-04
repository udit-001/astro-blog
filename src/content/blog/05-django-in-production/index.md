---
title: "Django in Production - I"
description: "Get your Django App ready for production"
date: "2020-06-18"
tags:
  - django
  - python
  - production
---

import { YouTube } from 'astro-embed';

---
Hello djangonauts, today I want to talk about how to run django in production.

## Introduction

So, you might have finished developing that project you were building for your client, and now it's time to deploy your project on a server and make it accessible to public. But you're confused on how to proceed further? I was too, but not anymore.

The reason why I decided to write this series is that when I had to deploy my project, I had to spend hours searching about it and then read up multiple articles about it, but even then they didn't cover all the essential details. So that's what prompted me to write this series, and I am going to go over my setup for running django in production.

First thing, I wanna clear up is that when you run your django server using the command:

```bash
python manage.py runserver
```

This starts up a development server, that is provided by the Django Team only for the purpose of development, you are not supposed to run your projects in production using it.

In production, you'll have to use a WSGI server such as Gunicorn or uWSGI, which I'm going to cover as well.

## Deployment Checklist

Now, I would like to introduce you to a checklist utility for configuring django settings that you should setup properly in your project's `settings.py`.

To check whether you've configured those settings correctly in your project, run the following command:

```bash
python manage.py check --deploy
```

It'll display the settings that you should fix before going into production. For more details, refer to this [section](https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/ "Deployment Checklist") in Django documentation.

## Turning Debug Mode Off

When you're done fixing those settings, you will see that you were asked to turn DEBUG mode off in production by setting `DEBUG = False`. Now that you've done that, if you tried running your server using `python manage.py runserver` now, and tried accessing your admin you'll realize that it doesn't load your CSS and you'll be greeted by a screen looking like this:

![](https://res.cloudinary.com/idiomprog/image/upload/v1600081569/Idiomatic%20Programmers/save_20200619_205838.jpg)

It's because Django advises you to serve your static files using something like NGINX, as mentioned in the docs [here](https://docs.djangoproject.com/en/3.0/howto/static-files/deployment/#serving-static-files-from-a-dedicated-server).

After hearing NGINX, you're probably feeling intimidated and you're thinking "oh no! now I need to learn another technology before I can run my app in production?", if not, atleast I felt like that. But worry not, I have got you covered, so instead of using NGINX, we are going to be using Whitenoise for our project. So, let's go ahead and install whitenoise by running:

```bash
pip install whitenoise
```

Now, you need to edit your django project settings, which will usually be present in `settings.py`. Add the following line to your settings:

```
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

Then you'll need to add whitenoise to your middlewares as follows, make sure to place it directly after the Django SecurityMiddleware and before all other middlewares:

```python
MIDDLEWARE = [
  'django.middleware.security.SecurityMiddleware',
  'whitenoise.middleware.WhiteNoiseMiddleware',
  # ...
]
```

That's it now your static files will be served by whitenoise. If you want to go one step further and configure whitenoise to compress your static files before serving, then follow the next step.

Add this line inside your `settings.py`:

```python
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

After you're done setting up whitenoise, if you start your server now and visit admin, you'll see that now the CSS files have loaded properly.

## WSGI Server

Before getting started with setting up the WSGI server for our project, I'd like to talk a bit about them first.

WSGI stands for Web Server Gateway Interface. It is a standard interface for running Python code. It is what is implemented in applications like Gunicorn, uWSGI or mod_wsgi, out of which you're free to pick any based on your needs. Your web server is configured to pass requests to the WSGI container which runs your web application, then pass the response back to the requester.

Or to put it more simply, it processes the HTTP request and responses and gives them back to your application in a structured manner without them having to deal with raw HTTP headers and content.

If you wanna learn more about WSGI, I'd highly suggest you to watch this PyCon talk.

<YouTube id="https://youtu.be/WqrCnVAkLIo" />

Enough theory, now let's jump into code. We'll be using gunicorn, let's start by installing it by running the command:

```bash
pip install gunicorn
```

Now, start gunicorn by running:

```bash
gunicorn myproject.wsgi
```

Here, you would replace `myproject` with your Django project name instead.

That's the most basic way of running your Django project using gunicorn, but you might need some other things like logging.

```bash
gunicorn myproject.wsgi --log-level DEBUG --access-logfile path/to/out.log --error-logfile path/to/error.log
```

The above command would setup error logs and access logs to your server, however make sure to replace `path/to/out.log` and `path/to/error.log` to actual file paths where you want to store your logs.

Further, in the above command, instead of `debug`, you can use several other values such as:

* debug
* info
* warning
* error
* critical


In the [next post](/post/django-in-production-part-2/), we are going to cover how to install and configure NGINX to run as reverse proxy to direct traffic to our WSGI server (gunicorn) and also serve our static files.

## Reference
1. [Whitenoise Docs](https://whitenoise.evans.io/en/stable/django.html)
2. [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/settings.html)
