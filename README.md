# NL Trả Góp Công Nghiệp — Ngọc Long Energy

App lập **đề xuất đầu tư điện mặt trời hệ công nghiệp** theo hai hình thức: **trả góp Quỹ Stride** (Gói 5 năm hoặc Gói 7 năm) hoặc **trả thẳng**. Chạy hoàn toàn trên trình duyệt, không có máy chủ.

## Dùng
Mở link GitHub Pages bằng Chrome (Android, máy tính) hoặc Safari (iPhone). Trên điện thoại chọn "Thêm vào màn hình chính".

Mở app vào **Trang chủ**: báo giá trả góp mới, báo giá trả thẳng mới, hồ sơ khách, cài đặt, rồi "Vào form nhập liệu".

## Các file
| File | Vai trò |
|---|---|
| `index.html` | Ứng dụng |
| `sw.js` | Chạy offline, lấy bản mới (cache `nl-congnghiep-v1`) |
| `manifest.webmanifest` | Thông tin cài app |
| `icon-192.png`, `icon-512-any.png`, `icon-512-maskable.png`, `apple-touch-icon.png` | Biểu tượng app |
| `.nojekyll` | Báo GitHub Pages phục vụ file nguyên bản |

## Đưa lên GitHub Pages (lần đầu)
1. Tạo repository mới (ví dụ `nl-tra-gop-cong-nghiep`), chế độ Public.
2. **Add file → Upload files**, kéo thả toàn bộ file trong thư mục này (cả `.nojekyll`), bấm **Commit changes**.
3. **Settings → Pages**: Deploy from a branch, nhánh `main`, thư mục `/ (root)`, **Save**.
4. Sau 1–2 phút, địa chỉ app là `https://<tên-tài-khoản>.github.io/<tên-repository>/`.

## Phát hành bản mới
Thay `index.html` (Add file → Upload files → Commit). Sửa `sw.js` chỉ khi đổi cách lưu offline.

## Chưa có so với bản nhà dân
Kiểm tra cập nhật tự động, Zalo, Lưu Cloud, Hướng dẫn trong app. Dữ liệu nằm trong trình duyệt từng máy, nên nên sao lưu định kỳ.
