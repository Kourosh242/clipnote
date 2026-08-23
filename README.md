# ClipNote

[English](README.md) · [فارسی](README.fa.md)

**A modern, fast, and private clipboard notebook for Chrome.**

[Website](https://kourosh242.github.io/clipnote/) · [ویکی فارسی](https://kourosh242.github.io/clipnote/wiki/fa/) · [Wiki](https://kourosh242.github.io/clipnote/wiki/) · [Download v1.3.0](https://github.com/Kourosh242/clipnote/releases/latest) · [Source](https://github.com/Kourosh242/clipnote)

![ClipNote](docs/assets/images/og.png)

ClipNote turns selected web text, code snippets, ideas, and secrets into a local notebook that never leaves your browser. The interface is fully bilingual — English and Persian — and Persian uses the bundled **Vazirmatn** font with a complete RTL layout.

Created by **Kourosh & Mehdi**.

## Choose your language

| Language | File | Website | Wiki |
| --- | --- | --- | --- |
| English | [README.md](README.md) | [Landing page](https://kourosh242.github.io/clipnote/) | [Wiki](https://kourosh242.github.io/clipnote/wiki/) |
| فارسی | [README.fa.md](README.fa.md) | [صفحه فارسی](https://kourosh242.github.io/clipnote/fa/) | [ویکی فارسی](https://kourosh242.github.io/clipnote/wiki/fa/) |

## Why ClipNote

- **Local-first** — notes live in `chrome.storage.local`. No account, no ClipNote server.
- **Quick Save** — select text on any page, right-click, save with page title and URL.
- **Workspaces** — keep Work, Personal, and side projects apart.
- **Smart tags** — Python, CSS, Git, Docker, JSON, Markdown and more are suggested as you type.
- **Markdown** — headings, tables, lists, images, links, and copyable code blocks.
- **Note locks** — password or 4-digit PIN, hashed with PBKDF2-SHA256, optional recovery question.
- **Bilingual UI** — English or فارسی in one click, Vazirmatn for Persian text.
- **Themes** — Blue, Green, Purple, Orange, Dark Pro, plus dark mode.
- **Backups** — export / import JSON (merge-safe) and export TXT.

<p align="center">
  <img src="docs/assets/images/hero-manager.png" alt="ClipNote manager" width="720">
</p>
<p align="center">
  <img src="docs/assets/images/hero-popup.png" alt="ClipNote popup" width="280">
</p>

## Install

1. Download [`clipnote_1.3.0.zip`](https://github.com/Kourosh242/clipnote/releases/download/v1.3.0/clipnote_1.3.0.zip).
2. Extract the folder that contains `manifest.json`.
3. Open `chrome://extensions` and enable **Developer mode**.
4. Click **Load unpacked** and select that folder.
5. Pin the icon. Press `Ctrl+Shift+N` (`⌘+Shift+N` on macOS).

From this repository you can also load `clipnote_v1.3.0/` directly.

## Daily use

| Do this | How |
| --- | --- |
| Capture a webpage snippet | Select text → right-click → **Save to ClipNote** |
| Write a quick note | Popup → **New** |
| Open the full notebook | Popup → manager icon, or the extension options page |
| Lock a secret | Manager → Protection → Lock (password or PIN) |
| Switch to Persian | Settings → Language → فارسی |
| Move computers | Settings → Export JSON, then Import JSON |

## Shortcuts

| Action | Windows / Linux | macOS |
| --- | --- | --- |
| Open popup | `Ctrl+Shift+N` | `⌘+Shift+N` |
| New note | `Ctrl+N` | `⌘+N` |
| Save | `Ctrl+S` | `⌘+S` |
| Search | `Ctrl+F` | `⌘+F` |
| Close / back | `Esc` | `Esc` |

## Project layout

```
clipnote_v1.3.0/     Chrome extension (Manifest V3)
docs/                GitHub Pages site, wiki UI, Vazirmatn, screenshots
README.md            English readme (this file)
README.fa.md         Persian readme
```

The unpacked extension lives in `clipnote_v1.3.0/`:

- `manifest.json` — permissions, icons, commands
- `background.js` — install, context menu, update alarm
- `popup.html` / `popup.js` — toolbar notebook
- `options.html` / `options.js` — full manager
- `shared.js` / `shared.css` — storage, Markdown, i18n helpers, themes
- `assets/` — Vazirmatn woff2 fonts for offline Persian UI

## Privacy

Notes never leave the device except when you export them yourself. Update checks only read the public GitHub Releases API. Read [Privacy](https://kourosh242.github.io/clipnote/privacy.html) for the full list of permissions.

## Documentation

- Website: https://kourosh242.github.io/clipnote/
- English wiki: https://kourosh242.github.io/clipnote/wiki/
- Persian wiki: https://kourosh242.github.io/clipnote/wiki/fa/
- GitHub wiki: https://github.com/Kourosh242/clipnote/wiki
- Changelog: [CHANGELOG.md](CHANGELOG.md)

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports and feature ideas are welcome in Issues.

## License

[MIT](LICENSE) © 2026 Kourosh & Mehdi
