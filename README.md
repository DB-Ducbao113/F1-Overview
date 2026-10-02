# Ground Effect Hub

> Không gian trải nghiệm 3D tương tác và trung tâm lưu trữ dữ liệu chuyên sâu cho kỷ nguyên xe đua hiệu ứng mặt đất Formula 1 (2022–2026). Tác giả: BaoBungBu. Dự án phi thương mại.

## Tính năng hiện có

- Trang chủ với canvas lát cắt xe tương tác (Multi-slice poster canvas) siêu nhẹ, lịch chặng và tiêu điểm BXH.
- Showroom 3D độc lập (`/showroom`) với mô hình hình học thống nhất (Ground Effect chassis C42), giải phẫu xe (Anatomy Hotspots), tạo màu sơn động (procedural livery) và âm thanh động cơ.
- Trang mùa giải (`/season/2026`) với lịch thi đấu, bảng xếp hạng tay đua / đội đua và kết quả chi tiết từng chặng (`/season/2026/race/1`).
- Hồ sơ đội (`/teams/ferrari`) và tay đua (`/drivers/leclerc`), liên kết trực tiếp từ bảng xếp hạng.
- Hồ sơ xe (`/cars/sf24`) với thông số quy chuẩn FIA và phân tích khí động học.
- Danh bạ đội (`/teams`) và tay đua (`/drivers`) có tìm kiếm, lọc theo mùa giải.
- Trang giới thiệu dự án, kiến trúc kỹ thuật & tuyên bố pháp lý (`/about`).
- Giao diện song ngữ hoàn chỉnh: Tiếng Việt và Tiếng Anh.
- Mùa giải 2026 tự đồng bộ kết quả qua Jolpica API; dữ liệu tĩnh baseline được cập nhật tự động qua GitHub Actions CI/CD.

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
