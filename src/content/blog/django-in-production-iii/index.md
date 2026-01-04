---
title: Django in Production - III
description: Third part of the series covering how to get your django project into production
date: 2024-03-20
tags:
  - django
  - python
  - production
---
---

## Introduction

This is the third and the last post in the series, where we configure our django application to run in production. In the [last post](/post/django-in-production-part-2/), we discussed how to configure and run NGINX as reverse proxy in front of gunicorn workers, and to also serve static files.

Today, I want to cover an important thing that you'll definitely need while setting up your servers, but wouldn't realize that you actually need it.

The technology that I am talking about is process monitors. Let me tell you examples of use cases where you might need them:

* You are running a web app, and due to some maintenance downtime on your VPS provider, your server gets restarted. Your web app stops running because of it, you would have preferred if your web app started automatically with your server.
* In a complex web app architecture, you're not going to be running just a single web server, you might be running additional services for things such as Asynchronous Task Queue such as Celery, and a Task Scheduler like Celery Beat and a database server. Now to remember to restart them each separately whenever you pull any new changes from the production branch to your server gets too tedious.
* What if the server gets terminated accidentally because it encounters an error while running in the middle of the night, and you're asked to fix it immediately, sounds scary, right?

So, there are multiple available utilities out there for doing this task such as systemd. But from a beginner's perspective, systemd would seem intimidating. That's why I decided to search for a tool that does the job for us without making us feel intimidated, so the one I finally decided to go with is Supervisor.

Let's begin setting things up.

## Supervisord Installation

If you're on Ubuntu you can install supervisor on your system by running:

```bash
sudo apt-get install supervisor
```

To see if you installed it successfully type:

```bash
sudo supervisorctl version
```

that should return the version of supervisor.

Now to work with supervisor we'll have to write configuration files, these configuration files exist inside `/etc/supervisor/conf.d/` on Linux, these files have the extension `.conf`.

Let's create a configuration file for running gunicorn using supervisor, to do so type the below commands in your terminal:

```bash
cd /etc/supervisor/conf.d/
sudo touch gunicorn.conf
sudo nano gunicorn.conf
```

On the last line I opened the file in `nano` i.e. a terminal based text editor, you can use vim or any other text editor of your choice.

Then paste the following configuration inside it:

```plain
[program:gunicorn]
directory=/home/ubuntu/my-django-project/
command=/home/ubuntu/my-django-project/venv/bin/gunicorn --access-logfile - --log-level DEBUG --workers 4 --bind 127.0.0.1:8000 my-django-project.wsgi:application
autostart=true
autorestart=true
stderr_logfile=/home/ubuntu/my-django-project/logs/gunicorn/gunicorn.err.log
stdout_logfile=/home/ubuntu/my-django-project/logs/gunicorn/gunicorn.out.log
```

Now, be sure to replace `/home/ubuntu/my-django-project` with path to your django project and `/home/ubuntu/my-django-project/venv/` with the path to your virtualenv. Now, if you notice there are two config at the end, `stderr_logfile` and `stdout_logfile` respectively, what they do is that define the path of the file where the error and output logs of the service should be saved, so be sure replace it with path where you want to save your logs.

> **Tip** : If you mention any non existing directories in your path, be sure to create them beforehand or else supervisor will fail to start our service.

Now let's restart supervisor for it to start running our service, for that type the following in your terminal:

```bash
sudo supervisorctl reload
```

Let's check whether the above started our gunicorn service or not, by typing:

```bash
sudo supervisorctl status
```

If you follow the above steps correctly, you can safely integrate it with our previous NGINX configuration we discussed in our previous article.

## Reference

1. [Supervisor Config](http://supervisord.org/configuration.html#program-x-section-settings)
