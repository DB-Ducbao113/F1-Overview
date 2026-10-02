# Hướng dẫn cho coding agents

## Stack

- React 18, TypeScript strict, Vite 6 và Tailwind CSS.
- Zustand quản lý trạng thái giao diện.
- Three.js, React Three Fiber và Drei hiển thị nội dung 3D.
- Giao diện hỗ trợ tiếng Việt và tiếng Anh; chuỗi dịch nằm trong `src/i18n/translations.ts`.

## Cấu trúc

- `src/components/`: giao diện theo khu vực `home`, `championship`, `collection` và `layout`.
- `src/data/`: dữ liệu đội, xe, mùa giải và bộ sưu tập.
- `src/services/`: tải và đồng bộ dữ liệu.
- `src/store/`: state Zustand.
- `src/types/`: kiểu dùng chung.
- `public/assets/` và `public/models/`: ảnh và model tĩnh.

## Lệnh xác minh

- `npm run lint`
- `npm run format:check`
- `npm run build`
- `npm run format` chỉ khi người dùng yêu cầu format; tránh format hàng loạt file không liên quan.

Repo hiện chưa có test suite.

## Ràng buộc

- Không hardcode bí mật, mật khẩu hay quyền admin trong client.
- Không bật `VITE_ENABLE_COMMUNITY` trước khi có xác thực và phân quyền phía server.
- Không thêm dependency nếu chưa giải thích lý do và chưa được người dùng đồng ý.
- Giữ thay đổi theo lát dọc nhỏ; không refactor rộng nếu không cần cho tác vụ.
