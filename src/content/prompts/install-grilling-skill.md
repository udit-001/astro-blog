---
title: Install the Grilling Skill (Full Folder)
description: Have opencode clone a repo and install a skill complete with its referenced files
date: 2026-08-16
tags:
  - opencode
  - skills
  - ai
---
```markdown
Install the "grilling" skill for me at the user level (globally), keeping all
its referenced files so it works fully.

Clone the repo to a temporary location:
https://github.com/mattpocock/skills

Then copy the entire skill folder, including every file it references, from:
  <temp-repo>/skills/productivity/grilling
to:
  ~/.config/opencode/skills/grilling

Copy the whole folder (SKILL.md and any sibling files such as an "agents/"
directory or other references), not just SKILL.md. Remove the temporary clone
when done. Then tell me it's ready.
```