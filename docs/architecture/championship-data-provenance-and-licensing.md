# Sổ Đăng Ký Bản Quyền, Nguồn Gốc Dữ Liệu & Quy Định Sử Dụng (Data Provenance & License Registry)

**Dự án:** Podium Effet De Sol / F1-Overview  
**Mô-đun:** Championship & Core Data Engine  
**Thời điểm lập:** Tháng 10/2026  
**Trạng thái kiểm toán:** Checkpoint A4.2 Baseline

---

## 1. Phân Định Bản Chất 6 Nguồn Dữ Liệu Trong Hệ Thống

| Nhóm nguồn dữ liệu                                                        | Bản chất dữ liệu                                                                                                              | Quyền sở hữu & Bản quyền                                                                                                                                              | Điều kiện sử dụng trong ứng dụng                                                                                                                        |
| :------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. FIA Sporting & General Regulations**                                 | Quy chế thể thao, công thức tính điểm (Race, Sprint, Fastest Lap), thuật toán phân xử hòa điểm (Countback Article A2.1.4(c)). | **Fédération Internationale de l'Automobile (FIA)** sở hữu thương hiệu và văn bản gốc. Các công thức toán học và luật chơi là sự kiện thực tế (factual sports rules). | Không tuyên bố liên kết, tài trợ hay chứng thực từ FIA / Formula One Management. Chỉ triển khai thuật toán tính toán sự thật thể thao.                  |
| **2. Phân loại chính thức FIA (FIA Classifications)**                     | Thứ hạng về đích, số vòng đua, khoảng cách thời gian từ các chặng đua đã hoàn tất.                                            | Thuộc phạm vi công cộng đối với sự thật thể thao (factual sports scores). Nhãn hiệu và logo thuộc bản quyền Formula One Licensing B.V.                                | Dùng làm số liệu đối soát (ground truth) cho baseline lịch sử (2024, 2025, và 2026 chặng 1–17).                                                         |
| **3. Jolpica F1 Community API (`api.jolpi.ca`)**                          | Dữ liệu lịch thi đấu, bảng kết quả Grand Prix và Sprint dạng REST JSON (kế thừa Ergast API).                                  | Giấy phép **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.                                                              | **NGHIÊM CẤM THƯƠNG MẠI HÓA**. Ứng dụng chỉ sử dụng cho mục đích phi thương mại, học thuật, trình diễn công nghệ. Phải ghi nhận ghi công (attribution). |
| **4. OpenF1 Community API (`api.openf1.org`)**                            | Dữ liệu Live Timing, telemetry, vị trí xe trên đường chạy GPS, kết quả Sprint provisional.                                    | Giấy phép **Creative Commons Attribution 4.0 International (CC BY 4.0)**.                                                                                             | Được phép sử dụng miễn phí khi cung cấp đầy đủ thông tin ghi công: _"Data provided by OpenF1 (openf1.org)"_.                                            |
| **5. Local Historical Snapshots (`detailedResults*.ts`, `standings.ts`)** | Bản sao lưu tĩnh được biên dịch sẵn trong mã nguồn để phục vụ khởi động tức thì và kiểm thử offline.                          | Dữ liệu tổng hợp nội bộ từ các nguồn thực tế công khai và API cộng đồng.                                                                                              | Phục vụ Data Integrity Policy, không được tự ý sửa đổi khi chưa có quy trình đối soát Golden Master.                                                    |
| **6. Application-Generated Fallback States**                              | Các bản ghi dự phòng (simulated / provisional fallback) sinh ra khi mất kết nối mạng.                                         | Thuộc bản quyền mã nguồn của dự án (Project Source Code).                                                                                                             | Phải đánh dấu rõ ràng `dataSource: 'Local snapshot'` và `isSynthesized: true` để người dùng không nhầm lẫn với kết quả FIA chính thức.                  |

---

## 2. Bảng Danh Mục Quyền Hạn Pháp Lý & Rủi Ro Thương Mại (License Registry)

```text
+-----------------------+---------------------+-------------------+---------------------+-------------------------+
| Nguồn dữ liệu         | Giấy phép cấp quyền | Giới hạn thương mại| Nghĩa vụ ghi công    | Quyền hạn chưa xác minh |
+-----------------------+---------------------+-------------------+---------------------+-------------------------+
| Jolpica API           | CC BY-NC-SA 4.0     | CÓ (Non-Commercial| BẮT BUỘC ghi rõ     | KHÔNG ĐƯỢC dùng trong   |
|                       |                     | ONLY)             | nguồn Jolpica/Ergast| sản phẩm có thu phí     |
| OpenF1 API            | CC BY 4.0           | KHÔNG (Được phép) | BẮT BUỘC ghi rõ     | Tuân thủ rate limit và  |
|                       |                     |                   | nguồn OpenF1        | proxy caching quy định  |
| FIA Official Web Data | Fact-based fair use | N/A (Factual data)| Ghi chú nguồn FIA   | Không được cào bóc ngầm |
|                       | (Không bản quyền số)|                   | Official Results    | (anti-scraping terms)   |
| Fallback / Mock Data  | MIT / Proprietary   | KHÔNG             | Nội bộ dự án        | Không                   |
+-----------------------+---------------------+-------------------+---------------------+-------------------------+
```

> [!WARNING] CẢNH BÁO QUY CHẾ THƯƠNG MẠI
> Codebase này tích hợp với Jolpica API dưới giấy phép **CC BY-NC-SA 4.0**. Do đó, toàn bộ sản phẩm hiện tại **KHÔNG THỂ THƯƠNG MẠI HÓA** hoặc tích hợp vào hệ thống tính phí mà không xin giấy phép thương mại riêng từ đội ngũ bảo trì Jolpica và các bên nắm bản quyền dữ liệu gốc.

---

## 3. Chính Sách Liêm Chính Dữ Liệu (Data Integrity Policy)

1. **Minh bạch trạng thái đồng bộ:**
   - Khi API gặp sự cố (429, 500, timeout), hệ thống **TUYỆT ĐỐI KHÔNG BÁO THÀNH CÔNG GIẢ TẠO**.
   - Phải báo trạng thái `syncStatus: 'error'` hoặc `partial: true`, bảo toàn dữ liệu snapshot hiện có trong `localStorage`.
2. **Quy tắc phân định nguồn (Source Priority):**
   - Kết quả chính thức từ Jolpica (`sprintProvenance: 'official'`) luôn có quyền ưu tiên cao nhất, đè lên dữ liệu tạm thời (provisional).
   - Dữ liệu OpenF1 chỉ đóng vai trò cầu nối tức thì trong thời gian diễn ra chặng đua khi Jolpica chưa cập nhật.
3. **Bảo toàn Cutoff mùa giải:**
   - Mùa giải 2024 và 2025 là các mùa giải đã kết thúc hoàn toàn (`final: true`), điểm số và thứ hạng được khóa cứng, không chạy thuật toán tính lại.
   - Mùa giải 2026: Các chặng 1–17 được bảo lưu trong baseline chính thức. Chỉ các chặng sau mốc cutoff mới tham gia cộng dồn điểm động.
