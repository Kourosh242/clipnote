<div align="center">

# ClipNote — Clipboard Notebook

**نسخه / Version:** `1.3.1` · **Manifest V3** · **دوزبانه: فارسی / English**

### 📖 ویکی و مستندات کامل | Full wiki & documentation

**➜ https://kourosh242.github.io/clipnote/ ◀**


[فارسی](#فارسی) · [English](#english)

</div>

---

# فارسی

## کلیپ‌نوت چیست؟

یک دفترچه یادداشت کلیپ‌بورد، سریع و امن برای گوگل کروم. متن را از هر صفحه‌ای با راست‌کلیک ذخیره کنید، در فضای کاری و دسته‌بندی مرتبش کنید، برچسب هوشمند بزنید و روی یادداشت‌های حساس قفل بگذارید.

همه داده‌ها در `chrome.storage.local` روی همان کامپیوتر می‌مانند. **هیچ سرور، حساب کاربری، همگام‌سازی ابری یا تحلیل آماری در کار نیست.**

## امکانات اصلی

- **ذخیره سریع:** انتخاب متن در هر صفحه + راست‌کلیک + `Save to ClipNote`، همراه با عنوان صفحه، آدرس و زمان ثبت
- **دو سطح کار:** پاپ‌آپ سریع نوار ابزار و مدیر کامل در تب جداگانه، روی یک پایگاه داده مشترک
- **نظم‌دهی:** فضای کاری، دسته‌بندی، برچسب سریع و سفارشی، برچسب پیشنهادی هوشمند، پین، علاقه‌مندی و شش رنگ
- **تایم‌لاین:** گروه‌بندی یادداشت‌ها در امروز، دیروز، این هفته، این ماه و قدیمی‌تر
- **ویرایشگر مارک‌داون:** نمای دو ستونه / فقط ادیتور / فقط پیش‌نمایش، جدول، لیست تودرتو و بلوک کد با دکمه کپی
- **قفل یادداشت:** رمز عبور یا پین ۴ رقمی با `PBKDF2-SHA256` (۱۵۰٬۰۰۰ تکرار) و سوال بازیابی اختیاری
- **بکاپ:** خروجی `JSON` (نسخه ۳) و `TXT`، ورود با ادغام هوشمند، مهاجرت خودکار داده‌ها
- **ظاهر:** تم آبی، سبز، بنفش، نارنجی و Dark Pro، حالت تاریک، اندازه فونت ۱۲ تا ۲۰ و خاموش کردن انیمیشن
- **دوزبانه:** رابط فارسی با فونت وزیرمتن و چیدمان راست‌چین، یا انگلیسی
- **اطلاع از نسخه جدید:** بررسی شماره نسخه هر ۶ ساعت (یادداشت‌ها هرگز ارسال نمی‌شوند)

## نصب

1. فایل `clipnote_1.3.1.zip` را از بخش **Releases** دانلود و در یک پوشه ثابت استخراج کنید
2. در کروم به `chrome://extensions` بروید
3. گزینه **Developer mode** را روشن کنید
4. روی **Load unpacked** کلیک کنید و پوشه‌ای را انتخاب کنید که `manifest.json` داخل آن است
5. آیکون را **Pin** کنید و با `Ctrl` + `Shift` + `N` پاپ‌آپ را باز کنید

> راهنمای کامل، جدول میان‌برها و رفع اشکال در ویکی: **https://kourosh242.github.io/clipnote/**

## میان‌برها

| میان‌بر | کار |
| --- | --- |
| `Ctrl` + `Shift` + `N` | باز کردن پاپ‌آپ (در مک `Command` + `Shift` + `N`) |
| `Ctrl` + `N` | یادداشت جدید |
| `Ctrl` + `S` | ذخیره یادداشت |
| `Ctrl` + `F` | جستجو |
| `Ctrl` + `U` / `Ctrl` + `Alt` + `U` | بازگشت (Undo) در ویرایشگر پاپ‌آپ / مدیر |
| `Esc` | بستن پنجره باز |

## ساختار ریپو

```text
clipnote_v1.3.1/            کد منبع اکستنشن (نسخه 1.3.1)
├── manifest.json           تعریف اکستنشن، دسترسی‌ها و سیاست امنیت محتوا
├── background.js           سرویس‌ورکر: نصب، مهاجرت داده، ذخیره سریع، زمان‌بندی بررسی نسخه
├── shared.js               منطق مشترک: ذخیره‌سازی، برچسب هوشمند، مارک‌داون، قفل، بکاپ
├── popup.html/.js/.css     پاپ‌آپ نوار ابزار
├── options.html/.js/.css   مدیر کامل و تنظیمات
├── shared.css              تم‌ها، متغیرها و اجزای مشترک
├── assets/                 فونت‌های محلی وزیرمتن
└── icons/                  آیکون‌های 16، 32، 48 و 128

docs/                       همین ویکی (با GitHub Pages منتشر می‌شود)
├── index.html              خانه
├── guide.html              راهنمای نصب و شروع سریع
├── features.html           امکانات
├── security.html           امنیت و حریم خصوصی
├── data.html               داده، بکاپ و جابه‌جایی
├── faq.html                سوالات متداول
└── assets/                 استایل، اسکریپت و فونت‌های سایت ویکی
```

## امنیت، کوتاه

- داده‌ها فقط محلی ذخیره می‌شوند و هرگز آپلود نمی‌شوند
- رمز یا پین هرگز ذخیره نمی‌شود؛ فقط هش `PBKDF2-SHA256` با سالت تصادفی ۱۶ بایتی
- متن یادداشت پیش از نمایش پاک‌سازی می‌شود و اسکریپت خارجی بارگذاری نمی‌شود
- **توجه:** قفل یادداشت، محتوا را رمزنگاری نمی‌کند و فقط نمایش آن را در رابط می‌بندد. توضیح کامل در صفحه امنیت ویکی آمده است

## صفحات ویکی

| صفحه | موضوع |
| --- | --- |
| [خانه](https://kourosh242.github.io/clipnote/) | معرفی و نمای کلی |
| [راهنمای نصب](https://kourosh242.github.io/clipnote/guide.html) | نصب مرحله‌به‌مرحله و میان‌برها |
| [امکانات](https://kourosh242.github.io/clipnote/features.html) | همه قابلیت‌های نسخه ۱.۳.۱ |
| [امنیت](https://kourosh242.github.io/clipnote/security.html) | قفل، دسترسی‌ها و حریم خصوصی |
| [داده و بکاپ](https://kourosh242.github.io/clipnote/data.html) | خروجی، ورود، ادغام و مهاجرت |
| [سوالات متداول](https://kourosh242.github.io/clipnote/faq.html) | پاسخ پرسش‌های رایج و رفع اشکال |

سازندگان: **کوروش و مهدی**

---

# English

## What is ClipNote?

A fast and secure clipboard notebook for Google Chrome. Save selected text from any page with a right click, organise it into workspaces and categories, tag it automatically and lock the notes that matter.

Everything stays in `chrome.storage.local` on the same computer. **No server, no account, no cloud sync and no analytics.**

## Main features

- **Quick Save:** select text on any page + right click + `Save to ClipNote`, capturing page title, URL and time
- **Two surfaces:** the fast toolbar popup and the full manager in its own tab, sharing one database
- **Organisation:** workspaces, categories, quick and custom tags, smart tag suggestions, pin, favourite and six colours
- **Timeline:** notes grouped into Today, Yesterday, This Week, This Month and Older
- **Markdown editor:** split view / editor only / preview only, tables, nested lists and code blocks with a copy button
- **Note lock:** password or 4-digit PIN with `PBKDF2-SHA256` (150,000 iterations) plus an optional recovery question
- **Backup:** `JSON` (version 3) and `TXT` export, import with smart merging, automatic data migration
- **Appearance:** Blue, Green, Purple, Orange and Dark Pro themes, dark mode, 12–20px font size, animations toggle
- **Bilingual:** Persian interface with Vazirmatn and RTL layout, or English
- **Update awareness:** the version number is checked every 6 hours (notes are never sent anywhere)

## Install

1. Download `clipnote_1.3.1.zip` from the **Releases** section and extract it into a stable folder
2. Open `chrome://extensions` in Chrome
3. Turn on **Developer mode**
4. Click **Load unpacked** and select the folder that contains `manifest.json`
5. **Pin** the icon and open the popup with `Ctrl` + `Shift` + `N`

> Full guide, shortcut table and troubleshooting in the wiki: **https://kourosh242.github.io/clipnote/**

## Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl` + `Shift` + `N` | Open the popup (`Command` + `Shift` + `N` on macOS) |
| `Ctrl` + `N` | New note |
| `Ctrl` + `S` | Save note |
| `Ctrl` + `F` | Search |
| `Ctrl` + `U` / `Ctrl` + `Alt` + `U` | Undo in the popup editor / manager editor |
| `Esc` | Close the open dialog |

## Repository layout

```text
clipnote_v1.3.1/            Extension source (version 1.3.1)
├── manifest.json           Extension definition, permissions and content security policy
├── background.js           Service worker: install, data migration, quick save, update scheduling
├── shared.js               Shared logic: storage, smart tags, Markdown, lock, backup
├── popup.html/.js/.css     Toolbar popup
├── options.html/.js/.css   Full manager and settings
├── shared.css              Themes, tokens and shared components
├── assets/                 Bundled Vazirmatn fonts
└── icons/                  16, 32, 48 and 128 px icons

docs/                       This wiki (published with GitHub Pages)
├── index.html              Home
├── guide.html              Install and quick start
├── features.html           Features
├── security.html           Security and privacy
├── data.html               Data, backup and moving
├── faq.html                FAQ
└── assets/                 Wiki site styles, script and fonts
```

## Security in short

- Data is stored locally only and is never uploaded
- The password or PIN is never stored; only a `PBKDF2-SHA256` hash with a random 16-byte salt
- Note text is escaped before rendering and no external script is loaded
- **Note:** the note lock does not encrypt content, it only hides it in the UI. The full explanation is on the security page of the wiki

## Wiki pages

| Page | Topic |
| --- | --- |
| [Home](https://kourosh242.github.io/clipnote/) | Introduction and overview |
| [Install guide](https://kourosh242.github.io/clipnote/guide.html) | Step-by-step install and shortcuts |
| [Features](https://kourosh242.github.io/clipnote/features.html) | Everything in 1.3.1 |
| [Security](https://kourosh242.github.io/clipnote/security.html) | Lock, permissions and privacy |
| [Data & backup](https://kourosh242.github.io/clipnote/data.html) | Export, import, merging and migration |
| [FAQ](https://kourosh242.github.io/clipnote/faq.html) | Common questions and troubleshooting |

Created by **Kourosh & Mehdi**
