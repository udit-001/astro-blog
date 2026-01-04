---
title: Important Flask Extensions You Should Use
description: A post listing all the important Flask extensions to use in production.
date: 2019-12-15
tags:
  - security
  - python
  - flask
---
When you start learning web development with Python, you are most likely to stumble upon Flask and Django. After doing some research you might realize that you don't need Django for your small web app that you want to do some fun stuff with. Then you decide to move ahead with Flask, because it seemed much more approachable than Django for beginners.

You might finish creating your fun project using Flask, but after some time you may decide to deploy it on a web server and let people access your web app publicly. But before you go ahead and do it, I would advise you to read the [Security considerations](https://flask.palletsprojects.com/en/1.1.x/security/ "Security Considerations") highlighted in the flask official documentation.

It talks about a lot of the security issues you might come across if you deployed your flask app as it is on a server. But I am only going to talk about the major ones here, so let's begin:

* [**Flask Bcrypt**](https://flask-bcrypt.readthedocs.io/en/latest/ "Flask Bcrypt") : Saving passwords in plaintext is a sin, you must have come across this phrase quite often. Now you may be wondering, I am just a beginner how am I supposed to do this, worry not.  By using this extension you'll easily be able to store your passwords in hashed form.
* [**Flask SeaSurf**](https://flask-seasurf.readthedocs.io/en/latest/ "Flask SeaSurf") : Next major issue with web applications is CSRF, you will want to make sure your web app is protected against such attacks.
* [**Flask Talisman**](https://github.com/GoogleCloudPlatform/flask-talisman "Flask Talisman") : This extension will improve your app's security way beyond the what the other two did in a much more easier manner. This adds some important security HTTP Headers that saves your site from many types of attacks. One thing that I should mention is the CSP header, that you should probably set to report_only if you don't know what you're doing or it has the potential to break your site.
