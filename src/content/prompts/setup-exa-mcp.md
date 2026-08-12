---
title: Set Up Exa Web Search MCP
description: Tell opencode to add the Exa MCP server for live web search
date: 2026-08-15
tags:
  - opencode
  - mcp
  - exa
---
```markdown
Add the Exa MCP server to my opencode config so I can search the web live.

Add it to the "mcp" section in opencode.json:

exa: {
  "type": "remote",
  "url": "https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa",
  "enabled": true
}

Keep anything else in the file untouched. Tell me when it's ready.
```