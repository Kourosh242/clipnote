# ClipNote — دفترچه یادداشت کلیپ‌بورد

[![نسخه](https://img.shields.io/github/v/release/Kourosh242/clipnote?display_name=tag&sort=semver)](https://github.com/Kourosh242/clipnote/releases/latest)
[![License](https://img.shields.io/github/license/Kourosh242/clipnote)](https://github.com/Kourosh242/clipnote)

**نسخهٔ ۱.۳.۲** | ساخته‌شده توسط [**Kourosh**](https://github.com/Kourosh242) و [**Mehdi**](https://github.com/MR-SHARIFI-Dev)

> 📚 **[ویکی رسمی ClipNote](https://kourosh242.github.io/clipnote/)** — راهنمای کامل، نصب، پشتیبان‌گیری، حریم خصوصی و امکانات.
>
> 📦 **[دانلود فایل نصب v1.3.2](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip)** · **[مشاهدهٔ ریلیز و یادداشت‌های نصب](https://github.com/Kourosh242/clipnote/releases/tag/v1.3.2)**

ClipNote یک افزونهٔ Google Chrome بر پایهٔ Manifest V3 است که یادداشت‌ها و متن‌های ذخیره‌شده را سریع، امن و کاملاً محلی مدیریت می‌کند. داده‌های شخصی در `chrome.storage.local` دستگاه شما باقی می‌مانند.

## امکانات اصلی

- ✅ ذخیره و مدیریت یادداشت‌ها به‌صورت کاملاً محلی
- 🌐 ذخیرهٔ سریع متن انتخاب‌شده با گزینهٔ **Save to ClipNote** در منوی راست‌کلیک
- 🔒 قفل‌گذاری هر یادداشت با **Password** یا **PIN چهاررقمی**
- 🗂️ فضاهای کاری، دسته‌بندی‌ها، برچسب‌ها و پیشنهادهای هوشمند
- 🕒 نمای کلی و Timeline برای مرور سریع یادداشت‌ها
- 🇮🇷 پشتیبانی کامل از **فارسی، RTL و فونت Vazirmatn** به‌صورت آفلاین
- ⚙️ تنظیمات تم، اندازهٔ فونت، ذخیرهٔ خودکار و زبان
- 📥 ورود و خروجی گرفتن از داده‌ها با فرمت JSON و TXT
- 🧾 پیش‌نمایش Markdown با حالت Split View

## قبل از نصب یا به‌روزرسانی: پشتیبان بگیرید

> **مهم:** یادداشت‌ها فقط روی دستگاه شما ذخیره می‌شوند. پیش از نصب مجدد، جایگزین‌کردن پوشهٔ افزونه یا به‌روزرسانی، از داده‌ها یک نسخهٔ پشتیبان JSON بگیرید.

1. در ClipNote به **Settings / تنظیمات** بروید.
2. در بخش **Import / Export**، گزینهٔ **Export JSON** را انتخاب و فایل را در جای امنی نگه دارید.
3. پس از نصب نسخهٔ جدید، در صورت نیاز همان فایل را با **Import JSON** بازگردانید. ورود JSON داده‌های فعلی را با پشتیبان ادغام می‌کند.

## نصب ClipNote v1.3.2 در Chrome

1. فایل [`clipnote-v1.3.2.zip`](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip) را **فقط از صفحهٔ ریلیز** دانلود و استخراج کنید.
2. وارد `chrome://extensions/` شوید.
3. گزینهٔ **Developer mode** را فعال کنید.
4. روی **Load unpacked** کلیک کنید.
5. پوشهٔ استخراج‌شدهٔ `clipnote` را انتخاب کنید؛ فایل `manifest.json` باید مستقیماً داخل همین پوشه باشد.
6. برای به‌روزرسانی، پس از گرفتن پشتیبان و جایگزین‌کردن پوشه، روی **Reload** افزونه کلیک کنید.

> فایل ZIP در سورس شاخهٔ `main` نگهداری نمی‌شود؛ نسخهٔ قابل نصب فقط به‌عنوان Asset در [GitHub Releases](https://github.com/Kourosh242/clipnote/releases) منتشر می‌شود.

## مستندات و پیوندها

- 📚 [ویکی آنلاین — راهنمای کامل و دو‌زبانه](https://kourosh242.github.io/clipnote/)
- 📦 [آخرین ریلیزها و فایل‌های نصب](https://github.com/Kourosh242/clipnote/releases)
- 📝 [ویکی Markdown در مخزن](WIKI.md) — راهنمای کامل فارسی + English quick ref
- 📖 [راهنمای نصب فارسی کامل](INSTALL_FA.md) — مرحله به مرحله با عیب‌یابی
- 📰 [یادداشت انتشار فارسی v1.3.2](RELEASE_NOTES_v1.3.2_FA.md)
- 📰 [Release notes English v1.3.2](RELEASE_NOTES_v1.3.2_EN.md)
- 📋 [تاریخچهٔ تغییرات](CHANGELOG.md)
- 🐛 [گزارش مشکل یا پیشنهاد](https://github.com/Kourosh242/clipnote/issues)

## امنیت و حریم خصوصی

- یادداشت‌ها، تنظیمات، دسته‌بندی‌ها و فضاهای کاری فقط با `chrome.storage.local` نگهداری می‌شوند.
- محتوای یادداشت‌ها به سرور ClipNote یا سرویس تحلیل‌گر ارسال نمی‌شود.
- رمزها و PINها با Web Crypto و PBKDF2 به‌صورت محلی هش می‌شوند. **قفل، کنترل دسترسی داخل رابط است و محتوای ذخیره‌شده را رمزنگاری نمی‌کند.**
- خروجی‌های JSON/TXT می‌توانند محتوای یادداشت‌های قفل‌شده را هم داشته باشند؛ فایل پشتیبان را مانند دادهٔ حساس نگهداری کنید.
- تنها ارتباط شبکه‌ای افزونه برای اطلاع از ریلیز عمومی، به API عمومی GitHub است.

---

## English

**Version 1.3.2** · built by [**Kourosh**](https://github.com/Kourosh242) and [**Mehdi**](https://github.com/MR-SHARIFI-Dev)

> 📚 **[Open the official ClipNote wiki](https://kourosh242.github.io/clipnote/)** — complete installation, backup, privacy, and feature guide.
>
> 📦 **[Download the v1.3.2 installer](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip)** · **[View release notes and installation steps](https://github.com/Kourosh242/clipnote/releases/tag/v1.3.2)**

ClipNote is a local-first Manifest V3 Chrome extension for capturing, organizing, searching, protecting, and managing notes.

### Back up before installing or updating

> **Important:** Your notes live only on your device. Before reinstalling, replacing the extension folder, or updating, create a JSON backup.

1. Open **Settings** in ClipNote.
2. Under **Import / Export**, choose **Export JSON** and store the file safely.
3. After installation, use **Import JSON** to restore it if necessary. JSON imports merge backup data with current data.

### Install

1. Download and extract [`clipnote-v1.3.2.zip`](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip) from the **release page**.
2. Open `chrome://extensions/`, enable **Developer mode**, and select **Load unpacked**.
3. Select the extracted `clipnote` folder—the `manifest.json` file must be directly inside it.
4. When updating, back up first, replace the folder, then press **Reload** for the extension.

The ZIP is intentionally not stored on the `main` branch; installable packages are published only as [GitHub Release assets](https://github.com/Kourosh242/clipnote/releases).

### Documentation

- [Official online wiki](https://kourosh242.github.io/clipnote/)
- [All releases](https://github.com/Kourosh242/clipnote/releases)
- [Repository wiki reference](WIKI.md)
- [Changelog](CHANGELOG.md)

Made with ❤️ by [Kourosh](https://github.com/Kourosh242) and [Mehdi](https://github.com/MR-SHARIFI-Dev).
