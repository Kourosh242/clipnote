# ClipNote 1.3.2

> **ویکی فارسی و راهنمای کامل:** [kourosh242.github.io/clipnote](https://kourosh242.github.io/clipnote/)
>
> **English documentation:** [Open the documentation](https://kourosh242.github.io/clipnote/#en)

## فارسی

ClipNote یک افزونهٔ مرورگر سریع، آفلاین و حریم‌خصوصی‌محور برای تبدیل کلیپ‌بورد و متن‌های انتخاب‌شده به یک دفترچهٔ یادداشت قابل جست‌وجو است. نسخهٔ حاضر **1.3.2** است و از Manifest V3 استفاده می‌کند.

### قابلیت‌ها

- ثبت سریع متن از Popup، کلیپ‌بورد و منوی راست‌کلیک مرورگر
- جست‌وجو در عنوان، متن، برچسب و دسته‌بندی؛ مرتب‌سازی و نمای زمانی
- Workspace، دسته‌بندی، برچسب‌های هوشمند، رنگ، سنجاق و علاقه‌مندی
- ویرایش Markdown با پیش‌نمایش و بلوک کد قابل کپی
- قفل‌کردن یادداشت با Password/PIN و پرسش بازیابی
- خروجی/ورودی JSON و خروجی متنی برای پشتیبان‌گیری
- تم روشن/تیره، تم‌های رنگی و رابط فارسی (RTL)؛ فارسی همیشه زبان اول مستندات است
- بررسی نسخه‌های جدید GitHub و اعلان انتشار
- ذخیره‌سازی محلی؛ بدون سرور و بدون ارسال محتوای یادداشت‌ها

### نصب از سورس

1. این مخزن را دریافت کنید یا فایل [ClipNote-v1.3.2.zip](https://github.com/Kourosh242/clipnote/releases/tag/1.3.2) را دانلود کنید.
2. در Chrome/Edge به `chrome://extensions` بروید و **Developer mode** را روشن کنید.
3. روی **Load unpacked** بزنید و پوشهٔ `clipnote-v1.3.2` را انتخاب کنید.
4. برای کار با نسخهٔ منتشرشده، از صفحهٔ Release فایل ZIP را نصب کنید.

### حریم خصوصی و پشتیبان‌گیری

داده‌ها در `chrome.storage.local` می‌مانند. قبل از حذف افزونه یا جابه‌جایی مرورگر از **Export JSON** خروجی بگیرید و با **Import JSON** برگردانید. محتوای قفل‌شده نیز بخشی از دادهٔ خروجی است؛ فایل پشتیبان را امن نگه دارید.

### توسعه و گزارش مشکل

افزونه بدون build step اجرا می‌شود. تغییرات را در `clipnote-v1.3.2/` انجام دهید و آن پوشه را به‌صورت unpacked بارگذاری کنید. لطفاً برای گزارش باگ، نسخهٔ مرورگر، مراحل بازتولید و لاگ کنسول را در [Issues](https://github.com/Kourosh242/clipnote/issues) بنویسید.

[تغییرات نسخهٔ 1.3.2](https://github.com/Kourosh242/clipnote/releases/tag/1.3.2) · [راهنمای کامل](https://kourosh242.github.io/clipnote/)

---

## English

ClipNote is a fast, offline-first, privacy-focused browser extension that turns clipboard content and selected text into a searchable notebook. This release is **1.3.2** and uses Manifest V3.

### Highlights

- Quick capture from the popup, clipboard, and the browser context menu
- Search title, content, tags, and categories with sorting and timeline views
- Workspaces, categories, smart tags, colors, pinning, and favorites
- Markdown editing with preview and copyable code blocks
- Per-note password/PIN protection with recovery questions
- JSON backup/restore and plain-text export
- Light/dark and color themes, with a complete Persian RTL interface
- GitHub release update checks and notifications
- Local storage only: note content is never sent to a server

### Install from source

Download [ClipNote-v1.3.2.zip](https://github.com/Kourosh242/clipnote/releases/tag/1.3.2), or clone this repository. Open `chrome://extensions` (or `edge://extensions`), enable **Developer mode**, choose **Load unpacked**, and select `clipnote-v1.3.2`.

See the [full documentation site](https://kourosh242.github.io/clipnote/) for permissions, backup, troubleshooting, and contributor guidance.

### License

See the repository for the project license and release history. Contributions and bug reports are welcome via [GitHub Issues](https://github.com/Kourosh242/clipnote/issues).
