# ClipNote v1.3.2 — GitHub Release Description (Copy-Paste Ready)

> این متن آماده برای انتشار در GitHub Releases است — فارسی + English

---

## فارسی — ClipNote v1.3.2

### 📦 دانلود
- **فایل نصب:** [`clipnote-v1.3.2.zip`](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip) — شامل پوشه `clipnote` با `manifest.json`
- **Checksum SHA256:** `c4f2425140b883ee6c967d9e2434bf1af6297121afdf514b5ec3f53735dcef2b` (فایل `clipnote-v1.3.2.zip.sha256` — بعد از بسته‌بندی نهایی تولید می‌شود، مقدار ممکن است با هر build کمی تغییر کند به خاطر timestamp)
- **ویکی آنلاین:** https://kourosh242.github.io/clipnote/

### ⚠️ قبل از نصب: پشتیبان بگیرید
یادداشت‌ها فقط روی دستگاه شما هستند:
1. ClipNote → Settings / تنظیمات → Import / Export → Export JSON
2. فایل را امن نگه دارید
3. بعد از نصب، در صورت نیاز Import JSON بزنید (Merge می‌شود)

### ✨ چه چیزی جدید است؟ (نسبت به 1.3.1)

این نسخه **پایدارسازی** است:

**رفع‌شده:**
- هم‌زمانی: Web Locks + merge آخرین داده‌ها
- خطاهای Storage/Import/FileReader با پیام واضح
- اعتبارسنجی نسخه و حجم بک‌آپ، پاک‌سازی داده‌های خراب/null و ID تکراری
- Markdown: code block بدون double-escape، لینک امن (مسدود کردن javascript:), URL با پرانتز، لیست تو در تو، کپی کد در پاپ‌آپ
- پاپ‌آپ: state، پیشنهاد نادیده‌گرفته‌شده، دسته Quick Capture، یادداشت حذف‌شده در تب دیگر
- به‌روزرسانی: SemVer سخت‌گیرانه فقط vX.Y.Z، فیلتر prerelease، cache زمانی، اعلان ناموفق
- تنظیمات: بازگردانی Sidebar و پاک‌سازی کامل همه کلیدها در Clear All Data
- مجوزها: کاهش مجوز غیرضروری، حداقل Chrome 111
- رابط: دسترسی Responsive به Settings/Category/Tag
- ترجمه: افزودن `discardChanges` فارسی

**تغییرکرده:**
- نسخه به 1.3.2
- مستندات امنیت و محدودیت قفل شفاف‌تر

### 🔒 امنیت
> قفل Password/PIN فقط دسترسی در رابط را محدود می‌کند و رمزنگاری دیسک نیست. JSON/TXT می‌تواند محتوای قفل‌شده را داشته باشد.

- ۱۰۰٪ محلی، `chrome.storage.local`
- بدون آنالیتیکس
- فقط درخواست به `api.github.com` برای چک نسخه هر ۶ ساعت

### 📚 نصب

1. ZIP را دانلود و Extract کنید → پوشه `clipnote`
2. `chrome://extensions/` → Developer mode ON → Load unpacked → انتخاب پوشه `clipnote`
3. برای آپدیت: بک‌آپ → جایگزینی پوشه → Reload

راهنمای کامل فارسی: [INSTALL_FA.md](https://github.com/Kourosh242/clipnote/blob/main/INSTALL_FA.md) و [WIKI.md](https://github.com/Kourosh242/clipnote/blob/main/WIKI.md)

### 👥 سازندگان
[Kourosh](https://github.com/Kourosh242) & [Mehdi](https://github.com/MR-SHARIFI-Dev) — ساخته‌شده با ❤️

---

## English — ClipNote v1.3.2

### 📦 Download
- **Installer:** [`clipnote-v1.3.2.zip`](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip) — contains `clipnote/` with `manifest.json`
- **SHA256:** `c4f2425140b883ee6c967d9e2434bf1af6297121afdf514b5ec3f53735dcef2b` (generated at build time, may vary slightly due to zip timestamps)
- **Wiki:** https://kourosh242.github.io/clipnote/

### ⚠️ Back up first
Notes live only on your device:
1. ClipNote → Settings → Import / Export → Export JSON
2. Keep it safe outside extension folder
3. Restore via Import JSON if needed (merge, not replace)

### ✨ What's new (vs 1.3.1)

Stability release:

**Fixed:**
- Concurrency with Web Locks + latest-state merge
- Explicit Storage/Import/FileReader errors
- Backup version/size validation, null/malformed cleanup, duplicate ID dedup
- Markdown: code blocks, safe links, parenthesized URLs, nested lists, popup copy
- Popup: state loss, ignored suggestions, Quick Capture category, externally deleted notes
- Update checker: strict SemVer vX.Y.Z only, prerelease filter, time-safe cache
- Settings: sidebar state, Clear All Data clears every key
- Permissions reduced, Chrome 111 minimum
- Responsive access to Settings/Category/Tag
- Added missing `discardChanges` translation

**Changed:**
- Bumped to 1.3.2
- Clarified security & lock limitations in docs

### 🔒 Security
> Lock limits UI access only, does not encrypt stored content. Exports may contain locked notes.

- 100% local, `chrome.storage.local`
- No analytics
- Only network: `api.github.com` for release metadata every 6h

### 📚 Install

1. Download & extract ZIP → `clipnote` folder
2. `chrome://extensions/` → Developer mode ON → Load unpacked → select `clipnote`
3. For update: backup → replace folder → Reload

Full guide: [WIKI.md](https://github.com/Kourosh242/clipnote/blob/main/WIKI.md) and [Online Wiki](https://kourosh242.github.io/clipnote/)

### 👥 Authors
[Kourosh](https://github.com/Kourosh242) & [Mehdi](https://github.com/MR-SHARIFI-Dev) — Made with ❤️
