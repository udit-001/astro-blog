---
title: "Updating Python Packages"
description: "Find out about outdated python packages on your system"
date: "2020-07-12"
tags:
  - python
  - til
---

## Overview

Today I wanna talk about a neat way I just discovered to find out which python packages present on my system or virtualenv are outdated. To find out, type the following in your terminal:

```
pip list --outdated
```

This will display an output similar to one shown below:
![](https://res.cloudinary.com/idiomprog/image/upload/v1600082493/Idiomatic%20Programmers/package-list.png)

Then you can proceed to update the packages as per your needs. For example we can update `virtualenv` package as follows:

```
pip install --upgrade virtualenv
```

## Security Updates
After finding out about the above feature, I wanted to find out if there was a way to find out about only the security updates available for the installed packages. Then I found out about [safety](https://github.com/pyupio/safety/). 

Safety checks your installed dependencies for known security vulnerabilities. It uses the open Python vulnerability database [Safety DB](https://github.com/pyupio/safety-db).

To install it, type the following in your terminal:

```
pip install safety
```

Then to check the installed packages for known vulnerabilities, run the below command:

```
safety check
```

This will output the packages with known vulnerabilities similar to the one shown below:

![](https://res.cloudinary.com/idiomprog/image/upload/v1600082493/Idiomatic%20Programmers/safety-check.png)

Then you can proceed to update the packages with security updates by using commands such as:

```
pip install --upgrade django
```

So that’s it for today’s "Today I Learned" post.
