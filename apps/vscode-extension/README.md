<p align="center">
  <img src="images/icon.png" alt="Plannotator for VS Code" width="128" />
</p>

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/7tg.plannotator-webview?label=Marketplace&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=7tg.plannotator-webview)
[![CI](https://github.com/7tg/plannotator-vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/7tg/plannotator-vscode/actions/workflows/ci.yml)
[![VS Code](https://img.shields.io/badge/VS%20Code-^1.85.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Opens [Plannotator](https://github.com/backnotprop/plannotator) plan reviews inside VS Code tabs instead of an external browser.

## Features

- Automatically intercepts Plannotator browser opens and displays them in a VS Code panel
- Persists your Plannotator settings (identity, permissions, editor preferences) across sessions
- Auto-closes the panel when you approve or send feedback on a plan
- Works with Claude Code running in VS Code's integrated terminal
- Configurable via VS Code settings
- Manual URL opening via command palette

## How It Works

When Plannotator opens a browser to show a plan review, this extension intercepts the request and opens it in a VS Code panel instead:

1. The extension injects a `PLANNOTATOR_BROWSER` environment variable into integrated terminals
2. When Plannotator opens a URL, the bundled router script sends it to the extension via a local HTTP server
3. The extension opens the URL in a custom WebviewPanel with an embedded iframe
4. A local reverse proxy handles cookie persistence (VS Code webview iframes don't support cookies natively) — settings are stored in VS Code's global state and restored transparently

## Requirements

- [Plannotator](https://github.com/backnotprop/plannotator) installed
- VS Code 1.85.0+

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `plannotatorWebview.injectBrowser` | `true` | Inject PLANNOTATOR_BROWSER env var into integrated terminals |

## Commands

- **Plannotator: Open URL** — Manually open a Plannotator URL in a panel

## Troubleshooting

### URL opens in external browser instead of VS Code
- Ensure `plannotatorWebview.injectBrowser` is enabled
- Open a **new** terminal after installing the extension (existing terminals won't have the env var)

### Panel shows a blank page
- Check if Plannotator's server is still running
- Some network configurations may block localhost access from the webview

## License

MIT
