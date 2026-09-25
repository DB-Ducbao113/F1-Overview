# mclaren — McLaren Formula 1 Team

**Team ID trong code:** `mclaren`
**Accent color:** `#ff8000`
**Tay dua 2026:** Lando Norris, Oscar Piastri

---

## Quy tac dat ten anh

`[category]_[mo_ta_ngan].[ext]`

| Prefix | Y nghia | Vi du |
|--------|---------|-------|
| `car_` | Anh xe dua - launch, studio | `car_mcla_launch.jpg` |
| `race_` | Anh duong dua - Grand Prix | `race_monaco_2025.jpg` |
| `driver_` | Chan dung hoac hanh dong tay dua | `driver_norris_podium.jpg` |
| `team_` | Anh doi - garage, crew, podium | `team_garage_2025.jpg` |

## Them vao code sau khi tai anh

File: `src/data/collections/index.ts`

```ts
{
  id: 'mclaren-2025-car-ten-xe',
  teamId: 'mclaren',
  season: 2025,
  category: 'car',
  imageUrl: '/assets/mclaren/car_ten_xe.jpg',
  titleVi: '...',
  titleEn: '...',
  captionVi: '...',
  captionEn: '...',
  photographer: '...',
  source: '...',
  license: 'Editorial Use',
  creditRequired: true,
  accentColor: '#ff8000',
},
```
