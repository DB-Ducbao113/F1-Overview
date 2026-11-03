# Hướng Dẫn Bổ Sung Dành Cho GitHub Copilot

Tài liệu này cung cấp các chỉ dẫn thực thi bổ sung dành riêng cho GitHub Copilot khi gợi ý mã nguồn trong repository **Podium Effet De Sol (F1-Overview)**.

> [!IMPORTANT]
> Quy tắc kiến trúc tổng thể, ranh giới mô-đun và phân tầng Clean Architecture được định nghĩa duy nhất tại [AGENTS.md](file:///AGENTS.md) và [docs/architecture/architecture-overview.md](file:///docs/architecture/architecture-overview.md). Hãy tham chiếu tài liệu đó làm kim chỉ nam chính.

---

## 1. Nguyên Tắc Sinh Mã Cụ Thể (Copilot Code Generation Rules)

1. **Tuân thủ ranh giới gói WebGL (WebGL Import Guard):**
   - Khi gợi ý mã nguồn trong các tệp UI (`src/components/` hoặc `features/*/ui/`), tuyệt đối **KHÔNG** tự động import `three`, `@react-three/fiber`, hoặc `@react-three/drei`.
   - Các logic Three.js chỉ được gợi ý trong các tệp thuộc ranh giới 3D canvas (ví dụ: `ShowroomScene.tsx`, `F1Car3DModel.tsx`, `StudioW15Stage.tsx`).
2. **Khai báo kiểu dữ liệu TypeScript nghiêm ngặt (Strict Typing):**
   - Tránh dùng `any`. Luôn tận dụng các types chuẩn trong `src/types/` (ví dụ: `TeamId`, `SeasonYear`, `DetailedRaceResultEntry`, `QualityTier`).
3. **Pure Functions trong Domain:**
   - Các hàm tính điểm chặng, tính điểm sprint, hoặc tính toán chuyển đổi hệ màu phải là Pure Functions, không sinh side-effects và có thể kiểm thử độc lập mà không cần môi trường trình duyệt.

---

## 2. Xác Minh GitHub Actions Sau Khi Push (Actions Verification Protocol)

Sau mỗi lần push lên GitHub, không được coi tác vụ đã hoàn thành cho đến khi GitHub Actions được kiểm tra khớp với chính xác commit SHA đã push:

1. Ghi nhận branch đã push và full commit SHA bằng Git.
2. Kiểm tra `.github/workflows/` để xác nhận tên workflow, event triggers, branch filters, và permissions. Không giả định workflow định kỳ sẽ tự chạy cho một push.
3. Tìm các lượt chạy Actions khớp với đúng SHA, branch, và event. Ưu tiên GitHub Actions connector hoặc CLI `gh`.
4. Chờ tất cả workflow được kích hoạt bởi push đó hoàn tất với kết quả `conclusion == success`. Nếu thất bại, kiểm tra log, sửa nguyên nhân và push commit mới.
5. Nếu workflow không được kích hoạt, báo cáo `NOT TRIGGERED`. Nếu thiếu hoặc bị chặn, báo cáo `BLOCKED` hoặc `PENDING`.
6. Báo cáo branch, full SHA, trạng thái push, trạng thái từng workflow và kết luận cuối cùng: `VERIFIED`, `FAILED`, `PENDING`, hoặc `BLOCKED`.

### Kỳ vọng workflow:

- `CI` (`.github/workflows/ci.yml`): Chạy trên PR và push tới `main`, `develop`, `feature/**`, `fix/**`, `chore/**`.
- `Build & Publish Docker Image` (`.github/workflows/docker-publish.yml`): Chạy khi push tới `main`, version tags `v*.*.*`, hoặc manual dispatch.
- `Auto Update F1 2026 Data` (`.github/workflows/auto-update-f1.yml`): Chạy theo lịch định kỳ hoặc manual dispatch. Không kích hoạt thủ công nếu chưa có yêu cầu.

Không merge, force-push, tự ý publish image, tự ý đồng bộ production data hoặc sửa đổi production secrets khi chưa được phê duyệt.
