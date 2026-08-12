---
title: Set Up Playwright Browser MCP
description: Tell opencode to add the Playwright MCP server for browser automation
date: 2026-08-15
tags:
  - opencode
  - mcp
  - playwright
---
```markdown
Add the Playwright MCP server to my opencode config so I can control a browser.

Add it to the "mcp" section in opencode.json:

playwright: {
  "type": "local",
  "command": ["npx", "@playwright/mcp@latest"],
  "enabled": true
}

Keep anything else in the file untouched. Tell me when it's ready.
```