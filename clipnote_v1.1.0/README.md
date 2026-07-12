# ClipNote - دفترچه یادداشت کلیپ‌بورد

**نسخهٔ ۱.۱.۰** | ساخته‌شده توسط **Kourosh & Nova**

یک افزونهٔ کامل Google Chrome (Manifest V3) برای ذخیره، سازماندهی، ویرایش، جستجو و کپی سریع یادداشت‌ها، قطعه‌کدها، لینک‌ها و ایده‌ها.

## ویژگی‌ها

- ✅ رابط کاربری مدرن و زیبا با پشتیبانی از Light/Dark Mode
- 🎨 تم‌های متنوع: Blue، Green، Purple، Orange، Dark Pro
- 📝 یادداشت‌ها با عنوان، محتوای بزرگ، ذخیرهٔ خودکار و دستی
- ⭐ علاقه‌مندی‌ها و 📌 پین کردن یادداشت‌ها
- 🏷️ دسته‌بندی‌ها و برچسب‌ها با جستجوی زنده
- 🔗 تشخیص خودکار لینک‌ها
- 💻 قطعه‌کدهای برنامه‌نویسی با فونت monospace و دکمهٔ Copy Code
- 🖊️ پیش‌نمایش Markdown با Split View
- 📥 Import/Export به فرمت JSON و TXT
- ⌨️ میانبرهای صفحه‌کلید: Ctrl+S، Ctrl+F، Ctrl+N
- 🇮🇷 پشتیبانی از زبان فارسی، راست‌چین (RTL) و فونت محلی Vazirmatn
- 🔒 ۱۰۰٪ محلی: بدون سرور، بدون تحلیل، بدون ردیابی

## نصب در Chrome

1. فایل `clipnote.zip` را استخراج کنید.
2. Chrome را باز کنید و به آدرس `chrome://extensions/` بروید.
3. گزینهٔ **Developer mode** را در بالا سمت راست فعال کنید.
4. روی دکمهٔ **Load unpacked** کلیک کنید.
5. پوشهٔ `clipnote` را انتخاب کنید.
6. افزونه آمادهٔ استفاده است!

## ساختار فایل‌ها

```
clipnote/
├── manifest.json
├── background.js
├── shared.js
├── shared.css
├── popup.html
├── popup.css
├── popup.js
├── options.html
├── options.css
├── options.js
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── generate_icons.py
```

## تولید مجدد آیکون‌ها

در صورت نیاز، آیکون‌ها را می‌توانید دوباره بسازید:

```bash
cd clipnote
python3 generate_icons.py
```

## نکات امنیتی

- تمام داده‌ها با استفاده از Chrome Storage API به‌صورت محلی ذخیره می‌شوند.
- هیچ درخواست خارجی ارسال نمی‌شود.
- هیچ ابزار تحلیل یا ردیابی وجود ندارد.

---

Made with ❤️ by Kourosh & Nova.
