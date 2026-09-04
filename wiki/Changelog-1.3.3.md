# تغییرات 1.3.3 / Changelog 1.3.3

## فارسی

- **رفع باگ:** یادداشت‌های قفل/رمزنگاری‌شده دیگر هنگام نرمال‌سازی و مهاجرت داده‌ها، متادیتای رمزنگاری خود (`contentIv`، `wrappedKey`، `wrapIv`) و دادهٔ کلید بازیابی (`wrappedKey`، `wrapIv`) را از دست نمی‌دهند. در نسخهٔ قبلی این موضوع می‌توانست یادداشت‌های قفل‌شدهٔ قبلی را برای همیشه غیرقابل بازکردن کند.
- **رفع باگ:** اعلان به‌روزرسانی حالا از زبان رابط پیروی می‌کند (فارسی/انگلیسی).
- **رفع باگ:** ویرایشگر Popup پیش از دور ریختن تغییرات ذخیره‌نشده هشدار می‌دهد (جلوگیری از از دست رفتن داده).
- **رفع باگ:** برچسب «ذخیره» (Save) در حالت انگلیسی Popup که خالی بود، اضافه شد.
- **رفع باگ:** ماژول مشترک (`shared.js`) حالا زبان خود را با Popup همگام می‌کند (توست‌ها و پیام‌های محلی).
- **رفع باگ:** فراخوانی نامعتبر callback در `chrome.alarms.create` و تگ اضافی `</html>` در صفحهٔ Options حذف شد.
- **بهبود:** بررسی نسخهٔ جدید از این پس در راه‌اندازی مرورگر نیز انجام می‌شود، علاوه بر بررسی دوره‌ای (alarm).

## English

- **Bug fix:** encrypted/locked notes no longer lose their encryption metadata (`contentIv`, `wrappedKey`, `wrapIv`) and recovery key-wrap data (`wrappedKey`, `wrapIv`) during normalization and data migration. Previously this could make previously locked notes permanently unreadable.
- **Bug fix:** update notifications now follow the interface language (Persian/English).
- **Bug fix:** the popup editor now warns before discarding unsaved changes (prevents data loss).
- **Bug fix:** added the missing English "Save" label in the popup.
- **Bug fix:** the shared module now syncs its locale with the popup (toasts and localized messages).
- **Bug fix:** removed an invalid callback on `chrome.alarms.create` and a stray duplicate `</html>` tag in the options page.
- **Improvement:** the update check now also runs at browser startup, in addition to the periodic alarm.
