# ClipNote Wiki / ویکی ClipNote — نسخه 1.3.2

> **راهنمای کامل و دو‌زبانه:** [kourosh242.github.io/clipnote](https://kourosh242.github.io/clipnote/)  
> **دانلود رسمی:** [GitHub Releases](https://github.com/Kourosh242/clipnote/releases) · [فایل نصب v1.3.2](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip)  
> **سازندگان:** [Kourosh](https://github.com/Kourosh242) و [Mehdi](https://github.com/MR-SHARIFI-Dev)

این صفحه، نسخهٔ Markdown راهنمای رسمی است. برای نسخهٔ گرافیکی و واکنش‌گرا، از [ویکی آنلاین](https://kourosh242.github.io/clipnote/) استفاده کنید.

---

## فهرست / Table of Contents

1. [شروع سریع — فارسی](#شروع-سریع)
2. [امکانات کلیدی](#امکانات)
3. [نصب دقیق v1.3.2](#نصب-نسخه-132)
4. [کار با پاپ‌آپ و مدیریت کامل](#کار-با-پاپ‌آپ-و-مدیریت-کامل)
5. [قفل، بازیابی و امنیت](#قفل-بازیابی-و-امنیت)
6. [Markdown و ترفندها](#markdown-و-ترفندها)
7. [حریم خصوصی](#حریم-خصوصی)
8. [عیب‌یابی و FAQ](#عیب‌یابی-و-faq)
9. [تاریخچه نسخه‌ها](#تاریخچه-نسخه‌ها)
10. [English quick reference](#english-quick-reference)

---

## شروع سریع

### ۱. پیش از به‌روزرسانی پشتیبان بگیرید — خیلی مهم!

یادداشت‌ها فقط در `chrome.storage.local` دستگاه شما هستند. قبل از نصب مجدد یا به‌روزرسانی:

1. در افزونه به **Settings / تنظیمات** بروید.
2. از بخش **Import / Export** گزینهٔ **Export JSON** را بزنید.
3. فایل JSON را در جای امن **خارج از پوشه افزونه** نگه دارید (Desktop، Drive و...).
4. پس از نصب در صورت نیاز با **Import JSON** آن را بازگردانید؛ داده‌ها با اطلاعات فعلی **ادغام** می‌شوند، حذف نمی‌شوند.

> از v1.2.6 به بعد، Import به صورت Merge است. از v1.3.2، فایل‌های بزرگ‌تر از ۸MB و نسخه‌های نامعتبر رد می‌شوند و خطای واضح می‌بینید.

### ۲. نصب نسخهٔ 1.3.2

1. [`clipnote-v1.3.2.zip`](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip) را از ریلیز دانلود و استخراج کنید.
2. `chrome://extensions/` را باز و **Developer mode** را فعال کنید.
3. **Load unpacked** را بزنید.
4. پوشهٔ استخراج‌شدهٔ `clipnote` را انتخاب کنید؛ `manifest.json` باید مستقیماً در آن باشد.
5. هنگام به‌روزرسانی، بعد از جایگزینی پوشه روی **Reload** کلیک کنید.

> فایل ZIP فقط در بخش Releases منتشر می‌شود و در شاخهٔ `main` قرار ندارد. این تصمیم عمدی است تا همیشه از Asset رسمی استفاده کنید.

---

## امکانات

### ذخیره سریع
- انتخاب متن در هر صفحه وب → راست‌کلیک → **Save to ClipNote**
- عنوان صفحه، URL و زمان ذخیره به صورت خودکار ثبت می‌شود
- بنر Quick Save در پاپ‌آپ تا ۱۵ دقیقه نمایش داده می‌شود

### سازماندهی
- **فضاهای کاری (Workspaces):** پروژه، شخصی، ایده‌ها را جدا نگه دارید
- **دسته‌بندی‌ها (Categories):** Work, Personal, Programming و دسته‌های دلخواه
- **برچسب‌ها (Tags):** برچسب سفارشی، برچسب‌های سریع (پراستفاده‌ترین‌ها)، و پیشنهاد هوشمند بر اساس محتوا
- **پین و علاقه‌مندی:** یادداشت‌های مهم را همیشه بالا نگه دارید

### جستجو و مرور
- جستجو در عنوان، محتوا، برچسب و دسته‌بندی
- فیلتر بر اساس فضا، پین، علاقه‌مندی
- **نمای کلی (Overview):** گروه‌بندی زمانی هوشمند — امروز، دیروز، این هفته، این ماه، قدیمی‌تر
- **Timeline:** همان گروه‌بندی با تمرکز بر زمان

### ویرایشگر حرفه‌ای
- Markdown کامل با پیش‌نمایش زنده
- Split View (ویرایشگر + پیش‌نمایش هم‌زمان)
- رنگ‌بندی یادداشت‌ها (قرمز، آبی، سبز، نارنجی، بنفش، خاکستری)
- ذخیره خودکار (قابل تنظیم)، بازگشت (Undo) با تاریخچه ۶۰ مرحله‌ای در پاپ‌آپ و ۱۰۰ مرحله‌ای در مدیریت
- کپی کد با یک کلیک

### فارسی و ظاهر
- رابط کاملاً دو زبانه فارسی/انگلیسی
- RTL واقعی با فونت **Vazirmatn** آفلاین (بدون نیاز به اینترنت)
- تم‌ها: آبی، سبز، بنفش، نارنجی، دارک پرو
- حالت تیره، اندازه فونت، انیمیشن‌ها

### ورود و خروج
- **Export JSON:** کامل — یادداشت‌ها، تنظیمات، دسته‌ها، فضاها، برچسب‌های سفارشی، آخرین Quick Save
- **Export TXT:** خوانا برای اشتراک‌گذاری
- **Import JSON:** ادغام هوشمند — یادداشت‌های جدید اضافه، قدیمی‌ها با آخرین ویرایش نگه داشته می‌شوند

### به‌روزرسانی خودکار
- بررسی هر ۶ ساعت در پس‌زمینه با `chrome.alarms`
- فقط تگ‌های SemVer معتبر `vX.Y.Z` قبول می‌شوند (مثل `v1.3.2`)، تگ‌های نامعتبر مثل `new_ver1` نادیده گرفته می‌شوند
- اعلان Chrome یک‌بار برای هر نسخه جدید، با کلیک به صفحه ریلیز

---

## نصب نسخه 1.3.2 — دقیق

### پیش‌نیاز
- Chrome 111 یا بالاتر (Manifest V3)
- حالت Developer Mode

### مراحل تصویری (متنی)

```
1. دانلود: کلیک روی https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip
2. استخراج: راست‌کلیک → Extract Here → پوشه clipnote
3. chrome://extensions/ → Developer mode ON
4. Load unpacked → انتخاب پوشه clipnote
5. تست: Ctrl+Shift+N → پاپ‌آپ ClipNote باز شود
```

### ساختار پوشه صحیح

```
clipnote/
├── manifest.json
├── background.js
├── shared.js
├── popup.html / popup.js / popup.css
├── options.html / options.js / options.css
├── shared.css
├── icons/
│   ├── icon16.png, icon32.png, icon48.png, icon128.png
└── assets/
    ├── Vazirmatn-Regular.woff2
    ├── Vazirmatn-Medium.woff2
    └── Vazirmatn-Bold.woff2
```

اگر `manifest.json` داخل یک زیرپوشه دیگر بود، پوشه اشتباه را انتخاب کرده‌اید.

---

## کار با پاپ‌آپ و مدیریت کامل

### پاپ‌آپ (390x600)

- **میانبر:** Ctrl+Shift+N (قابل تغییر در chrome://extensions/shortcuts)
- **جستجو:** Ctrl+F
- **یادداشت جدید:** Ctrl+N یا دکمه ＋
- **ذخیره:** Ctrl+S

### مدیریت کامل (Options)

- از پاپ‌آپ → **Open Manager** یا آدرس `chrome-extension://<id>/options.html`
- سایدبار قابل جمع‌شدن، جستجوی سراسری
- مرتب‌سازی: آخرین ویرایش، تاریخ ایجاد، عنوان الف-ی
- فیلتر فضا در تولبار لیست

---

## قفل، بازیابی و امنیت

### قفل کردن یادداشت

1. یادداشت را باز کنید → بخش **محافظت**
2. **قفل → نوع: رمز یا پین ۴ رقمی → وارد کردن → ذخیره**
3. یادداشت قفل می‌شود و پیش‌نمایش آن مخفی می‌ماند

### سوال بازیابی — پیشنهاد می‌شود!

1. در همان بخش → **تنظیم سوال بازیابی**
2. سوال: مثلاً "نام غذای مورد علاقه؟" و جواب: "همبرگر"
3. ذخیره

اگر رمز را فراموش کردید:

- در پاپ‌آپ یا مدیریت، روی یادداشت قفل کلیک کنید → **بازیابی رمز**
- جواب سوال را وارد کنید → یادداشت باز می‌شود

### محدودیت مهم قفل

> **Password/PIN فقط دسترسی در رابط ClipNote را محدود می‌کند و رمزنگاری محتوای ذخیره‌شده نیست.** خروجی JSON/TXT ممکن است متن یادداشت قفل‌شده را شامل شود؛ Backup را محرمانه نگه دارید.

رمزها با **Web Crypto و PBKDF2 با ۱۵۰٬۰۰۰ تکرار** به صورت محلی هش می‌شوند. Salt تصادفی ۱۶ بایتی برای هر یادداشت.

---

## Markdown و ترفندها

### سینتکس پشتیبانی‌شده

- `# تا ######` عنوان
- `**bold**`, `*italic*`, `~~strike~~`
- `` `inline code` `` و ```` ```lang\ncode\n``` ````
- `[متن](https://example.com)` — فقط https و mailto مجاز، `javascript:` مسدود
- `![alt](https://...)` تصویر
- `> نقل قول`
- `---` خط جداکننده
- لیست نامرتب: `-` یا `*` با تورفتگی ۲ فاصله برای تو در تو
- لیست مرتب: `1.`
- جدول:

```markdown
| ستون ۱ | ستون ۲ |
|--------|--------|
| مقدار | مقدار |
```

### ترفندها

- برای کپی کد، روی دکمه **Copy** در هدر code block کلیک کنید
- لینک‌ها با `target="_blank"` باز می‌شوند
- URLهای دارای پرانتز مثل `https://example.com/path_(test)` درست کار می‌کنند (از v1.3.2)

---

## حریم خصوصی

- یادداشت‌ها، تنظیمات، دسته‌ها و فضاها فقط با `chrome.storage.local` نگهداری می‌شوند
- محتوای یادداشت‌ها به سرور ClipNote یا سرویس تحلیل‌گر ارسال نمی‌شود
- تنها ارتباط شبکه‌ای برای اطلاع از ریلیز عمومی، به `https://api.github.com/repos/Kourosh242/clipnote/releases/latest` و `https://api.github.com/repos/Kourosh242/clipnote/tags?per_page=10` است
- فونت Vazirmatn آفلاین و داخل افزونه بسته‌بندی شده

---

## عیب‌یابی و FAQ

### FAQ فارسی

**آیا یادداشت‌ها روی سرور ذخیره می‌شوند؟**  
خیر. ۱۰۰٪ محلی است. فقط متادیتای عمومی ریلیز GitHub خوانده می‌شود.

**بعد از دانلود ZIP چه‌کار کنم؟**  
اول Export JSON بگیرید، سپس ZIP را استخراج کنید، Developer mode را در `chrome://extensions/` فعال کنید و Load unpacked را بزنید.

**آیا فارسی و فونت وزیرمتن آفلاین هستند؟**  
بله. فونت داخل افزونه و همین ویکی بسته‌بندی شده.

**قفل یادداشت امن است؟**  
برای جلوگیری از دسترسی اتفاقی در رابط مناسب است، اما رمزنگاری دیسک نیست. اگر دستگاه شما در اختیار دیگران است، روی امنیت سیستم‌عامل حساب کنید و بک‌آپ را رمزگذاری کنید.

**چرا بعد از به‌روزرسانی یادداشت‌ها نیست؟**  
احتمالاً پوشه اشتباه Load شده یا Chrome پروفایل را عوض کرده. Import JSON را بزنید.

### عیب‌یابی سریع

| مشکل | راه‌حل |
|------|--------|
| پاپ‌آپ خالی | فیلتر فضا را روی "همه" بگذارید، جستجو را پاک کنید |
| پیشنهاد برچسب نمی‌آید | متن یادداشت را بیشتر کنید؛ پیشنهاد بر اساس regex هوشمند است |
| ذخیره سریع کار نمی‌کند | بررسی کنید متن انتخاب شده خالی نباشد؛ اعلان Chrome را چک کنید |
| اعلان به‌روزرسانی نمی‌آید | اینترنت و دسترسی به api.github.com را چک کنید؛ از v1.3.0 به بعد هر ۶ ساعت چک می‌شود |

---

## تاریخچه نسخه‌ها

### 1.3.2 — 2026-08-23 — نسخه پایدارسازی

**فارسی:**
- مقاوم‌سازی ذخیره‌سازی هم‌زمان با Web Locks و merge آخرین داده‌ها
- مدیریت صریح خطاهای Storage، Import و FileReader
- اعتبارسنجی نسخه و اندازه فایل پشتیبان و پاک‌سازی داده‌های خراب در مهاجرت
- اصلاح Markdown شامل code block، لینک‌های امن، URLهای دارای پرانتز، فهرست‌های تو‌در‌تو و کپی کد
- اصلاح از دست رفتن state در Popup، پیشنهادهای نادیده‌گرفته‌شده، دسته‌بندی Quick Capture
- اصلاح بررسی نسخه، SemVer، cache زمانی و اعلان‌های ناموفق
- بازگردانی وضعیت Sidebar و پاک‌سازی کامل در Clear All Data
- کاهش permissionها و حداقل Chrome 111
- ترجمه `discardChanges`

**English:** See [CHANGELOG.md](CHANGELOG.md) for full English changelog.

### نسخه‌های قبلی

- 1.3.1 — کارت وضعیت نسخه، ویکی آنلاین، لینک سازندگان، فایل ZIP رسمی
- 1.3.0 — به‌روزرسانی خودکار پس‌زمینه هر ۶ ساعت
- 1.2.9 — بهبود فارسی‌سازی، Timeline محلی‌شده
- ... — تاریخچه کامل در [CHANGELOG.md](CHANGELOG.md)

---

## پیوندهای مرتبط

- [README](README.md) — معرفی و دستورالعمل کوتاه
- [CHANGELOG](CHANGELOG.md) — تاریخچهٔ نسخه‌ها
- [INSTALL_FA.md](INSTALL_FA.md) — راهنمای نصب فارسی کامل
- [RELEASE_NOTES_v1.3.2_FA.md](RELEASE_NOTES_v1.3.2_FA.md) — یادداشت انتشار فارسی
- [RELEASE_NOTES_v1.3.2_EN.md](RELEASE_NOTES_v1.3.2_EN.md) — Release notes English
- [Online Wiki](https://kourosh242.github.io/clipnote/) — راهنمای کامل آنلاین
- [Releases](https://github.com/Kourosh242/clipnote/releases) — فایل‌های نصب
- [Issues](https://github.com/Kourosh242/clipnote/issues) — گزارش مشکل

---

## English quick reference

**Full bilingual guide:** [kourosh242.github.io/clipnote](https://kourosh242.github.io/clipnote/)  
**Official download:** [GitHub Releases](https://github.com/Kourosh242/clipnote/releases) · [v1.3.2 installer](https://github.com/Kourosh242/clipnote/releases/download/v1.3.2/clipnote-v1.3.2.zip)

### Back up first

Notes are stored in `chrome.storage.local` on your device. Before reinstalling or updating, open **Settings → Import / Export**, choose **Export JSON**, and keep the backup somewhere safe. Restore it later with **Import JSON** if necessary; imports merge with existing data. Since v1.3.2, backups larger than 8MB or with unsupported version are rejected with a clear error.

### Install

Download and extract the release ZIP, open `chrome://extensions/`, enable **Developer mode**, choose **Load unpacked**, and select the extracted `clipnote` folder containing `manifest.json`. When updating, back up first and click **Reload** after replacing the folder.

The ZIP is available only as a GitHub Release asset, not on the `main` branch.

### Features (v1.3.2)

- Save selected text via right-click → Save to ClipNote, with source URL/title
- Workspaces, categories, tags, smart suggestions (regex-based)
- Per-note lock with Password/PIN + recovery question (PBKDF2 150k iterations, local only, not encryption)
- Markdown preview & split view, safe links, nested lists, code copy
- Dark mode, themes, font size, auto-save, Persian RTL with offline Vazirmatn
- JSON/TXT import/export (merge, not replace) and background auto-update every 6h

### Privacy

Notes stay in `chrome.storage.local`. No analytics. Only network request is public GitHub release metadata. See [README.md](README.md), [CHANGELOG.md](CHANGELOG.md), and the [online wiki](https://kourosh242.github.io/clipnote/) for more.
