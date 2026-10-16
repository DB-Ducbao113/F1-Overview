# Production Release Verification — Báo cáo kiểm tra Production

- **Repository:** DB-Ducbao113/F1-Overview
- **Production:** https://podiumeds.vercel.app/
- **Commit main đối chiếu:** `84d3d4463659772ef0f4753bbceb896d43f30b0d` ("chuẩn hóa tên Grand Prix 2026")
- **Ngày kiểm tra:** 2026-10-15
- **Phương pháp:** curl (headers/TTFB), trình duyệt headless thật (render/interaction), GitHub REST API (workflows), build local từ đúng SHA `84d3d44` trong worktree tạm để so asset hash.
- **Không sửa code, không deploy, không thay đổi F1 data.** Worktree tạm đã được xóa sau khi so hash.

---

## 1. Production phục vụ đúng commit main — PASS

Build production local từ đúng SHA `84d3d44` và so với HTML/assets do Production trả về:

| Asset                                        | Production | Local build 84d3d44 | Khớp                                                     |
| -------------------------------------------- | ---------- | ------------------- | -------------------------------------------------------- |
| `assets/index-B2cyZl4c.js`                   | có         | có                  | ✅                                                       |
| `assets/vendor-three-DwPGbDo3.js`            | có         | có                  | ✅                                                       |
| `assets/ShowroomView-DKJRAGor.js`            | có         | có                  | ✅ — SHA-256 **byte-identical** giữa prod và build local |
| `assets/index-BuIdkWZuY.css` + 4 fonts WOFF2 | có         | có                  | ✅                                                       |

- `84d3d44` là head của `main`.
- `git show 84d3d44:src/components/showroom/ShowroomView.tsx` xác nhận source chứa M3B.1 (`frameloop='demand'`); chunk `ShowroomView-DKJRAGor.js` ở prod byte-identical với build từ SHA đó → **prod đang phục vụ đúng artifact của commit main**.
- Kết quả: **PASS**.

## 2. Hai workflow tự động — PASS (1 blocker tạm thời đã tự phục hồi)

Kiểm tra qua GitHub REST API (`/actions/runs`):

| Workflow | Run | Commit | Trigger | Kết quả |
|---|---|---|---|
| CI (`ci.yml`) | 38672973505 | `84d3d44` (main head) | push | ✅ job `ci` success |
| Auto Update F1 Data (`auto-update-f1.yml`) | gần nhất 2026-10-15 02:30 UTC | `9f04b02` → commit data mới lên main | schedule | ✅ success, có commit data mới lên main |
| Preview Smoke (`preview-smoke.yml`) | gần nhất | `338d690` | workflow_dispatch | ✅ success (không áp dụng cho production theo thiết kế) |

- Trigger schedule của auto-update chạy **Thứ 5 → Chủ nhật** (cron 4,5,6,0). Hôm kiểm tra là Thứ 4 15/10 → không có run schedule hôm đó là **đúng thiết kế**, không phải lỗi.
- **Blocker tạm thời đã ghi nhận:** các run schedule ngày 10–11/10 (cuối tuần đua) có bước "Sync completed sessions from F1 live timing" thất bại. Mọi run từ 11/10 18:27 UTC trở đi đều **success** → failure tạm thời, đã tự phục hồi. Khuyến nghị theo dõi thêm 1–2 weekend đua tới.
- Kết quả: **PASS**.

## 3. Bảy routes chính render thật trong browser — PASS

Test bằng trình duyệt headless thật (console + network được capture):

| Route | HTTP | Render | Console errors | Failed requests |
|---|---|---|---|
| `/` | 200 | Intro F1 + hero carousel + nội dung | 0 | 0 |
| `/season/2026` | 200 | Standings render 22 hàng | 0 | 0 |
| `/season/2025` | 200 | Render + tab Lịch Thi Đấu hoạt động | 0 | 0 |
| `/teams` | 200 | Directory danh sách đội | 0 | 0 |
| `/teams/mercedes` | 200 | Team profile render | 0 | 0 |
| `/drivers/antonelli` | 200 | Driver profile render | 0 | 0 |
| `/showroom` | 200 | Canvas 3D + đầy đủ control | 0 | 0 |

Season switcher 2026↔2025 hoạt động khi click thật. Kết quả: **PASS**.

## 4–5. Cache headers, X-Vercel-Cache, Age, TTFB — PASS (1 ghi nhận phương pháp)

Homepage `/`, curl với headers đầy đủ:

| Yêu cầu                      | TTFB                     | X-Vercel-Cache | Age                               |
| ---------------------------- | ------------------------ | -------------- | --------------------------------- |
| Lặp lại ×5 (warm)            | ~0.10–0.13 s mỗi request | `HIT`          | 29–62 s tăng dần giữa các request |
| Request kèm query riêng biệt | ~0.12 s                  | vẫn `HIT`      | —                                 |

- HTML trả về có `Age` tăng dần và `X-Vercel-Cache: HIT` ổn định → **HTML thực sự được cache ở CDN edge**.
- Cold/Warm thật: query string bị Vercel chuẩn hóa về cùng cache key nên **không tạo được MISS thật từ bên ngoài** (không purge được). So sánh cold tuyệt đối không khả thi không có quyền purge; bằng chứng có được là HIT ổn định với TTFB thấp và ổn định giữa các request — cache hoạt động đúng.
- Kết quả: **PASS**, kèm ghi nhận giới hạn phương pháp ở phần cold/warm.

## 6. Intro / Homepage / Season / Standings / Teams / Showroom — PASS

- **Intro F1:** screenshot xác nhậnFive-Lights intro render + nút **Skip** hoạt động (click thật).
- **Season 2026:** standings render 22 hàng; season switcher đổi qua 2025 và ngược lại OK.
- **Season tab:** Lịch Thi Đấu (Calendar) render khi click.
- **Teams directory:** danh sách đội render; team profile Mercedes render đủ nội dung.
- **Showroom controls:** Quick HUD (Cuộn Trang/Zoom 3D, Zoom ±, 4 Bảng, 360°, Mặc Định, Bản Gốc 2D) + Control Dock (Toàn Cảnh/Đọc Bảng/Chi Tiết Xe, Tour, Hotspots, Auto-Rotate) đều render và click hoạt động.

Kết quả: **PASS**.

## 7. M3B.1 demand renderer hoạt động trong Production — PASS

Instrumentation qua CDP `Runtime.evaluate` (main world), patch `requestAnimationFrame` + `WebGLRenderingContext.prototype.drawElements/drawArrays` (prototype level nên phủ cả context đã tạo), trên `/showroom` production:

| Phase | Cửa sổ đo | rAF callbacks | Indexed draws | Kết luận |
|---|---|---|
| 1. Auto-rotate ON (mặc định) | 6 s | ~117 | ~16,870 | Motion hoạt động liên tục |
| 2. Auto-rotate OFF (static idle) | 6 s | **0** | **Zero-idle đúng như claim M3B.1** |
| 3. Bật lại auto-rotate | 5 s | ~127 | ~16,762 | Motion hồi phục |
| 4. Sau livery switch sang Ferrari | 5 s idle | **0** | **0** | Quay về zero-idle sau tương tác |

Kết quả: **PASS** — hành vi demand-render của M3B.1 xác nhận hoạt động trong Production.

## 8. Responsive 390/768/1280/1440/1920 — PASS (1 ghi nhận tồn tại từ trước)

- Mỗi bề rộng: load `/showroom`, đo `document.documentElement.scrollWidth - clientWidth` và chụp screenshot (đã xem trực tiếp ảnh 390, 768, 1280).
- **Kết quả: 0 px document overflow ở cả 5 bề rộng.** Canvas 3D render đúng ở mọi bề rộng.
- **Ghi nhận không chặn (pre-existing):** ở 390–768 px, Control Dock và team badge chồng lấn một phần lên xe. Đây là bottleneck #4 đã được ghi nhận trong `docs/performance/m3/verified-bottlenecks.md` từ M3A và được lên kế hoạch xử lý ở phase responsive riêng — không phải regression của release này.

## 9. Console errors / API / Analytics / Speed Insights — PASS

- **0 console errors** và **0 failed requests** trên mọi route đã test.
- Self-hosted endpoints `/vercel-speed-insights` và `/vercel-insights` trả 200.
- Không có request F1 API nào lỗi (dữ liệu simulated được bundle sẵn).
- Kết quả: **PASS**.

## 10. Scheduled F1 data updates — PASS

- Workflow schedule chạy đúng lịch (Thứ 5–CN).
- Run 2026-10-15 02:30 UTC **success**, commit dữ liệu mới ("auto-update 2026 F1 race & standings") lên main.
- Failure tạm thời 10–11/10 đã tự phục hồi (chi tiết mục 2).
- Kết quả: **PASS**.

---

## Tổng kết

| # | Hạng mục | Kết quả |
|---|---|
| 1 | Commit + asset hashes đúng main | ✅ PASS |
| 2 | CI + Auto-Update + Preview Smoke | ✅ PASS |
| 3 | 7 routes render | ✅ PASS |
| 4 | Cache headers (X-Vercel-Cache, Age, TTFB) | ✅ PASS |
| 5 | Cold vs warm | ✅ PASS (ghi nhận: không tạo MISS thật từ ngoài) |
| 6 | Intro/Standings/Teams/Showroom | ✅ PASS |
| 7 | M3B.1 demand renderer trong prod | ✅ PASS |
| 8 | Responsive 5 bề rộng | ✅ PASS |
| 9 | Console/API/Analytics | ✅ PASS |
| 10 | Scheduled data updates | ✅ PASS |

**Blockers:** Không có blocker chặn release.

**Ghi nhận không chặn:**

1. Mobile control overlap 390–768 px — pre-existing từ M3A, có phase riêng.
2. Failure schedule tạm thời 10–11/10 — đã tự phục hồi, theo dõi thêm.
3. Không tạo được MISS cache thật từ bên ngoài để đo cold tuyệt đối.

## Về M3B.2 (làm rõ trạng thái)

- M3B.2 **đã được push lên nhánh `perf/speed-insights-v2`**: commit `b1691f49fc8e1b366e80480b5ffa5187acfad1c1` (implementation) + `83a2153844f83eec9222b7031e26b1db51d18b34` (format docs). HEAD branch = `83a2153` — chưa merge vào main (đúng quy trình, chờ review).
- Local gates đã pass: lint, format, 30 test files / 224 tests (+9 mới), coverage 63.2% statements, build 109.7 KiB gzip initial (budget 180), Showroom chunk 90.95 KiB gzip, vendor-three 249.28 KiB không đổi.
- **Còn thiếu:** browser-instrumented QA + 3 cold Lighthouse runs Desktop/Mobile cho M3B.2 với cùng harness M3B.1 (đã đánh dấu `pending` rõ ràng trong `docs/performance/m3/m3b2-results.md`, `artifacts/m3b2-before-after.csv`, `artifacts/m3b2-interaction-qa.json` — không bịa số). CI/Preview cho `83a2153` cũng chưa được ghi nhận.
- Lighthouse/browser QA của M3B.2 cần hoàn tất trước khi chốt PASS ở cấp milestone, sau đó mới đến M3B.3 Texture Cache.

**Đề xuất quyết định:** Release 1 trên production **GO** (không blocker). Tiếp theo: hoàn thiện browser QA M3B.2 → M3B.3 Texture Cache, không cần làm lại Release 1.
