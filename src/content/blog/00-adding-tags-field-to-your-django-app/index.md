---
title: "Adding Tags Field to Your Django App"
description: "Using django-taggit in your next project"
date: "2019-12-28"
tags:
  - django
  - python
---

## Overview

If you've been browsing tutorials about Django on YouTube, you must have stumbled across dozens of video series teaching you how to create a blog app using Django.

You might have already finished watching that series, and now you might be wondering about some of the more advanced functionalities you can add to your blog app, first thing that would come to your mind would be Tags, since you've been reading dozens of blog post about Django, and one thing that you would have seen at the end of the article would be tags. Today I will be teaching you how to add tags field to your blog app in Django.

## Django Taggit

We'll be using a package named [django-taggit](https://django-taggit.readthedocs.io/), activate your project's virtualenv and install this package as follows:

```bash
$ pip install django-taggit
```

* Add `taggit` to your project's `INSTALLED_APPS` inside `settings.py`
* Run `python managy.py migrate`, this will create tables for the models that comes with this package.
* Then to any model you want tagging on, do the following:

```python
from taggit.managers import TaggableManager
class Post(models.Model):
	title = models.CharField(max_length=255)
	content = models.TextField()
    tags = TaggableManager()
```

> **NOTE:** If you want taggit, to be case-insensitive when looking up existing tags, set `TAGGIT_CASE_INSENSITIVE = True` inside `settings.py`

### Adding tags
Now let's see its usage, suppose you want to add tags to your Post, you would do:

```python
my_post = Post.objects.get(pk=62)
my_post.tags.add("python", "django")
```

### Removing tags
If you would like to remove the `python` tag we just added above, you would do:

```python
my_post.tags.remove("python")
```

### Filtering based on tags
To filter posts tagged `python`, 

```python
Post.objects.filter(tags__name__in=["python"])
```

If you were to open your admin interface now to look at any of the post you just tagged above, then you would have ended up with a text field in your admin to add tags/display existing tags, which according to me isn't a good user experience, as you wouldn't be able to know about existing tags (in form of an autocomplete) when adding tags to your blog posts.

So I wanted to do something about it, after hours of searching the internet, I stumbled upon [taggit-selectize](https://github.com/chhantyal/taggit-selectize "taggit-selectize"), which does exactly what I was looking, now there were various other packages offering the same functionality as this one, but I found this to be most actively maintained one, and was quite easy to setup as well.

## Django Taggit Selectize

* Install this package by running the following command:

```bash
$ pip install taggit-selectize
```

* Put this in your `INSTALLED_APPS` as follows:

```python
INSTALLED_APPS = (
    'django.contrib.admin',
    ...
    ...
    'taggit',
    'taggit_selectize',
)
```

* Configure Taggit in your Django settings to use a custom string-to-tag parser that doesn't parse on spaces to match the functionality of Selectize.js, and a custom tag joiner that supports configurable delimiters.

```python
TAGGIT_TAGS_FROM_STRING = 'taggit_selectize.utils.parse_tags'
TAGGIT_STRING_FROM_TAGS = 'taggit_selectize.utils.join_tags'
```

* Update your `urls.py`:

```python
urlpatterns = [
    ...

    url(r'^taggit/', include('taggit_selectize.urls')),
    url(r'^admin/', include(admin.site.urls)),
    ...
]
```

* Use the TaggableManager from taggit_selectize (instead of taggit) in your models.

```python
from taggit_selectize.managers import TaggableManager

class Post(models.Model):
    tags = TaggableManager()
```

If you're using a custom tag model, you will need to tell selectize about that model, add the following line for it:

```python
TAGGIT_SELECTIZE_THROUGH = "tags.models.CustomTag"
```

replace `tags.models.CustomTag` with path to your own model, where `tags` is the name of the app containing your `CustomTag` model.

Hope, you had fun reading this post, if you found this helpful, share this with other fellow developers, and don't forget to leave a comment below.
