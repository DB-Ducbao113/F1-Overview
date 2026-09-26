# mercedes — Mercedes-AMG PETRONAS F1 Team

**Team ID trong code:** `mercedes`
**Accent color:** `#00a19c`
**Tay dua 2026:** George Russell, Kimi Antonelli

---

## Quy tac dat ten anh

`[category]_[mo_ta_ngan].[ext]`

| Prefix | Y nghia | Vi du |
|--------|---------|-------|
| `car_` | Anh xe dua - launch, studio | `car_merc_launch.jpg` |
| `race_` | Anh duong dua - Grand Prix | `race_monaco_2025.jpg` |
| `driver_` | Chan dung hoac hanh dong tay dua | `driver_russell_podium.jpg` |
| `team_` | Anh doi - garage, crew, podium | `team_garage_2025.jpg` |

## Them vao code sau khi tai anh

File: `src/data/collections/index.ts`

```ts
{
  id: 'mercedes-2025-car-ten-xe',
  teamId: 'mercedes',
  season: 2025,
  category: 'car',
  imageUrl: '/assets/mercedes/car_ten_xe.jpg',
  titleVi: '...',
  titleEn: '...',
  captionVi: '...',
  captionEn: '...',
  photographer: '...',
  source: '...',
  license: 'Editorial Use',
  creditRequired: true,
  accentColor: '#00a19c',
},
```
