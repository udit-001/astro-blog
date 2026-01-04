---
title: Fixing Up Permissions After Data Migration in Django
description: Find out how I fixed my permissions after I imported my data
date: 2023-12-31
tags:
  - django
  - python
---
Hello djangonauts, today I wanna talk about a problem that I faced while working with Django. So here's the thing I just recently performed a major release at work, the database had to be changed since we had newer migrations and database structure. Naturally I had to import some data from my older database to the new one, which for most of the part could safely be done using fixtures (or so I thought). So I would like to share some tips and things that I learned recently because of it.

## Tip #1

Always exclude the [Content Type](https://docs.djangoproject.com/en/3.0/ref/contrib/contenttypes/) table while exporting a fixture for data migration.

It can be done as follows:

```bash
python manage.py dumpdata --exclude=contenttypes
```

Why? You may ask? It's because Django automatically creates these records when you perform the migrations for your apps. These records are basically used by django internally for schema management. So if you import them from the older database, Django would raise errors.

## Tip #2

Now if you were like me, you might have dumped your permissions records as well into the fixture, that's where the fun part comes in.

Now since content type was created afresh for the newer database, so their ids were different from the one in my previous database. And the permissions records which had the foreign key field to the Content Type model, used the older ids, so this essentially messed up all my permissions.

Usually if you're not making use of these, you can simply ignore them (which I wouldn't recommend personally). But since I was using these to provide staff accounts to people on the Django Admin with custom permissions, this meant that they might not have access to the right data or tables in the admin. So I thought, maybe I should manually fix these records and get done with it, but there were like 300 permissions in there, since there were many models, so I pondered whether there might be a better way to do it instead of doing it manually.

After a little bit of research, I came across `update_permissions`, a custom management command provided by [django extensions](https://django-extensions.readthedocs.io/en/latest/command_extensions.html), a very useful third party package I was already using in my project.
