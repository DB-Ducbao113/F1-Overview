# cadillac — Cadillac Formula 1 Team

**Team ID trong code:** `cadillac`
**Accent color:** `#8a8d8f`
**Tay dua 2026:** Sergio Perez, Valtteri Bottas

---

## Quy tac dat ten anh

`[category]_[mo_ta_ngan].[ext]`

| Prefix | Y nghia | Vi du |
|--------|---------|-------|
| `car_` | Anh xe dua - launch, studio | `car_cadi_launch.jpg` |
| `race_` | Anh duong dua - Grand Prix | `race_monaco_2025.jpg` |
| `driver_` | Chan dung hoac hanh dong tay dua | `driver_perez_podium.jpg` |
| `team_` | Anh doi - garage, crew, podium | `team_garage_2025.jpg` |

## Them vao code sau khi tai anh

File: `src/data/collections/index.ts`

```ts
{
  id: 'cadillac-2025-car-ten-xe',
  teamId: 'cadillac',
  season: 2025,
  category: 'car',
  imageUrl: '/assets/cadillac/car_ten_xe.jpg',
  titleVi: '...',
  titleEn: '...',
  captionVi: '...',
  captionEn: '...',
  photographer: '...',
  source: '...',
  license: 'Editorial Use',
  creditRequired: true,
  accentColor: '#8a8d8f',
},
```
