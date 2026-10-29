# FastFast landing

Trang giới thiệu tĩnh (HTML/CSS/JS thuần, không build) cho app FastFast.

- `index.html` – trang chủ (hero, tính năng, mục tiêu, ảnh chụp, Pro, liên hệ)
- `privacy.html` – chính sách quyền riêng tư (URL dùng cho Google Play Console)
- `i18n.js` – bản dịch; tiếng Anh nằm sẵn trong HTML, tiếng Việt trong `STRINGS.vi`. Ép ngôn ngữ bằng `?lang=vi`
- `styles.css` – màu theo theme Sky/Christmas của app, tự đổi sáng/tối theo hệ thống

## Chạy local

```bash
python -m http.server 8080
```

Mở http://localhost:8080

## Việc cần làm khi app lên Play

1. Thay `href="#"` của nút Google Play (`data-play-link` trong `index.html`) bằng
   `https://play.google.com/store/apps/details?id=com.kalect.fastfast`, bỏ dòng "Coming soon" (`hero.soon`).
2. Thả ảnh chụp thật vào `assets/screens/` và thêm `<img class="shot" src="assets/screens/....png" alt="">` vào từng `.screen` trong mục `#screens`.

## Deploy (GitHub Pages)

Repo public, Settings → Pages → Source: *Deploy from a branch*, branch `main`, thư mục `/ (root)`.
Mỗi lần push lên `main` trang tự cập nhật sau ~1 phút.

## Kiến thức (guide)

Bài viết nằm ở `content/guide/<en|vi>/<slug>.md` (frontmatter: title, description, category, order, icon, updated).
Nhóm: `basics`, `science`, `safety`, `lifestyle`, `app`. Mỗi bài phải có đủ bản en và vi (cùng tên file).
Phần `## Sources` / `## Nguồn tham khảo` ở cuối được tách ra hiển thị riêng.

Sau khi sửa bài, sinh lại trang rồi commit cả thư mục `guide/` và `sitemap.xml`:

```bash
node scripts/build-guide.mjs
```
