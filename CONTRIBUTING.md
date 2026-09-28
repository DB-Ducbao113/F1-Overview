# Đóng góp cho F1 Hub

## Quy trình

1. Tạo nhánh từ `develop`: `feature/<ten-viec>`, `fix/<ten-loi>` hoặc `chore/<ten-viec>`.
2. Với thay đổi giao diện hoặc dữ liệu, mô tả mục tiêu, trạng thái rỗng/lỗi cần xử lý và cách kiểm tra.
3. Chạy `npm run lint`, `npm run format:check` và `npm run build` trước khi mở pull request.
4. Mở pull request về `develop`, giải thích thay đổi và đính kèm ảnh chụp nếu có chỉnh UI.

## Quy ước mã

- Dùng TypeScript và các kiểu hiện có; ưu tiên thay đổi nhỏ theo từng tính năng.
- Không đưa mật khẩu, token hoặc quyền admin vào code phía trình duyệt.
- Không bật community upload trước khi có backend, xác thực và phân quyền phía server.
- Không thêm dependency mới nếu chưa có lý do rõ ràng.
- Giữ chuỗi giao diện trong `src/i18n/translations.ts` và hỗ trợ cả tiếng Việt lẫn tiếng Anh.

## Hiện trạng kiểm tra

Repo chưa có test tự động. CI hiện chạy ESLint, kiểm tra Prettier và production build; nếu thay đổi hành vi, ghi rõ các bước kiểm tra thủ công trong pull request.
