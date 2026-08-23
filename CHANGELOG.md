# CHANGELOG

📚 ویکی آنلاین: [kourosh242.github.io/clipnote](https://kourosh242.github.io/clipnote/)

## 1.3.2 - 2026-08-23

### فارسی

#### رفع‌شده
- مقاوم‌سازی ذخیره‌سازی هم‌زمان یادداشت‌ها با Web Locks و merge آخرین داده‌ها.
- مدیریت صریح خطاهای Storage، Import و FileReader و جلوگیری از پیام موفقیت اشتباه.
- اعتبارسنجی نسخه و اندازهٔ فایل پشتیبان و پاک‌سازی داده‌های خراب و شناسه‌های تکراری در مهاجرت.
- اصلاح Markdown شامل code block، لینک‌های امن، URLهای دارای پرانتز، فهرست‌های تو‌در‌تو و کپی کد در Popup.
- اصلاح از دست رفتن state در Popup، پیشنهادهای نادیده‌گرفته‌شده، دسته‌بندی Quick Capture و Noteهای حذف‌شده در context دیگر.
- اصلاح بررسی نسخه، SemVer، prereleaseها، cache زمانی و اعلان‌های ناموفق.
- بازگردانی وضعیت Sidebar و پاک‌سازی کامل همهٔ کلیدها در Clear All Data.
- کاهش permissionهای غیرضروری و تعیین حداقل Chrome 111.
- اصلاح دسترسی Responsive به Settings، Category و Tag بدون تغییر زبان بصری رابط.

#### تغییرکرده
- نسخهٔ افزونه و پوشهٔ سورس به `1.3.2` ارتقا یافت.
- مستندات امنیت، محدودیت قفل محلی، Backup و Import/Export شفاف‌تر شدند.

### English

#### Fixed
- Hardened concurrent note writes with Web Locks and latest-state merging.
- Added explicit Storage, import, and FileReader failure handling.
- Added backup version/size validation and migration cleanup for malformed or duplicate records.
- Fixed Markdown code blocks, safe links, parenthesized URLs, nested lists, and popup code copying.
- Fixed popup state loss, ignored suggestions, Quick Capture category resets, and externally deleted notes.
- Fixed update parsing, prerelease filtering, clock-skewed cache entries, and failed-notification bookkeeping.
- Restored persisted sidebar state and made Clear All Data clear every ClipNote key.
- Reduced unnecessary permissions and set Chrome 111 as the supported minimum.
- Restored responsive access to Settings, Categories, and Tags without redesigning the visual theme.

#### Changed
- Bumped the extension and source directory to `1.3.2`.
- Clarified security, local-lock limitations, backups, and supported import/export formats.

## 1.3.1 - 2026-08-23

### فارسی

#### اضافه‌شده
- نمایش کارت **وضعیت نسخه** در Settings با نسخهٔ فعلی `v1.3.1`.
- نمایش متن **شما به‌روز هستید.** به‌صورت بولد برای نسخهٔ فعلی.
- ویکی آنلاین دو‌زبانه و واکنش‌گرا با GitHub Pages و فونت محلی Vazirmatn.
- لینک مستقیم نام‌های Kourosh و Mehdi به پروفایل GitHub آن‌ها در Settings.
- فایل توزیع آمادهٔ نصب `clipnote-v1.3.1.zip` در ریلیز.

#### تغییرکرده
- نسخهٔ Manifest و پوشهٔ سورس از `1.3.0` به `1.3.1` ارتقا یافت.
- کنترل‌ها و متن راهنمای بررسی دستی به‌روزرسانی از رابط کاربری حذف شدند؛ به‌روزرسانی خودکار پس‌زمینه و اعلان‌های Chrome حفظ شده‌اند.
- مستندات فارسی و انگلیسی، راهنمای نصب و لینک ویکی با ریلیز جدید همگام شدند.
- فایل ZIP از شاخهٔ `main` حذف شد؛ دانلودها اکنون فقط به Asset رسمی GitHub Releases اشاره می‌کنند و راهنمای پشتیبان‌گیری JSON پیش از به‌روزرسانی اضافه شد.

#### رفع‌شده
- Settings دیگر کاربر را به بررسی دستی دوره‌ای دعوت نمی‌کند و وضعیت نسخه را شفاف نشان می‌دهد.
- نام سازندگان در بخش About قابل کلیک و به مقصد درست هدایت می‌شود.

### English

#### Added
- A **Version Status** card in Settings showing the current `v1.3.1` release.
- A bold **You are up to date.** message for the current release.
- A responsive bilingual GitHub Pages wiki using the bundled Vazirmatn font.
- Direct GitHub profile links for Kourosh and Mehdi in Settings.
- The ready-to-install `clipnote-v1.3.1.zip` release asset.

#### Changed
- Bumped the Manifest version and source directory from `1.3.0` to `1.3.1`.
- Removed manual update-check controls and guidance from the UI while keeping background automatic update notifications.
- Synchronized the Persian and English documentation, installation guide, and wiki links with the new release.
- Removed the ZIP from the `main` branch; downloads now use the official GitHub Release asset only, with JSON backup guidance before updating.

#### Fixed
- Settings no longer asks users to perform periodic manual checks and now presents a clear version status.
- Creator names in About are clickable and point to the correct GitHub profiles.

## 1.3.0 - 2026-08-21

### Added
- Automatic, periodic update checking via `chrome.alarms` (runs in the background every 6 hours, no need to open the extension).
- Automatic update notification shown once per new version, with a click-through to the GitHub release page.
- Robust version parsing that only accepts semantic version tags (e.g. `v1.3.0`) and ignores non-numeric tags such as `new_ver1`.
- Tag fallback now scans multiple recent tags and picks the highest valid version.
- Dynamic "About" version label in Settings (reads from `manifest.json`).

### Changed
- Bumped version from 1.2.9 to 1.3.0.
- Renamed the distribution folder from `clipnote_v1.2.9` to `clipnote` (matches the documented structure).
- Added `alarms` permission to the manifest.

### Fixed
- Fixed the update checker never detecting a new version because non-semver release tags (e.g. `new_ver1`) were parsed as version `0`.
- Fixed update checks only running when the popup/settings were opened — now they also run automatically in the background.

### For maintainers
- Future release tags MUST use the `vX.Y.Z` format for the auto-update notification to work correctly.

## 1.2.9 - 2026-07-13

### Added
- Added the original settings update-information section (removed from the current UI in 1.3.1).
- Added a GitHub project link for obtaining releases manually.
- Added update-available indicators in popup/settings/menu when a newer version is detected.
- Added more manager-level features into popup where practical.
- Added popup editing tools such as workspace, category, tags, quick tags, suggestions, color, pin/favorite, preview mode, and popup-side undo.

### Changed
- Improved Persian localization for manager and popup interface labels.
- Kept user-created workspace/category names unchanged while localizing only UI/system texts.
- Added a privacy-safe GitHub-only update check flow.

### Fixed
- Fixed timeline labels such as Today / Yesterday / This Week / This Month / Older not being localized in Persian.
- Fixed sort labels like Last Updated remaining in English while the interface language was Persian.
- Fixed update visibility so users can see new-version state inside popup and settings without exposing private note data.
- Fixed unlock dialog localization so action buttons show proper Persian labels in Persian mode.
- Fixed recovery flow so after entering the recovery answer, the user can press the main unlock/open button and still open the note.

## 1.2.7 - 2026-07-13

### Added
- Undo action in the full editor.
- Ctrl+Alt+U shortcut for Undo inside the editor.
- Popup note editing directly inside the popup.
- Popup filters for all / pinned / favorites.
- Popup overview / timeline modes.
- Popup workspace/category/tags/quick-tags/suggestions/color/pin/favorite controls.
- About-this-tab helper text for default new-note color.

### Changed
- Merged normal view and timeline view into a single unified overview mode.
- Replaced the duplicate header action with Undo.
- Removed top-level import/export buttons from the list header to keep these actions inside Settings only.
- Undo history now remains available even after manual save or auto-save.

### Fixed
- Reduced awkward empty gaps between note cards by switching to a unified overview flow.
- Default new-note color settings are now clearer and more reliable in behavior.
- New-note default color is now visually easier to understand on note cards.
- Undo history is cleared only when the note/editor is closed, not when the note is saved.

## 1.2.6 - 2026-07-13

### Fixed
- Fixed RTL layout in the full manager so the sidebar/menu moves to the right side in Persian.
- Kept popup behavior unchanged as requested.
- Fixed JSON import so it no longer deletes current data and replaces everything.

### Improved
- JSON export now includes the complete important local dataset, including notes, settings, categories, workspaces, custom tags, and last quick-save state.
- JSON import now merges backup data with existing local data and keeps the current user data intact.

## 1.2.5 - 2026-07-13

### Fixed
- Fixed Dark Mode and Dark Pro styling inconsistencies in popup/shared components.
- Fixed locked-note behavior in popup so password/PIN is entered in the popup and the note content opens there instead of redirecting for unlock.
- Fixed popup unlock modal button spacing so confirm/cancel buttons no longer overlap the password field.
- Fixed popup theme color leaks caused by hardcoded accent shades.
- Fixed popup Persian font usage by ensuring Vazirmatn is applied correctly.
- Fixed popup title/topic input focus visuals so the field no longer looks clipped or outside the layout.

### Improved
- Added inline popup note viewer after successful unlock.
- Improved popup dark theme consistency for surfaces, inputs, buttons, banners, and badges.

## 1.2.4 - 2026-07-13

### Fixed
- Fixed popup font so Vazirmatn is correctly applied in the popup experience.
- Fixed popup input focus state so the title/topic field no longer looks clipped or out of bounds.
- Fixed theme color contamination caused by hardcoded blue/purple shades inside shared and popup styles.
- Fixed popup surfaces, banners, buttons, and badges to respect the active theme colors.

### Improved
- Popup visuals are now more consistent with the selected theme.
- Theme transitions between blue, green, purple, orange, and dark variants are cleaner.

## 1.2.3 - 2026-07-13

### Fixed
- Popup was rebuilt as a true lightweight Chrome extension popup instead of behaving like a compressed full-page view.
- Fixed popup sizing with a stable 380x560 layout and proper internal scrolling.
- Fixed quick note mode so it cleanly replaces the list view without mixed UI states.
- Fixed popup RTL layout while preserving a stable extension layout structure.
- Fixed popup lock modal placement and note list rendering flow.

### Improved
- Simplified popup UI for speed, readability, and lower visual clutter.
- Removed popup-only dead complexity and reduced unnecessary interface parts.
- Cleaned the popup layer to better match standard Chrome popup behavior.

## 1.2.2 - 2026-07-13

### Fixed
- Fixed broken popup sizing by returning to a fixed popup viewport with internal scrolling.
- Fixed popup quick-note mode so the list shell and capture shell do not conflict.
- Fixed RTL layout regressions that could distort sidebar and split editor structure.
- Fixed editor area height so the writing and preview panes no longer collapse to a very short height.
- Improved modal behavior and password visibility inputs.

### Improved
- Refined the popup and manager layout using safer Chrome-extension sizing patterns.
- Improved Persian RTL rendering while keeping application layout stable.
- Improved internal scroll behavior for popup and full-page editor sections.

## 1.2.1 - 2026-07-13

### Fixed
- Popup quick note mode no longer shows the search area while creating a note.
- Popup scrolling was fixed for normal mode, quick note mode, and unlock modal state.
- Removed the extra Popup timeline toggle section under the workspace selector.
- Removed Pinned / Favorites shortcuts from Popup and simplified note actions.
- Removed double-active navigation behavior in the full manager sidebar.
- Fixed duplicated / confusing titles between all-notes scope and workspace scope.
- Fixed password-entry UX by adding show/hide visibility controls.
- Fixed several UI flow issues that could make buttons feel inaccessible.

### Added
- Language setting with English / فارسی switch.
- Persian RTL rendering improvements with Vazirmatn.
- Improved professional visual polish for popup and manager.

### Changed
- Version upgraded from 1.2.0 to 1.2.1.
- Full manager sidebar simplified to focus on one active scope at a time.
- Popup redesigned to be cleaner and more task-focused.

## 1.2.0 - 2026-07-13
- Added context menu quick save.
- Added locked notes with password / PIN.
- Added timeline view.
- Added workspaces and smart tags.
- Added migration for new storage fields.

## 1.1.0
- Updated version to 1.1.0.
- Added author credit: Created by Kourosh & Mehdi.
