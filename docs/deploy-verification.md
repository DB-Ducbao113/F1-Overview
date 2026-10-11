# Deploy verification — checklist có lệnh, kỳ vọng và chỗ ghi bằng chứng

> Chưa chạy mục nào (không có Docker/Vercel CLI trên máy này, revoke PAT cần
> quyền tài khoản). Không đánh dấu task hoàn tất khi mới có hướng dẫn.
> Mỗi mục: chạy lệnh → so kết quả kỳ vọng → dán bằng chứng vào ô Evidence.

## A. Vercel serverless routing (cần `vercel dev` hoặc preview có function)

Vite preview **không** chứng minh function hoạt động — bắt buộc môi trường có
chạy API.

- [ ] A1. Proxy OpenF1 trả JSON, không trả `index.html`
  - Lệnh: `curl -s -o /dev/null -w '%{http_code} %{content_type}\n' 'https://<preview>/api/openf1/position?session_key=9472&limit=1'`
  - Kỳ vọng: `200 application/json`
  - Evidence: …
- [ ] A2. Endpoint ngoài allowlist bị từ chối
  - Lệnh: `curl -s 'https://<preview>/api/openf1/telemetry?session_key=1'`
  - Kỳ vọng: `400 {"error":"Unsupported OpenF1 endpoint"}`
  - Evidence: …
- [ ] A3. Origin lạ và preview không cấu hình bị chặn
  - Lệnh: `curl -s -H 'Origin: https://attacker.vercel.app' 'https://<preview>/api/openf1/sessions?session_key=latest' -D -`
  - Kỳ vọng: `403 {"error":"Origin not allowed"}`, không có `Access-Control-Allow-Origin`
  - Evidence: …
- [ ] A4. Dev và prod dùng cùng contract proxy
  - Lệnh: so `/api/openf1/sessions?session_key=latest` trên `vite dev` và preview
  - Kỳ vọng: cùng shape JSON, cùng mã lỗi khi upstream 429
  - Evidence: …

## B. Security headers prod (Docker + Vercel)

- [ ] B1. Đủ bộ headers
  - Lệnh: `curl -sI 'https://<prod>/' | grep -iE 'content-security-policy|strict-transport|permissions-policy|x-frame|x-content|referrer-policy|opener-policy|embedder-policy'`
  - Kỳ vọng: đủ 7 dòng; `X-XSS-Protection` không còn là biện pháp duy nhất
  - Evidence: …
- [ ] B2. Showroom 3D + fonts không bị CSP chặn
  - Lệnh: mở `/showroom`, xem Console → lọc `Content Security Policy`
  - Kỳ vọng: 0 blocked cho `fonts.googleapis.com`, `fonts.gstatic.com`,
    `/models`, `/textures`, canvas `blob:`/`data:`
  - Evidence (screenshot/log): …
- [ ] B3. Đánh giá COOP/COEP qua console (report-only — CHỈ quan sát)
  - Lệnh: mở `/showroom` + `/season/2026`, xem Console → lọc `Cross-Origin`
  - Kỳ vọng: ghi lại mọi report; **không enforce khi chưa xong B3**.
    COOP/COEP report-only hiện tại **chưa tạo cơ chế bảo vệ tương ứng**
    (không có `Reporting-Endpoints`/collector — xem PR description).
    Enforce sớm sẽ chặn asset cross-origin thiếu CORP.
  - Evidence (log console): …

## C. Docker non-root runtime (cần Docker)

- [ ] C1. Context không chứa file env
  - Lệnh: `docker build --progress=plain . 2>&1 | grep -i env` + `docker run --rm <img> ls -la /tmp | grep env` (kỳ vọng: không thấy `.env.local`; `.env.example` được phép)
  - Evidence: …
- [ ] C2. Chạy non-root, phục vụ OK ở port 8080
  - Lệnh: `docker run -d -p 8080:8080 <img>`; `docker exec <id> whoami` (kỳ vọng khác `root`); `curl -s -o /dev/null -w '%{http_code}\n' localhost:8080/` (200); `curl -s localhost:8080/healthz` (`healthy`)
  - Evidence: …
- [ ] C3. Pin digest image đã xác minh
  - Lệnh: `docker buildx imagetools inspect node:22-alpine` và `nginx:1.27-alpine`, chốt digest vào `Dockerfile` (thay 2 dòng NOTE)
  - Evidence (digest): …

## D. CI pipeline (cần chạy trên GitHub Actions)

- [ ] D1. Secret-scan fail với fixture, pass với tree sạch
  - Kỳ vọng: job `Secret scan` đỏ khi thêm file chứa `ghp_<30+ ký tự>` (không dùng token thật), xanh với tree hiện tại
  - Evidence (link run): …

## E. Tài khoản (chờ người dùng, quyền tài khoản)

- [ ] E1. Revoke PAT đã lộ, đặt lại `GITHUB_AUTO_UPDATE_TOKEN` trong CI secrets, sau đó mới xóa file env local (xem `docs/env-inventory.md`)
  - Evidence: …
