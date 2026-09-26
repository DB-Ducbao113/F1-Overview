# astonmartin — Aston Martin Aramco Formula One Team

**Team ID trong code:** `astonmartin`
**Accent color:** `#229971`
**Tay dua 2026:** Fernando Alonso, Lance Stroll

---

## Quy tac dat ten anh

`[category]_[mo_ta_ngan].[ext]`

| Prefix | Y nghia | Vi du |
|--------|---------|-------|
| `car_` | Anh xe dua - launch, studio | `car_asto_launch.jpg` |
| `race_` | Anh duong dua - Grand Prix | `race_monaco_2025.jpg` |
| `driver_` | Chan dung hoac hanh dong tay dua | `driver_alonso_podium.jpg` |
| `team_` | Anh doi - garage, crew, podium | `team_garage_2025.jpg` |

## Them vao code sau khi tai anh

File: `src/data/collections/index.ts`

```ts
{
  id: 'astonmartin-2025-car-ten-xe',
  teamId: 'astonmartin',
  season: 2025,
  category: 'car',
  imageUrl: '/assets/astonmartin/car_ten_xe.jpg',
  titleVi: '...',
  titleEn: '...',
  captionVi: '...',
  captionEn: '...',
  photographer: '...',
  source: '...',
  license: 'Editorial Use',
  creditRequired: true,
  accentColor: '#229971',
},
```
