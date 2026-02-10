# SurfingBro Extension (MCP Bridge)

![SurfingBro icon](./assets/icon.png)

This extension connects your local MCP server to the browser via WebSocket and exposes
browser actions to an LLM through the MCP tool pipeline.

Repository: https://github.com/adityalohuni/surfing-bros-extension  
Parent: https://github.com/adityalohuni/surfing-bros

## How It Works

- **Background** keeps a WebSocket connection to the MCP server (`ws://localhost:9099/ws`).
- **Content script** executes actions (click, scroll, snapshot, etc.).
- **tRPC messaging** (`trpc-browser`) routes requests between background and content.
- **MCP Console page** is a lightweight debug UI for status + tab targeting.

## Quick Start

```bash
cd /home/hage/project/SurfingBro/extension
pnpm install
pnpm dev
```

Then:

1. Start the MCP server (Go).
2. Open the extension side panel to access SurfingBro.
3. Click **Connect** and choose a tab target if needed.

## Requirements

- Node.js 18+ and `pnpm`
- Chrome/Chromium

## UI Pages

- Sidepanel: main chat UI (sessions, context, model selection)
- MCP Console: debug/status page (`mcp.html`)

## Actions Supported

All actions are handled through WebSocket commands:

- `click`
- `scroll`
- `find`
- `hover`
- `type` (supports `pressEnter`)
- `enter`
- `back`
- `forward`
- `navigate`
- `waitForSelector`
- `snapshot`
- `select` (multi + partial + toggle)
- `screenshot` (element or viewport)
- `start_recording`
- `stop_recording`
- `get_recording`

## Protocol Reference (Payloads)

Each WebSocket message looks like:

```json
{ "id": "uuid", "type": "action", "payload": { ... } }
```

### click
```json
{ "selector": "button.buy" }
```

### scroll
```json
{
  "deltaX": 0,
  "deltaY": 600,
  "selector": ".scroll-area",
  "behavior": "smooth",
  "block": "center"
}
```

### find
```json
{
  "text": "pricing",
  "limit": 25,
  "radius": 60,
  "caseSensitive": false
}
```

### hover
```json
{ "selector": ".menu-item" }
```

### type
```json
{
  "selector": "input[name='q']",
  "text": "surfing bro",
  "pressEnter": true
}
```

### enter
```json
{ "selector": "input[name='q']", "key": "Enter" }
```

### back / forward
```json
{}
```

### navigate
```json
{ "url": "https://example.com" }
```

### waitForSelector
```json
{ "selector": ".checkout", "timeoutMs": 8000 }
```

### snapshot
```json
{
  "includeHidden": false,
  "maxElements": 120,
  "maxText": 4000,
  "includeHTML": false,
  "maxHTML": 20000,
  "maxHTMLTokens": 2000
}
```

### select
```json
{
  "selector": "select#tags",
  "values": ["news", "finance"],
  "matchMode": "partial",
  "toggle": true
}
```

### screenshot
```json
{
  "selector": ".hero-card",
  "padding": 8,
  "format": "png",
  "maxWidth": 800,
  "maxHeight": 800
}
```

If `selector` is omitted for screenshot, the current viewport is captured.

### start_recording / stop_recording
```json
{}
```

### get_recording
```json
{}
```

## Response Reference (Data)

Responses are sent as:

```json
{ "id": "uuid", "ok": true, "data": { ... } }
```

### click
```json
{ "selector": "button.buy" }
```

### scroll
```json
{
  "deltaX": 0,
  "deltaY": 600,
  "selector": ".scroll-area",
  "behavior": "smooth",
  "block": "center"
}
```

### find
```json
{
  "query": "pricing",
  "limit": 25,
  "radius": 60,
  "caseSensitive": false,
  "total": 12,
  "returned": 12,
  "results": [
    { "index": 243, "snippet": "…pricing page for details…" }
  ]
}
```

### hover
```json
{ "selector": ".menu-item" }
```

### type
```json
{
  "selector": "input[name='q']",
  "textLength": 11,
  "pressEnter": true
}
```

### enter
```json
{ "selector": "input[name='q']", "key": "Enter", "usedActiveElement": false }
```

### back / forward
```json
{ "direction": "back" }
```

### navigate
```json
{ "url": "https://example.com" }
```

### waitForSelector
```json
{ "selector": ".checkout", "timeoutMs": 8000, "found": true }
```

### snapshot
```json
{
  "url": "https://example.com",
  "title": "Example",
  "text": "...",
  "elements": [],
  "elementCount": 213,
  "textLength": 14582,
  "truncatedText": true,
  "truncatedElements": true,
  "htmlLength": 58231,
  "truncatedHTML": true,
  "htmlEstimatedTokens": 14558
}
```

### select
```json
{
  "selector": "select#tags",
  "value": "news",
  "label": "News",
  "index": 0,
  "values": ["news", "finance"],
  "labels": ["News", "Finance"],
  "indices": [0, 3],
  "matchMode": "partial",
  "toggle": true,
  "multiple": true,
  "selectedCount": 2
}
```

### screenshot
```json
{
  "selector": ".hero-card",
  "dataUrl": "data:image/png;base64,...",
  "width": 640,
  "height": 360,
  "format": "png"
}
```

### start_recording / stop_recording
```json
{ "recording": true, "count": 12 }
```

### get_recording
```json
[
  {
    "type": "click",
    "payload": { "selector": "#login" },
    "timestamp": 1711234567890,
    "url": "https://example.com",
    "title": "Example"
  }
]
```

## Error Responses

Errors return:

```json
{ "id": "uuid", "ok": false, "error": "message", "errorCode": "CODE" }
```

Common error cases:

- `Element not found` — selector did not match any element.
- `No active tab available` — background couldn't resolve a target tab.
- `Timed out waiting for selector: ...` — `waitForSelector` timeout.
- `Element has zero size` — screenshot target has no renderable bounds.
- `Option not found` — select couldn't match the provided value/label/index.

Common `errorCode` values:

- `NO_ACTIVE_TAB`
- `ELEMENT_NOT_FOUND`
- `INVALID_INPUT`
- `INVALID_TARGET`
- `OPTION_NOT_FOUND`
- `TIMEOUT`
- `NO_ACTIVE_ELEMENT`
- `UNSUPPORTED_COMMAND`
- `COMMAND_FAILED`
- `SCREENSHOT_FAILED`

### Example Commands

```json
{ "type": "click", "payload": { "selector": "button.buy" } }
```

```json
{ "type": "scroll", "payload": { "deltaY": 600, "behavior": "smooth" } }
```

```json
{ "type": "type", "payload": { "selector": "input[name='q']", "text": "surfing", "pressEnter": true } }
```

```json
{ "type": "snapshot", "payload": { "maxText": 4000, "maxElements": 100, "includeHTML": false } }
```

```json
{ "type": "screenshot", "payload": { "selector": ".hero-card", "padding": 8, "format": "png" } }
```

## Files to Know

- `entrypoints/background.ts` — WebSocket + action router
- `entrypoints/content.ts` — content entrypoint
- `entrypoints/shared/contentActions.ts` — action implementations
- `entrypoints/shared/contentRouter.ts` — tRPC router for content
- `entrypoints/mcp/` — MCP Console UI

## Notes

- The extension is designed for **LLM-driven agentic use** through MCP.
- The MCP Console is **dev-only**; the primary user is the MCP client.

## Recorder

The MCP Console includes a lightweight **action recorder**:

1. Click **Start** to record.
2. Perform interactions in the browser tab.
3. Click **Stop**, then **Export** to get JSON.

Recorded actions match the WebSocket action payloads, so they can be replayed or used as LLM hints.
