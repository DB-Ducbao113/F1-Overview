# racingbulls — Visa Cash App RB Formula One Team

**Team ID trong code:** `racingbulls`
**Accent color:** `#6692ff`
**Tay dua 2026:** Liam Lawson, Arvid Lindblad

---

## Quy tac dat ten anh

`[category]_[mo_ta_ngan].[ext]`

| Prefix | Y nghia | Vi du |
|--------|---------|-------|
| `car_` | Anh xe dua - launch, studio | `car_raci_launch.jpg` |
| `race_` | Anh duong dua - Grand Prix | `race_monaco_2025.jpg` |
| `driver_` | Chan dung hoac hanh dong tay dua | `driver_lawson_podium.jpg` |
| `team_` | Anh doi - garage, crew, podium | `team_garage_2025.jpg` |

## Them vao code sau khi tai anh

File: `src/data/collections/index.ts`

```ts
{
  id: 'racingbulls-2025-car-ten-xe',
  teamId: 'racingbulls',
  season: 2025,
  category: 'car',
  imageUrl: '/assets/racingbulls/car_ten_xe.jpg',
  titleVi: '...',
  titleEn: '...',
  captionVi: '...',
  captionEn: '...',
  photographer: '...',
  source: '...',
  license: 'Editorial Use',
  creditRequired: true,
  accentColor: '#6692ff',
},
```
