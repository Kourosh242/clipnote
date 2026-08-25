# کلیپ‌نوت ۱.۳.۱

**ویکی و مستندات کامل:** https://kourosh242.github.io/clipnote/

کلیپ‌نوت یک دفترچه یادداشت کلیپ‌بورد محلی و امن برای گوگل کروم است. یادداشت‌ها روی دستگاه خودتان می‌مانند و رابط کاربری کاملاً دوزبانه (فارسی و انگلیسی) با فونت وزیرمتن و چیدمان راست‌چین است.

## چه چیزی در این نسخه تغییر کرد

- **حذف کامل رابط دستی بررسی نسخه:** کارت «بررسی بروزرسانی» و دکمه‌اش از تنظیمات، بنر «نسخه جدید» و دکمه Updates از پاپ‌آپ و نشان «جدید» از لوگوی پاپ‌آپ و دکمه تنظیمات برداشته شد
- **کارت «وضعیت نسخه» جای آن آمد:** یک کارت آرام و همیشه‌در‌دسترس بالای صفحه تنظیمات که شماره نسخه نصب‌شده و وضعیت به‌روز بودن را نشان می‌دهد (با `aria-live` برای صفحه‌خوان‌ها)
- **بررسی نسخه کاملاً خودکار شد:** در پس‌زمینه، حدود ۵ دقیقه بعد از نصب یا شروع مرورگر و سپس هر ۶ ساعت؛ نتیجه تا ۶ ساعت کش می‌شود و برای هر نسخه فقط یک اعلان نمایش داده می‌شود
- **بهبود چیدمان راست‌چین:** کارت وضعیت نسخه و چند بخش تنظیمات برای حالت فارسی اصلاح شد
- **بخش «درباره» به‌روز شد:** شماره نسخه ۱.۳.۱ و پیوند پروفایل سازندگان
- **مرتب‌سازی مخزن:** پوشه منبع به `clipnote_v1.3.1` تغییر نام یافت و اسکریپت ساخت آیکون حذف شد
- **مستندات دوزبانه:** ریدمی جدید و ویکی کامل روی GitHub Pages منتشر شد

## امکانات کلی

- **ذخیره سریع:** انتخاب متن در هر صفحه، راست‌کلیک و `Save to ClipNote` همراه با عنوان صفحه، آدرس و زمان ثبت
- **دو سطح کار:** پاپ‌آپ سریع نوار ابزار و مدیر کامل در تب جداگانه، روی یک پایگاه داده محلی مشترک
- **نظم‌دهی:** فضای کاری، دسته‌بندی، برچسب سریع و سفارشی، برچسب پیشنهادی هوشمند، پین، علاقه‌مندی و شش رنگ
- **تایم‌لاین:** گروه‌بندی یادداشت‌ها در امروز، دیروز، این هفته، این ماه و قدیمی‌تر
- **ویرایشگر مارک‌داون:** نمای دو ستونه / فقط ادیتور / فقط پیش‌نمایش، جدول، لیست تودرتو و بلوک کد با دکمه کپی
- **قفل یادداشت:** رمز عبور یا پین ۴ رقمی با `PBKDF2-SHA256` (۱۵۰٬۰۰۰ تکرار) و سوال بازیابی اختیاری
- **بکاپ:** خروجی `JSON` (نسخه ۳) و `TXT`، ورود با ادغام هوشمند و مهاجرت خودکار داده‌ها
- **ظاهر:** تم آبی، سبز، بنفش، نارنجی و Dark Pro، حالت تاریک، اندازه فونت ۱۲ تا ۲۰ و خاموش کردن انیمیشن
- **کلیدهای میان‌بر:** `Ctrl` + `Shift` + `N` برای باز کردن، `Ctrl` + `N` یادداشت جدید، `Ctrl` + `S` ذخیره، `Ctrl` + `F` جستجو

## نصب

1. فایل `clipnote_v1.3.1.zip` را از بخش **Assets** همین ریلیز دانلود و در یک پوشه ثابت استخراج کنید
2. در کروم به `chrome://extensions` بروید و **Developer mode** را روشن کنید
3. روی **Load unpacked** کلیک کنید و پوشه‌ای را انتخاب کنید که `manifest.json` داخل آن است
4. آیکون را **Pin** کنید و با `Ctrl` + `Shift` + `N` پاپ‌آپ را باز کنید

> اگر نسخه قدیمی‌تر دارید، قبل از به‌روزرسانی یک خروجی `JSON` از بخش تنظیمات بگیرید.

## امنیت و حریم خصوصی

- همه داده‌ها در `chrome.storage.local` روی همان دستگاه می‌مانند؛ هیچ سرور، همگام‌سازی ابری یا تحلیل آماری وجود ندارد
- رمز یا پین هرگز ذخیره نمی‌شود؛ فقط هش `PBKDF2-SHA256` با سالت تصادفی ۱۶ بایتی
- تنها درخواست شبکه‌ای، خواندن شماره نسخه منتشرشده است؛ یادداشت‌ها هرگز ارسال نمی‌شوند
- **توجه:** قفل یادداشت محتوا را رمزنگاری نمی‌کند و فقط نمایش آن را در رابط کاربری می‌بندد. توضیح کامل در صفحه امنیت ویکی آمده است

## صفحه‌های ویکی

- خانه: https://kourosh242.github.io/clipnote/
- راهنمای نصب: https://kourosh242.github.io/clipnote/guide.html
- امکانات: https://kourosh242.github.io/clipnote/features.html
- امنیت و حریم خصوصی: https://kourosh242.github.io/clipnote/security.html
- داده و بکاپ: https://kourosh242.github.io/clipnote/data.html
- سوالات متداول: https://kourosh242.github.io/clipnote/faq.html

سازندگان: **کوروش و مهدی**

---

# ClipNote v1.3.1

**Full wiki &amp; documentation:** https://kourosh242.github.io/clipnote/

ClipNote is a local and secure clipboard notebook for Google Chrome. Notes stay on your own device and the interface is fully bilingual (Persian and English) with Vazirmatn and an RTL layout.

## What changed in this release

- **The manual update UI is gone:** the “Check for Updates” card and button in Settings, the “New Version Available” banner and the Updates button in the popup, and the “New” badges on the popup logo and Settings button were all removed
- **A “Version Status” card replaces it:** a calm, always-visible card at the top of Settings showing the installed version and whether you are up to date (with `aria-live` for screen readers)
- **The update check is fully automatic now:** it runs in the background about 5 minutes after install or browser start, then every 6 hours; results are cached for 6 hours and each version triggers only one notification
- **RTL polish:** the version status card and several settings sections were refined for the Persian layout
- **About section updated:** version string 1.3.1 and links to the authors' profiles
- **Repository tidy-up:** the source folder was renamed to `clipnote_v1.3.1` and the icon generation script was removed
- **Bilingual documentation:** a new README and a full wiki were published on GitHub Pages

## Features

- **Quick Save:** select text on any page, right click and choose `Save to ClipNote` with page title, URL and capture time
- **Two surfaces:** the fast toolbar popup and the full manager in its own tab, sharing one local database
- **Organisation:** workspaces, categories, quick and custom tags, smart tag suggestions, pin, favourite and six colours
- **Timeline:** notes grouped into Today, Yesterday, This Week, This Month and Older
- **Markdown editor:** split view / editor only / preview only, tables, nested lists and code blocks with a copy button
- **Note lock:** password or 4-digit PIN with `PBKDF2-SHA256` (150,000 iterations) and an optional recovery question
- **Backup:** `JSON` (version 3) and `TXT` export, import with smart merging, automatic data migration
- **Appearance:** Blue, Green, Purple, Orange and Dark Pro themes, dark mode, 12–20px font size and an animations toggle
- **Shortcuts:** `Ctrl` + `Shift` + `N` to open, `Ctrl` + `N` for a new note, `Ctrl` + `S` to save, `Ctrl` + `F` to search

## Install

1. Download `clipnote_v1.3.1.zip` from the **Assets** section of this release and extract it into a stable folder
2. Open `chrome://extensions` in Chrome and turn on **Developer mode**
3. Click **Load unpacked** and select the folder that contains `manifest.json`
4. **Pin** the icon and open the popup with `Ctrl` + `Shift` + `N`

> If you already have an older version, export a `JSON` backup from Settings before updating.

## Security &amp; privacy

- All data stays in `chrome.storage.local` on your device; no server, no cloud sync, no analytics
- The password or PIN is never stored; only a `PBKDF2-SHA256` hash with a random 16-byte salt
- The only network request reads the published version number; notes are never sent anywhere
- **Note:** the note lock does not encrypt content, it only hides it in the user interface. The full explanation is on the security page of the wiki

## Wiki pages

- Home: https://kourosh242.github.io/clipnote/
- Install guide: https://kourosh242.github.io/clipnote/guide.html
- Features: https://kourosh242.github.io/clipnote/features.html
- Security &amp; privacy: https://kourosh242.github.io/clipnote/security.html
- Data &amp; backup: https://kourosh242.github.io/clipnote/data.html
- FAQ: https://kourosh242.github.io/clipnote/faq.html

Created by **Kourosh &amp; Mehdi**
