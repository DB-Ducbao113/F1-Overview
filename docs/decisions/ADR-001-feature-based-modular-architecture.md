# ADR-001: Lựa Chọn Kiến Trúc Feature-Based Modular Monolith

**Trạng thái:** Được chấp thuận (Accepted)  
**Ngày:** 30/10/2026  
**Người quyết định:** Team Podium EDS (Owner & Lead Architect)  
**Phạm vi:** Toàn bộ repository `F1-Overview`

---

## 1. Bối Cảnh & Vấn Đề (Context & Problem Statement)

Dự án F1-Overview ban đầu được xây dựng như một ứng dụng web React đơn giản sử dụng cách tổ chức **Layer-Based** truyền thống (`components/`, `data/`, `services/`, `utils/`). Tuy nhiên, hiện tại dự án đã phát triển thành một nền tảng kỹ thuật số phong phú (**Podium Effet De Sol**) bao gồm:

1. **Interactive 3D Showroom:** Dựng hình Three.js/R3F, procedural textures, shader compilation an toàn, giải phẫu xe và cơ chế **Adaptive Graphics Quality** tự động thích ứng với GPU.
2. **Standings & Rules Engine:** Hệ thống xử lý dữ liệu kép (Jolpica API + OpenF1 sprint timing), tính toán điểm số chặng và sprint theo chuẩn FIA, hỗ trợ lưu trữ offline / LocalStorage.
3. **High-Performance Web Client:** Kiểm soát nghiêm ngặt ngân sách bundle ban đầu (< 180 KiB gzip), cô lập hoàn toàn WebGL bundle qua dynamic lazy-load.

### Vấn đề gặp phải:

- Khi một tính năng mở rộng (ví dụ Showroom hoặc Championship), mã nguồn bị phân mảnh qua 4-5 thư mục gốc khác nhau, làm tăng gánh nặng nhận thức (cognitive load) và tăng rủi ro khi thay đổi mã nguồn.
- Ranh giới trách nhiệm bị mờ nhạt: logic nghiệp vụ F1 (`openF1SprintBridge.ts`) bị đặt trong thư mục dữ liệu tĩnh `data/`; dịch vụ `f1DataService.ts` kết hợp quá nhiều vai trò (API client, caching, sync logic).
- Nguy cơ rò rỉ Three.js vào bundle ban đầu do chưa có quy chuẩn ranh giới import (import boundaries) rõ ràng giữa UI shell và WebGL scene.

Cần xác định một kiến trúc kiến trúc chuẩn mực để định hướng tái cấu trúc an toàn cho dự án phát triển lâu dài.

---

## 2. Các Phương Án Đã Cân Nhắc (Alternatives Considered)

### Phương án A: Duy trì Layer-Based Architecture hiện tại

- **Mô tả:** Tiếp tục chia code theo loại file kỹ thuật (`components/`, `services/`, `data/`, `utils/`).
- **Ưu điểm:** Không cần di chuyển file, không tốn thời gian tái cấu trúc.
- **Nhược điểm:** Tính năng bị phân tán ngày càng trầm trọng khi số lượng file tăng lên (hiện đã có 170+ files trong `src/`); các file "God View" và "God Service" sẽ tiếp tục phình to.

### Phương án B: Chuyển dịch sang Microservices

- **Mô tả:** Tách backend dữ liệu thành các microservices độc lập (API Gateway, Standings Service, Telemetry Ingestion Service) và frontend độc lập.
- **Ưu điểm:** Khả năng mở rộng độc lập từng service.
- **Nhược điểm:** **Nghiêm trọng vượt mức cần thiết (Over-engineering).** Dự án hiện là client-centric application với 2 serverless endpoints trên Vercel. Chuyển sang microservices sẽ làm bùng nổ chi phí vận hành (DevOps, Docker orchestration, network latency, monitoring) mà không mang lại lợi ích thực tế cho người dùng cuối.

### Phương án C: Chuyển dịch sang Multi-Package Monorepo (Nx / Turborepo)

- **Mô tả:** Chia repo thành các packages nội bộ (`@podium/ui`, `@podium/domain`, `@podium/showroom`, `@podium/championship`).
- **Ưu điểm:** Kiểm soát phụ thuộc bằng cấu hình package boundaries chặt chẽ.
- **Nhược điểm:** Hiện tại chỉ có một ứng dụng web đích duy nhất (`f1-overview`). Việc thêm công cụ monorepo ở giai đoạn này gây phức tạp hóa cấu hình Vite, TypeScript path mapping, build pipeline và kéo dài thời gian CI/CD mà chưa có ứng dụng thứ hai để tái sử dụng.

### Phương án D: Feature-Based Modular Monolith kết hợp Pragmatic Clean Architecture (Được chọn)

- **Mô tả:** Tổ chức toàn bộ ứng dụng trong một single repository, nhưng gom nhóm mã nguồn theo **tính năng nghiệp vụ cốt lõi** (`features/showroom`, `features/championship`, `features/home`), đồng thời bên trong mỗi module phức tạp áp dụng nguyên lý Clean Architecture tinh gọn (tách biệt Presentation, Application, Domain, Infrastructure).
- **Ưu điểm:**
  - Gom cụm mã nguồn có tính kết dính cao (High Cohesion, Low Coupling).
  - Tách rời quy tắc tính điểm FIA (Domain) khỏi React và Three.js, giúp việc viết unit test cực kỳ nhanh và tin cậy.
  - Bảo vệ tuyệt đối ranh giới hiệu năng: UI Shell tải riêng, Three.js Rendering tải riêng.
  - Không phát sinh chi phí hạ tầng hay công cụ build phức tạp.

---

## 3. Quyết Định (Decision)

Chúng tôi quyết định áp dụng **Phương án D: Modular Monolith + Feature-Based Architecture + Pragmatic Clean Architecture** cho Podium EDS.

### Các nguyên tắc cốt lõi:

1. **Feature-First:** Mỗi tính năng độc lập sở hữu UI, state nội bộ, domain rules và API adapters của riêng mình.
2. **Pragmatic Clean Architecture:**
   - **Domain:** Chứa quy tắc thể thao F1 và thuật toán adaptive graphics. Phải là Pure TypeScript, không phụ thuộc framework UI hay thư viện bên ngoài.
   - **Application:** Điều phối các use case nghiệp vụ (đồng bộ mùa giải, chuyển đổi góc quay camera).
   - **Infrastructure:** Triển khai các cổng giao tiếp bên ngoài (Jolpica, OpenF1, LocalStorage).
   - **Presentation:** Giao diện React và WebGL canvas.
3. **WebGL Isolation:** Tách biệt tuyệt đối phần UI shell (`features/showroom/ui`) và WebGL scene (`features/showroom/rendering`). Chỉ tải Three.js thông qua dynamic lazy import.

---

## 4. Lợi Ích & Đánh Đổi (Benefits & Trade-offs)

### Lợi ích đạt được:

- **Tính bảo trì cao (Maintainability):** Khi sửa đổi tính năng BXH hoặc Showroom, lập trình viên và AI Agent chỉ cần làm việc trong thư mục feature tương ứng.
- **Khả năng kiểm thử vượt trội (Testability):** Kiểm thử quy tắc tính điểm F1 và thuật toán adaptive graphics chạy độc lập trong môi trường Node.js tốc độ miligiây.
- **Bảo toàn hiệu năng (Performance Integrity):** Ngăn ngừa tình trạng vô tình import Three.js vào trang chủ hoặc shell UI, giữ vững ngân sách initial bundle < 180 KiB gzip.
- **Sẵn sàng mở rộng:** Cấu trúc module sạch sẽ là bước đệm lý tưởng nếu trong tương lai dự án cần tách package monorepo hoặc phát triển ứng dụng di động React Native.

### Đánh đổi & Thách thức (Trade-offs & Mitigations):

- **Cần kỷ luật import cao:** Nếu không kiểm soát, nhà phát triển có thể tạo ra các phụ thuộc chéo (circular dependencies) giữa các feature.
  - _Giải pháp:_ Đặt quy tắc trong `AGENTS.md` và kiểm soát bằng CI quality gates.
- **Quá trình chuyển đổi:** Việc tái cấu trúc một codebase đang chạy có nguy cơ làm gián đoạn tính năng.
  - _Giải pháp:_ Lộ trình chuyển đổi từng bước (A1 -> A5), thử nghiệm trên Showroom (A3) trước khi áp dụng cho Championship (A4), giữ vững 288 automated tests.

---

## 5. Nguyên Tắc Mở Rộng Trong Tương Lai (Future Evolution)

1. **Khi nào chuyển sang Monorepo (Turborepo/Nx)?**
   - Chỉ xem xét khi dự án có từ **2 ứng dụng có thể deploy độc lập trở lên** (ví dụ: bổ sung ứng dụng Mobile React Native hoặc Admin Portal riêng biệt) cần dùng chung Domain / Shared UI package.
2. **Khi nào chuyển sang Microservices?**
   - Chỉ xem xét khi xuất hiện nhu cầu xử lý dữ liệu telemetry thời gian thực quy mô lớn (high-throughput WebSockets ingestion) hoặc khi hệ thống backend mở rộng cho nhiều người dùng đồng thời cần scaling hạ tầng độc lập.
