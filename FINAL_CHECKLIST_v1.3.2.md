# چک‌لیست نهایی ریلیز v1.3.2 — Final Checklist

> تاریخ: 2026-08-23 | شاخه: arena/01a0302d-clipnote

## ✅ کارهای انجام‌شده

### کد و باگ‌فیکس
- [x] تست‌ها پاس: 4/4 در tests/shared.test.js
- [x] فیکس ترجمه گمشده discardChanges در popup.js (en/fa)
- [x] بررسی هم‌زمانی Web Locks، Markdown امن، migration مقاوم
- [x] اسکریپت بسته‌بندی بهبود یافت: scripts/package-extension.sh حالا checksum و verify structure دارد

### بسته نصب
- [x] ZIP ساخته شد: clipnote-v1.3.2.zip (218-220KB بسته به timestamp)
- [x] ساختار ZIP تایید شد: clipnote/manifest.json وجود دارد
- [x] SHA256 تولید شد: clipnote-v1.3.2.zip.sha256
- [x] ZIP شامل فیکس discardChanges است (grep تایید شد)

### مستندات فارسی
- [x] RELEASE_NOTES_v1.3.2_FA.md — یادداشت انتشار فارسی کامل
- [x] RELEASE_NOTES_v1.3.2_EN.md — انگلیسی
- [x] INSTALL_FA.md — راهنمای نصب فارسی 138 خط با عیب‌یابی
- [x] RELEASE.md — متن آماده برای GitHub Releases (دو زبانه)
- [x] WIKI.md — بازنویسی کامل 17KB با TOC، بک‌آپ، نصب، امکانات، قفل، Markdown، حریم خصوصی، FAQ
- [x] SECURITY.md — سیاست امنیتی دو زبانه
- [x] README.md — لینک‌های جدید به INSTALL_FA و RELEASE_NOTES اضافه شد
- [x] CHANGELOG.md — نکته discardChanges اضافه شد
- [x] docs/releases/ — کپی ریلیز نوت‌ها برای GitHub Pages
- [x] docs/index.html — قبلاً v1.3.2 بود، نیاز به تغییر نداشت

### گیت و انتشار
- [x] کامیت اول: feat(release): complete v1.3.2 Persian release...
- [x] پوش به origin/arena/01a0302d-clipnote
- [x] کامیت دوم (در انتظار): بهبود اسکریپت بسته‌بندی و SECURITY.md

## 📋 کارهای باقی‌مانده برای شما (کاربر)

### 1. کامیت نهایی را پوش کنید (ما الان انجام می‌دهیم)
```bash
git add scripts/package-extension.sh RELEASE.md SECURITY.md FINAL_CHECKLIST_v1.3.2.md
git commit -m "chore: improve packaging script, add SECURITY.md and final checklist"
git push origin arena/01a0302d-clipnote
```

### 2. PR بسازید
```bash
gh pr create --base main --head arena/01a0302d-clipnote \
  --title "Release v1.3.2 — Persian complete + fixes" \
  --body-file RELEASE.md
```
یا از رابط GitHub:
- https://github.com/Kourosh242/clipnote/pull/new/arena/01a0302d-clipnote
- Title: Release v1.3.2 — Persian complete + fixes
- Body: محتوای RELEASE.md

### 3. مرج کنید
- بعد از بررسی PR، Merge pull request → Squash or Merge
- تگ بزنید:
```bash
git checkout main
git pull origin main
git tag v1.3.2
git push origin v1.3.2
```

### 4. GitHub Release بسازید
- https://github.com/Kourosh242/clipnote/releases/new
- Tag: v1.3.2
- Title: ClipNote v1.3.2
- Description: محتوای RELEASE.md
- Assets: آپلود clipnote-v1.3.2.zip و clipnote-v1.3.2.zip.sha256
- Publish

### 5. تست نهایی
- ZIP را دانلود، Extract، Load unpacked در chrome://extensions/
- تست: ذخیره سریع، قفل، بک‌آپ/ریستور، Markdown، فارسی

## 📦 فایل‌های قابل ارائه
- clipnote-v1.3.2.zip — فایل نصب
- clipnote-v1.3.2.zip.sha256 — چک‌سام
- RELEASE_NOTES_v1.3.2_FA.md — برای کاربران فارسی
- INSTALL_FA.md — راهنمای نصب

## 🔗 لینک‌های مهم
- Wiki آنلاین: https://kourosh242.github.io/clipnote/
- Releases: https://github.com/Kourosh242/clipnote/releases
- Issues: https://github.com/Kourosh242/clipnote/issues

---
ساخته‌شده با ❤️ — آماده برای PR و Merge
