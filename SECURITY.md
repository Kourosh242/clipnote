# Security Policy / سیاست امنیتی — ClipNote v1.3.2

## فارسی

### محدودیت قفل محلی — مهم
- قفل Password/PIN در ClipNote **رمزنگاری دیسک نیست**. فقط دسترسی در رابط کاربری را محدود می‌کند.
- یادداشت‌ها در `chrome.storage.local` به صورت متن ساده (اما در Storage ایزوله Chrome) نگهداری می‌شوند.
- خروجی JSON/TXT می‌تواند محتوای یادداشت‌های قفل‌شده را شامل شود. فایل پشتیبان را مانند داده حساس نگهداری کنید، رمزگذاری کنید یا در جای امن نگه دارید.

### چه چیزی امن است؟
- ۱۰۰٪ محلی، بدون ارسال به سرور
- هش رمزها با Web Crypto API و PBKDF2 با ۱۵۰٬۰۰۰ تکرار و Salt تصادفی ۱۶ بایتی
- لینک‌های Markdown ناامن (`javascript:`) مسدود می‌شوند
- فقط درخواست شبکه به `api.github.com` برای چک نسخه عمومی (هر ۶ ساعت)

### گزارش آسیب‌پذیری
اگر آسیب‌پذیری امنیتی پیدا کردید:
1. مستقیماً Issue باز نکنید (برای جلوگیری از سوءاستفاده عمومی)
2. به [Kourosh](https://github.com/Kourosh242) پیام دهید یا از طریق [GitHub Security Advisory](https://github.com/Kourosh242/clipnote/security/advisories/new) گزارش کنید
3. ما در اسرع وقت بررسی و وصله می‌دهیم

### به‌روزرسانی
- همیشه از آخرین ریلیز در [Releases](https://github.com/Kourosh242/clipnote/releases) استفاده کنید
- قبل از آپدیت، Export JSON بگیرید

---

## English

### Local Lock Limitation — Important
- Password/PIN lock in ClipNote is **not disk encryption**. It only limits access inside the UI.
- Notes are stored in `chrome.storage.local` as plain text (but isolated Chrome storage).
- JSON/TXT exports may contain locked note content. Treat backups as sensitive.

### What is secure?
- 100% local, no server
- Password hashing with Web Crypto PBKDF2 150k iterations, 16-byte random salt
- Unsafe Markdown links (`javascript:`) are blocked
- Only network request is to `api.github.com` for public release metadata (every 6h)

### Reporting a vulnerability
If you find a security vulnerability:
1. Do not open a public Issue
2. Contact [Kourosh](https://github.com/Kourosh242) or use [GitHub Security Advisory](https://github.com/Kourosh242/clipnote/security/advisories/new)
3. We will investigate and patch ASAP

### Updates
- Always use latest release from [Releases](https://github.com/Kourosh242/clipnote/releases)
- Back up with Export JSON before updating
