# redbull — Oracle Red Bull Racing

**Team ID trong code:** `redbull`
**Accent color:** `#0600ef`
**Tay dua 2026:** Max Verstappen, Isack Hadjar

---

## Quy tac dat ten anh

`[category]_[mo_ta_ngan].[ext]`

| Prefix | Y nghia | Vi du |
|--------|---------|-------|
| `car_` | Anh xe dua - launch, studio | `car_redb_launch.jpg` |
| `race_` | Anh duong dua - Grand Prix | `race_monaco_2025.jpg` |
| `driver_` | Chan dung hoac hanh dong tay dua | `driver_verstappen_podium.jpg` |
| `team_` | Anh doi - garage, crew, podium | `team_garage_2025.jpg` |

## Them vao code sau khi tai anh

File: `src/data/collections/index.ts`

```ts
{
  id: 'redbull-2025-car-ten-xe',
  teamId: 'redbull',
  season: 2025,
  category: 'car',
  imageUrl: '/assets/redbull/car_ten_xe.jpg',
  titleVi: '...',
  titleEn: '...',
  captionVi: '...',
  captionEn: '...',
  photographer: '...',
  source: '...',
  license: 'Editorial Use',
  creditRequired: true,
  accentColor: '#0600ef',
},
```
