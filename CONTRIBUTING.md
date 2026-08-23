# Contributing to ClipNote

[English](CONTRIBUTING.md) · [فارسی](CONTRIBUTING.fa.md)

Thank you for helping ClipNote stay fast, private, and bilingual.

## Ways to help

- Report bugs with Chrome version, ClipNote version, and reproduction steps
- Suggest features that stay local-first (no required cloud account)
- Improve English or Persian copy
- Fix accessibility, RTL, or theme issues

## Development

1. Fork the repository and work on a feature branch.
2. Load `clipnote_v1.3.0/` as an unpacked extension in Chrome.
3. After JavaScript changes, click **Reload** on `chrome://extensions`.
4. Keep English and Persian strings in sync in `popup.js` and `options.js`.
5. Do not add remote fonts, analytics, or network calls except the existing GitHub update check.

## Pull requests

- Describe the user-facing change in English and, if you can, in Persian
- Keep the extension offline-capable
- Do not commit secrets or personal note backups

## Code of conduct

Be respectful. ClipNote is a small project for people who want a private notebook in the browser.
