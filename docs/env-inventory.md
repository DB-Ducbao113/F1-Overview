# Env inventory (không chứa giá trị secret)

> Quy tắc: không commit giá trị secret, không in token/nội dung `.env` vào chat/log.
> Revoke PAT và cập nhật CI secret cần quyền tài khoản — đang chờ người dùng xử lý.

## Biến ứng dụng thực sự đọc

| Biến | Nơi đọc | Bắt buộc? | Nguồn thay thế |
| ---- | ------- | --------- | -------------- |
| `VITE_ENABLE_COMMUNITY` | `.env.example`, `README.md` (mặc định `false`, hiện không có code đọc flag này trong `src`) | Không (giữ `false`) | Không cần đặt; nếu sau này dùng thì thêm vào `.env.example` + CI env |
| `import.meta.env.PROD` / `import.meta.env.DEV` | `src/main.tsx`, `src/services/f1DataService.ts` (built-in của Vite, không cần khai báo) | Không | Không cần |

## Biến server/proxy (đề xuất trong change này, chưa bắt buộc)

| Biến | Dùng cho | Ghi chú |
| ---- | -------- | ------- |
| `ALLOWED_ORIGINS` | `api/jolpica.ts`, `api/openf1.ts` — danh sách production/preview origin được cấu hình显式, cách nhau bằng dấu phẩy | Chưa dùng ở code hiện tại; khi deploy mới cần đặt. Không wildcard `*.vercel.app` |
| `GITHUB_AUTO_UPDATE_TOKEN` | workflow auto-update (CI secret, không nằm trong repo) | PAT hiện tại trên disk đã lộ — cần revoke bằng quyền tài khoản, sau đó đặt lại trong CI secrets. Không xóa file env local trước khi chốt danh sách này |

## Kết luận

* Không xóa `.env.local` trong change này trước khi người dùng xác nhận revoke + CI secret mới.
* Không thêm biến mới vào `.env.example` vì `ALLOWED_ORIGINS` là server env, không phải `VITE_*`.
