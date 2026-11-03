# Podium Effet De Sol (Podium EDS)

> Không gian trải nghiệm 3D tương tác và trung tâm lưu trữ dữ liệu chuyên sâu cho kỷ nguyên xe đua hiệu ứng mặt đất Formula 1 (2022–2026). Tác giả: BaoBungBu. Dự án phi thương mại.

---

## Tính năng hiện có

- **Showroom 3D độc lập (`/showroom`):** Dựng hình thời gian thực mô hình Ground Effect C42/W15 với vật liệu procedural livery, giải phẫu kỹ thuật (Anatomy Hotspots), âm thanh động cơ và hệ thống **Adaptive Graphics Quality** (tự động điều chỉnh 4 mức Auto / High / Average / Performance theo năng lực GPU thiết bị).
- **Trang chủ tương tác (`/`):** Canvas lát cắt xe (Multi-slice poster canvas) siêu nhẹ, lịch chặng thi đấu và tiêu điểm bảng xếp hạng.
- **Trang mùa giải (`/season/2026`):** Lịch thi đấu, bảng xếp hạng tay đua / đội đua và kết quả chi tiết từng chặng (`/season/2026/race/1`).
- **Hồ sơ đội (`/teams/ferrari`) & tay đua (`/drivers/leclerc`):** Liên kết trực tiếp từ bảng xếp hạng, hiển thị thống kê chi tiết sự nghiệp.
- **Hồ sơ xe (`/cars/sf24`):** Thông số quy chuẩn kỹ thuật FIA và phân tích luồng khí động học.
- **Danh bạ đội (`/teams`) & tay đua (`/drivers`):** Tìm kiếm và lọc theo mùa giải.
- **Trang giới thiệu kỹ thuật & pháp lý (`/about`):** Thông tin dự án, công nghệ và tuyên bố bản quyền hình ảnh.
- **Đa ngôn ngữ hoàn chỉnh:** Tiếng Việt và Tiếng Anh.
- **Hệ thống dữ liệu kép:** Tự động đồng bộ kết quả mùa giải qua Jolpica API kết hợp phân loại Sprint tức thời từ OpenF1 API.

---

## Công nghệ sử dụng

- **Frontend Core:** React 18, TypeScript 5.5, Vite 6, React Router 7.
- **3D Graphics & WebGL:** Three.js, React Three Fiber (R3F), React Three Drei.
- **Styling & UI:** Tailwind CSS, Lucide React, clsx, tailwind-merge.
- **State Management:** Zustand (với LocalStorage persistence).
- **Testing & Verification:** Vitest, V8 Coverage, Headless Chrome CDP Benchmark, Playwright.
- **CI/CD & Serverless:** GitHub Actions, Vercel Serverless Functions, Docker.

---

## Kiến trúc mã nguồn hiện tại (Current As-Is Architecture)

Mã nguồn hiện tại của dự án đang được tổ chức theo mô hình **Layer-Based Architecture** (chia theo phân loại kỹ thuật):

```text
src/
  components/       Giao diện React (home, championship, pages, layout) và 3D showroom
  data/             Dữ liệu mùa giải, thông số đội, xe và cầu nối Sprint OpenF1
  services/         API adapters, dịch vụ đồng bộ F1 và tính toán BXH
  store/            State management với Zustand (championship, navigation)
  types/            Kiểu TypeScript dùng chung
  utils/            Tiện ích phụ trợ (màu sắc, tên đội, ngày tháng, âm thanh)
  i18n/             Từ điển tiếng Việt và tiếng Anh
public/
  assets/           Hình ảnh tĩnh
  models/           Mô hình 3D (.glb)
scripts/            Script benchmark CDP, đồng bộ dữ liệu và kiểm tra bundle
api/                Vercel Serverless Functions kết nối Jolpica & OpenF1
```

> [!NOTE]
> Hệ thống đang trong lộ trình chuyển đổi an toàn sang mô hình **Modular Monolith + Feature-Based Architecture + Pragmatic Clean Architecture** (hiện đã phê duyệt Hợp đồng Kiến trúc A2 và đang chuẩn bị kế hoạch tái cấu trúc phân tầng).  
> Tham khảo chi tiết tại:
>
> - 📄 [Tổng quan Kiến trúc Hệ thống (Architecture Overview)](docs/architecture/architecture-overview.md)
> - 📄 [ADR-001: Lựa chọn Kiến trúc Feature-Based Modular Monolith](docs/decisions/ADR-001-feature-based-modular-architecture.md)
> - 📄 [Hướng dẫn Kiến trúc & Quy tắc cho AI Agent (AGENTS.md)](AGENTS.md)

---

## Kiểm thử & Chất lượng (Testing & Quality Gates)

Dự án áp dụng quy trình kiểm thử tự động nghiêm ngặt trên cả môi trường cục bộ và GitHub Actions CI:

- **Bộ kiểm thử tự động:** Ghi nhận tại baseline hiện tại (tháng 10/2026) gồm **41 test suites** với **288 tests** chạy trên Vitest, kiểm thử toàn diện từ logic tính điểm FIA, quy tắc Sprint, cache kết cấu 3D, đến khả năng chịu tải network.
- **Kiểm soát kích thước gói (Bundle Budget):** Initial JavaScript bundle được giới hạn nghiêm ngặt dưới **180 KiB gzip** (số liệu đo đạc baseline hiện tại đạt ~110 KiB gzip).
- **Cô lập gói WebGL:** Tự động kiểm tra để đảm bảo toàn bộ thư viện Three.js (~250 KiB gzip) chỉ được tải khi vào trang Showroom 3D, không rò rỉ vào bundle ban đầu.
- **Phân tích mã nguồn:** ESLint và Prettier kiểm tra cú pháp và định dạng trên mọi pull request.

---

## Chạy dự án cục bộ

### Yêu cầu

- Node.js 22 trở lên
- npm

### Cài đặt và khởi chạy

```bash
npm ci
npm run dev
```

Vite mở trang tại `http://localhost:5173`. Sao chép `.env.example` thành `.env.local` nếu cần cấu hình biến môi trường cục bộ.

### Các lệnh chính

```bash
npm run dev           # Khởi chạy dev server
npm run lint          # Kiểm tra lỗi cú pháp với ESLint
npm run format:check  # Kiểm tra định dạng mã với Prettier
npm test              # Chạy toàn bộ unit tests với Vitest
npm run build:check   # Build production và kiểm tra ngân sách bundle
npm run preview       # Xem trước bản build production
```
