# توسعه / Development

## فارسی

کد در `clipnote-v1.3.3/` و بدون build step است. `manifest.json` را به‌عنوان Manifest V3 بررسی کنید. برای تست: پوشه را unpacked بارگذاری کنید، Popup و Options را باز کنید، ذخیرهٔ راست‌کلیک، Import/Export، قفل، تغییر زبان و بررسی نسخه را امتحان کنید. تغییرات UI در CSS مشترک و منطق داده در `shared.js` متمرکز است.

## English

The extension lives in `clipnote-v1.3.3/` and has no build step. Load it unpacked and test popup/options, context-menu capture, import/export, locks, locale switching, and update checks. Shared UI is in `shared.css`; shared storage and data logic is in `shared.js`.

Release contract: keep `manifest.json` version, the Git tag, and the release asset version aligned (for example `1.3.3`) so update checks can discover the release.
