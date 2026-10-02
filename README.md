# F1 Hub

> Website thử nghiệm tổng hợp Formula 1, với giao diện tiếng Việt, khu trưng bày xe 3D, dữ liệu mùa giải và thư viện hình ảnh.

## Tính năng hiện có

- Trang chủ với sân khấu xe 3D, lịch chặng và thông tin BXH.
- Trang mùa giải với lịch, bảng xếp hạng và kết quả.
- Đường dẫn trực tiếp cho mùa giải (`/season/2026`), kết quả từng chặng (`/season/2026/race/1`), gallery theo đội (`/gallery/ferrari`) và trang About.
- Thư viện xe và hình ảnh theo đội, tay đua, xe và chặng đua.
- Hồ sơ đội (`/teams/ferrari`) và tay đua (`/drivers/leclerc`), liên kết từ bảng xếp hạng và gallery.
- Hồ sơ xe (`/cars/sf24`) với thông số và ghi chú kỹ thuật theo dữ liệu mẫu.
- Danh bạ đội (`/teams`) và tay đua (`/drivers`) có tìm kiếm, lọc theo mùa giải hoặc đội.
- Giao diện tiếng Việt và tiếng Anh.
- Mùa giải 2026 tự kiểm tra kết quả qua Jolpica mỗi 15 phút khi website đang mở; có thể bấm **Cập nhật ngay** để làm mới tức thì. Dữ liệu mới lưu trong `localStorage` của trình duyệt hiện tại, chưa đồng bộ giữa các thiết bị.

Đây là prototype frontend: chưa có backend, tài khoản người dùng hay dữ liệu cộng đồng dùng chung. Tốc độ cập nhật phụ thuộc thời điểm Jolpica công bố phân loại sau chặng; đồng bộ tự động chỉ chạy khi website đang mở. Upload cộng đồng mặc định tắt; đừng bật `VITE_ENABLE_COMMUNITY` trước khi có xác thực và phân quyền phía server.

## Yêu cầu

- Node.js 22 trở lên
- npm

## Chạy local

```bash
npm ci
npm run dev
```

Vite mở trang tại `http://localhost:3000`. Tạo file `.env` từ `.env.example` nếu cần cấu hình biến môi trường.

## Lệnh dự án

```bash
npm run dev          # máy chủ phát triển
npm run lint         # kiểm tra ESLint
npm run format       # định dạng mã bằng Prettier
npm run format:check # kiểm tra định dạng
npm run build        # TypeScript và bản build production
npm run preview      # xem bản build production
```

Repo chưa có bộ test tự động. CI chạy lint, kiểm tra format và build trên pull request.

## Cấu trúc chính

```text
src/
  components/       giao diện home, championship, collection và layout
  data/             dữ liệu mùa giải, đội, xe và thư viện
  services/         tải/đồng bộ dữ liệu F1
  store/            trạng thái ngôn ngữ, mùa giải và collection
  types/            kiểu TypeScript dùng chung
  i18n/             chuỗi tiếng Việt và tiếng Anh
public/
  assets/           ảnh thư viện
  models/           mô hình 3D
scripts/            script đồng bộ dữ liệu thử nghiệm
```

## Đóng góp

Đọc [CONTRIBUTING.md](CONTRIBUTING.md) trước khi mở pull request. Nhánh `develop` là nhánh tích hợp; tạo nhánh `feature/*`, `fix/*` hoặc `chore/*` từ đó. Pull request cần qua `npm run lint` và `npm run build`.

## Công nghệ

React 18, TypeScript, Vite 6, Tailwind CSS, Zustand, Three.js, React Three Fiber và Drei.
