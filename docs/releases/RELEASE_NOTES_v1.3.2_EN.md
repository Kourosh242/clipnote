# ClipNote v1.3.2 — Release Notes (English)

> **Release date:** Aug 23, 2026  
> **Authors:** [Kourosh](https://github.com/Kourosh242) & [Mehdi](https://github.com/MR-SHARIFI-Dev)  
> **Download:** [clipnote-v1.3.2.zip](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip)  
> **Official Wiki:** https://kourosh242.github.io/clipnote/

## Summary

v1.3.2 is a **stability and security hardening** release. It focuses on concurrency safety, Markdown reliability, migration cleanup, and clearer privacy docs.

## Fixed

- **Concurrency:** Hardened concurrent writes with Web Locks and latest-state merging
- **Errors:** Explicit handling for Storage, Import and FileReader failures — no more false success messages
- **Migration:** Tolerates null records, malformed data, and de-duplicates IDs during migration
- **Markdown:** Fixed code blocks (no double-escape), safe links (blocks javascript:), parenthesized URLs, nested lists, and popup code copying
- **Popup:** Fixed state loss, ignored suggestions, Quick Capture category reset, and externally deleted notes
- **Update checker:** Strict SemVer parsing (only vX.Y.Z), prerelease filtering, clock-skew-safe cache, and failed notification bookkeeping
- **Settings:** Restored persisted sidebar state and made Clear All Data clear every ClipNote key
- **Permissions:** Reduced unnecessary permissions, set Chrome 111 as minimum
- **UI:** Restored responsive access to Settings/Categories/Tags without redesigning visual theme
- **i18n:** Added missing `discardChanges` translation

## Changed

- Bumped extension and source directory to `1.3.2`
- Clarified security, local-lock limitations, backups, and import/export formats in docs

## Security & Privacy

> **Lock limitation:** Password/PIN only limits access inside ClipNote UI and does **not** encrypt stored content. JSON/TXT exports may contain locked note content; treat backups as sensitive.

- All data stays in `chrome.storage.local` on your device
- No analytics, ads, or ClipNote server for private content
- Only network request is public GitHub release metadata for update notifications

## Quick Install

### Back up first!

1. Open ClipNote → **Settings → Import / Export**
2. Click **Export JSON** and keep it safe
3. Restore later with **Import JSON** if needed (imports merge)

### Install v1.3.2

1. Download and extract [`clipnote-v1.3.2.zip`](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip) from Releases
2. Open `chrome://extensions/`, enable **Developer mode**
3. Click **Load unpacked** and select the extracted `clipnote` folder containing `manifest.json`
4. When updating, back up first, replace folder, then click **Reload**

> ZIP is published only as a GitHub Release asset, not on `main`.

## Features

- Save selected text via right-click → Save to ClipNote
- Workspaces, categories, tags, smart suggestions
- Per-note lock with Password or 4-digit PIN + recovery question
- Markdown preview & split view
- Dark mode, themes, font size, auto-save, Persian RTL with offline Vazirmatn
- JSON/TXT import/export and background auto-update notifications

## Links

- 📚 [Online Wiki](https://kourosh242.github.io/clipnote/)
- 📦 [Releases](https://github.com/Kourosh242/clipnote/releases)
- 📝 [WIKI.md](WIKI.md)
- 📋 [CHANGELOG.md](CHANGELOG.md)

Made with ❤️ by Kourosh & Mehdi
