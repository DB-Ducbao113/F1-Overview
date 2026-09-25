# 📁 F1 Collection — Hướng dẫn đặt tên ảnh

Đây là thư mục lưu ảnh cho tab **COLLECTION** của website.

---

## Cấu trúc thư mục

```
public/assets/
├── ferrari/
├── mclaren/
├── redbull/
├── mercedes/
├── astonmartin/
├── alpine/
├── racingbulls/
├── haas/
├── williams/
├── audi/
└── cadillac/
```

---

## Quy tắc đặt tên file ảnh

**Format bắt buộc:** `[category]_[mô_tả].[ext]`

| Prefix | Category trong code | Ý nghĩa |
|--------|---------------------|---------|
| `car_` | `'car'` | Ảnh xe đua — launch, studio, pit lane, close-up |
| `race_` | `'race'` | Ảnh hành động đường đua — Grand Prix |
| `driver_` | `'driver'` | Ảnh chân dung hoặc hành động của tay đua |
| `team_` | `'team'` | Ảnh đội — garage, crew, podium, team shot |

### Ví dụ cụ thể

```
ferrari/
├── car_sf25_launch.jpg          ✅ Đúng
├── race_monza_2025.jpg          ✅ Đúng
├── driver_leclerc_portrait.jpg  ✅ Đúng
├── team_garage_2024.jpg         ✅ Đúng
│
├── SF25.jpg                     ❌ Sai — không có prefix category
├── Ferrari race photo.jpg       ❌ Sai — có khoảng trắng
├── IMG_20241201.jpg             ❌ Sai — tên không có nghĩa
```

### Quy tắc phần mô tả

- Dùng **chữ thường**, **gạch dưới** thay khoảng trắng
- Không dùng ký tự đặc biệt: `( ) & # @ ! ,`
- Không dùng dấu tiếng Việt
- Nên ngắn gọn nhưng rõ nghĩa: `race_monaco_2025_norris`, `car_mcl39_papaya`

---

## Định dạng ảnh được hỗ trợ

| Định dạng | Khuyến nghị | Ghi chú |
|-----------|-------------|---------|
| `.jpg` / `.jpeg` | ✅ Ưu tiên | Ảnh thường, nén tốt |
| `.png` | ✅ OK | Khi cần nền trong suốt |
| `.webp` | ✅ Tốt nhất | Nhỏ hơn jpg, chất lượng cao |
| `.gif` / `.bmp` | ❌ Không dùng | Quá nặng |

**Kích thước khuyến nghị:** Tối thiểu `1200 × 800px`, tối đa `4MB`.

---

## Sau khi tải ảnh vào đây

Thêm entry vào file **`src/data/collections/index.ts`**:

```ts
{
  id: 'ferrari-2025-car-sf25',          // unique ID: [team]-[year]-[category]-[slug]
  teamId: 'ferrari',                     // khớp với tên folder
  season: 2025,
  category: 'car',                       // 'car' | 'race' | 'driver' | 'team'
  imageUrl: '/assets/ferrari/car_sf25_launch.jpg',   // đường dẫn từ public/
  titleVi: 'Ferrari SF-25 · Ra Mắt 2025',
  titleEn: 'Ferrari SF-25 · 2025 Season Launch',
  captionVi: 'Mô tả ngắn tiếng Việt...',
  captionEn: 'Short English caption...',
  photographer: 'Tên nhiếp ảnh gia',
  source: 'Nguồn ảnh / Trang tải về',
  license: 'Editorial Use / Press Reference',
  creditRequired: true,
  accentColor: '#e80020',                // màu chủ đạo của đội
},
```

---

## Cần trợ giúp?

Nếu bạn đặt tên sai quy tắc, hãy nói với AI agent:

> _"Hãy kiểm tra tên ảnh trong public/assets/ và sửa lại theo đúng quy tắc"_

Agent sẽ:
1. Đọc danh sách file trong từng folder
2. Phát hiện tên không theo đúng format `[category]_[mô_tả].[ext]`
3. Đổi tên file + cập nhật đường dẫn trong `collections/index.ts`
