# ClipNote — دفترچه یادداشت کلیپ‌بورد

[![نسخه](https://img.shields.io/github/v/release/Kourosh242/clipnote?display_name=tag&sort=semver)](https://github.com/Kourosh242/clipnote/releases/latest)
[![License](https://img.shields.io/github/license/Kourosh242/clipnote)](https://github.com/Kourosh242/clipnote)

**نسخهٔ ۱.۳.۱** | ساخته‌شده توسط [**Kourosh**](https://github.com/Kourosh242) و [**Mehdi**](https://github.com/MR-SHARIFI-Dev)

> 📚 **[ورود به ویکی آنلاین ClipNote](https://kourosh242.github.io/clipnote/)** — راهنمای کامل، نصب، حریم خصوصی و امکانات پروژه را در یک صفحه ببینید.
>
> 📦 **[دانلود ClipNote v1.3.1](https://github.com/Kourosh242/clipnote/raw/main/release/clipnote-v1.3.1.zip)** · [مشاهدهٔ ریلیز](https://github.com/Kourosh242/clipnote/releases/tag/v1.3.1)

ClipNote یک افزونهٔ Google Chrome بر پایهٔ Manifest V3 است که یادداشت‌ها و متن‌های ذخیره‌شده را سریع، امن و کاملاً محلی مدیریت می‌کند. داده‌های شخصی در `chrome.storage.local` دستگاه شما باقی می‌مانند.

## امکانات اصلی

- ✅ ذخیره و مدیریت یادداشت‌ها به‌صورت کاملاً محلی
- 🌐 ذخیرهٔ سریع متن انتخاب‌شده با گزینهٔ **Save to ClipNote** در منوی راست‌کلیک
- 🔒 قفل‌گذاری هر یادداشت با **Password** یا **PIN چهاررقمی**
- 👁 نمایش یا مخفی‌کردن رمز هنگام قفل‌گذاری و بازکردن یادداشت
- 🗂️ فضاهای کاری برای جداسازی پروژه‌ها و مجموعه‌ها
- 🏷️ برچسب‌های پیش‌فرض، سفارشی و پیشنهادهای هوشمند
- 🕒 نمای کلی و Timeline برای مرور سریع یادداشت‌ها
- 🇮🇷 پشتیبانی کامل از **فارسی، RTL و فونت Vazirmatn** به‌صورت آفلاین
- 🇺🇸 رابط انگلیسی با چیدمان مناسب
- ⚙️ تنظیمات حرفه‌ای برای تم، اندازهٔ فونت، ذخیرهٔ خودکار و زبان
- 📥 ورود و خروجی گرفتن از داده‌ها با فرمت JSON و TXT
- 🧾 پیش‌نمایش Markdown با حالت Split View
- 🎨 Popup سبک و سریع با ابزارهای مدیریت یادداشت

## تغییرات نسخهٔ ۱.۳.۱

- 🔢 نسخهٔ افزونه و فایل توزیع به **1.3.1** ارتقا پیدا کرد.
- ✅ بخش بررسی دستی نسخه از رابط کاربری حذف شد؛ به‌جای آن در Settings یک کارت **وضعیت نسخه / Version Status** نمایش داده می‌شود.
- **متن «شما به‌روز هستید / You are up to date» در وضعیت نسخه به‌صورت بولد نمایش داده می‌شود.**
- 🔄 به‌روزرسانی خودکار پس‌زمینه و اعلان انتشار نسخهٔ جدید حفظ شده است؛ دیگر نیازی به بازکردن صفحهٔ تنظیمات برای بررسی نیست.
- 👤 نام‌های Kourosh و Mehdi در Settings به پروفایل GitHub آن‌ها لینک شده‌اند.
- 📚 یک ویکی دو‌زبانه و واکنش‌گرا با GitHub Pages و فونت محلی Vazirmatn اضافه شد.
- 📦 فایل ZIP آمادهٔ نصب در ریلیز v1.3.1 قرار گرفته است.

## سیستم به‌روزرسانی خودکار

از نسخهٔ ۱.۳.۰ به بعد، Service Worker افزونه به‌صورت دوره‌ای اطلاعات عمومی آخرین ریلیز GitHub را دریافت می‌کند. اگر نسخهٔ جدیدی منتشر شده باشد، Chrome یک اعلان نمایش می‌دهد و با کلیک روی آن صفحهٔ همان ریلیز باز می‌شود.

- این فرایند در پس‌زمینه انجام می‌شود و دکمهٔ بررسی دستی در رابط کاربری وجود ندارد.
- فقط اطلاعات عمومی نسخه از GitHub خوانده می‌شود؛ هیچ یادداشت یا دادهٔ خصوصی ارسال نمی‌شود.
- محدودیت Chrome Web Store باعث می‌شود نصب نهایی نسخهٔ جدید با دانلود ریلیز و Reload کردن افزونه انجام شود.

## نصب ClipNote v1.3.1 در Chrome

### روش سریع با فایل ریلیز

1. فایل [`clipnote-v1.3.1.zip`](https://github.com/Kourosh242/clipnote/raw/main/release/clipnote-v1.3.1.zip) را دانلود و استخراج کنید.
2. وارد `chrome://extensions/` شوید.
3. گزینهٔ **Developer mode** را فعال کنید.
4. روی **Load unpacked** کلیک کنید.
5. پوشهٔ استخراج‌شدهٔ `clipnote` را انتخاب کنید؛ فایل `manifest.json` باید مستقیماً داخل همین پوشه باشد.
6. برای نصب نسخهٔ جدید روی افزونه، پس از جایگزینی پوشه روی **Reload** کلیک کنید.

### نصب از سورس

پوشهٔ `clipnote_v1.3.1` در همین مخزن، سورس کامل افزونه است. آن را در Chrome با همان مراحل بالا به‌عنوان **Load unpacked** انتخاب کنید.

## ویکی آنلاین

ویکی رسمی پروژه در GitHub Pages منتشر می‌شود و شامل این بخش‌هاست:

- معرفی امکانات و گردش کار ClipNote
- راهنمای نصب و شروع سریع
- توضیح قفل‌گذاری، Markdown و ورود/خروجی داده‌ها
- مدل به‌روزرسانی خودکار و نکات رفع اشکال
- حریم خصوصی و امنیت
- لینک ریلیزها و پروفایل سازندگان

🔗 **[kourosh242.github.io/clipnote](https://kourosh242.github.io/clipnote/)**

## امنیت و حریم خصوصی

- یادداشت‌ها، تنظیمات، دسته‌بندی‌ها و فضاهای کاری فقط با `chrome.storage.local` نگهداری می‌شوند.
- محتوای یادداشت‌ها به سرور ClipNote یا سرویس تحلیل‌گر ارسال نمی‌شود.
- رمزها و PINها به‌صورت متن ساده ذخیره نمی‌شوند و با Web Crypto و PBKDF2 هش می‌شوند.
- تنها ارتباط شبکه‌ای افزونه برای اطلاع از ریلیز عمومی، به API عمومی GitHub است.
- فونت Vazirmatn و آیکن‌ها داخل افزونه بسته‌بندی شده‌اند تا رابط فارسی به اینترنت وابسته نباشد.

## مشارکت و ارتباط

- [پروفایل Kourosh](https://github.com/Kourosh242)
- [پروفایل Mehdi](https://github.com/MR-SHARIFI-Dev)
- [گزارش مشکل یا پیشنهاد در GitHub Issues](https://github.com/Kourosh242/clipnote/issues)
- [تاریخچهٔ تغییرات کامل](CHANGELOG.md)

---

## English

**Version 1.3.1** · built by [**Kourosh**](https://github.com/Kourosh242) and [**Mehdi**](https://github.com/MR-SHARIFI-Dev)

📚 **[Open the ClipNote online wiki](https://kourosh242.github.io/clipnote/)** · 📦 **[Download ClipNote v1.3.1](https://github.com/Kourosh242/clipnote/raw/main/release/clipnote-v1.3.1.zip)** · [View the release](https://github.com/Kourosh242/clipnote/releases/tag/v1.3.1)

ClipNote is a Manifest V3 Google Chrome extension for capturing, organizing, searching, protecting, and managing notes locally.

### What changed in 1.3.1

- Bumped the extension and distribution package to **1.3.1**.
- Removed the manual version-check section and button from the extension UI.
- Replaced it with a **Version Status** card; **“You are up to date.” is rendered in bold** for the current release.
- Kept background automatic update notifications, so users do not need to open Settings to trigger a check.
- Linked the Kourosh and Mehdi names in Settings to their GitHub profiles.
- Added a responsive bilingual GitHub Pages wiki with the bundled Vazirmatn font.
- Added the ready-to-install `clipnote-v1.3.1.zip` release asset.

### Install

Download the ZIP from [Release v1.3.1](https://github.com/Kourosh242/clipnote/releases/tag/v1.3.1), extract it, open `chrome://extensions/`, enable **Developer mode**, choose **Load unpacked**, and select the extracted `clipnote` directory.

The complete source lives in `clipnote_v1.3.1/`.

### Privacy

All note data remains in `chrome.storage.local`. The extension does not upload private notes. The background updater only reads public GitHub release metadata; passwords and PINs are hashed locally with Web Crypto PBKDF2.

Made with ❤️ by [Kourosh](https://github.com/Kourosh242) and [Mehdi](https://github.com/MR-SHARIFI-Dev).
