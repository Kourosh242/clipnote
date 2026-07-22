# CHANGELOG

## 1.2.9 - 2026-07-13

### Added
- Added a settings section for checking updates.
- Added a button that opens the GitHub project page for manual updating.
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
- Added author credit: Created by Kourosh & Nova.
