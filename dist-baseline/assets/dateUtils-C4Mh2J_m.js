const d = {
    Jan: 'Thg 1',
    Feb: 'Thg 2',
    Mar: 'Thg 3',
    Apr: 'Thg 4',
    May: 'Thg 5',
    Jun: 'Thg 6',
    Jul: 'Thg 7',
    Aug: 'Thg 8',
    Sep: 'Thg 9',
    Oct: 'Thg 10',
    Nov: 'Thg 11',
    Dec: 'Thg 12',
    January: 'Tháng 1',
    February: 'Tháng 2',
    March: 'Tháng 3',
    April: 'Tháng 4',
    June: 'Tháng 6',
    July: 'Tháng 7',
    August: 'Tháng 8',
    September: 'Tháng 9',
    October: 'Tháng 10',
    November: 'Tháng 11',
    December: 'Tháng 12',
  },
  m = {
    Mon: 'T2',
    Tue: 'T3',
    Wed: 'T4',
    Thu: 'T5',
    Fri: 'T6',
    Sat: 'T7',
    Sun: 'CN',
    Monday: 'Thứ 2',
    Tuesday: 'Thứ 3',
    Wednesday: 'Thứ 4',
    Thursday: 'Thứ 5',
    Friday: 'Thứ 6',
    Saturday: 'Thứ 7',
    Sunday: 'Chủ Nhật',
  },
  S = Object.entries(d).sort((t, a) => a[0].length - t[0].length),
  p = Object.entries(m).sort((t, a) => a[0].length - t[0].length),
  T = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function M(t, a) {
  if (!t) return '';
  const h = t.trim(),
    c = h.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s*[-–/]\s*(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (c) {
    const e = c[3].padStart(2, '0'),
      n = c[4],
      r = parseInt(c[5], 10),
      u = c[6].padStart(2, '0');
    if (a === 'vi') return `${e} – ${u} Thg ${r} ${n}`;
    {
      const g = T[r] || r;
      return `${e} – ${u} ${g} ${n}`;
    }
  }
  const o = h.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (o) {
    const e = o[1],
      n = parseInt(o[2], 10),
      r = o[3].padStart(2, '0');
    if (a === 'vi') return `${r} Thg ${n} ${e}`;
    {
      const u = T[n] || n;
      return `${r} ${u} ${e}`;
    }
  }
  const s = h.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (s) {
    const e = s[1].padStart(2, '0'),
      n = parseInt(s[2], 10),
      r = s[3];
    if (a === 'vi') return `${e} Thg ${n} ${r}`;
    {
      const u = T[n] || n;
      return `${e} ${u} ${r}`;
    }
  }
  if (a !== 'vi') return h;
  let i = h;
  return (
    S.forEach(([e, n]) => {
      const r = new RegExp(`\\b${e}\\b`, 'gi');
      i = i.replace(r, n);
    }),
    p.forEach(([e, n]) => {
      const r = new RegExp(`\\b${e}\\b`, 'gi');
      i = i.replace(r, n);
    }),
    i
  );
}
const f = {
  'Practice 1': 'Thử nghiệm 1 (FP1)',
  'Practice 2': 'Thử nghiệm 2 (FP2)',
  'Practice 3': 'Thử nghiệm 3 (FP3)',
  'Sprint Qualifying': 'Phân hạng Sprint',
  'Sprint Shootout': 'Phân hạng Sprint',
  'Sprint Race': 'Đua Sprint',
  Sprint: 'Đua Sprint',
  Qualifying: 'Đua phân hạng',
  Race: 'Đua chính (Race)',
  'Grand Prix Race': 'Đua chính (Race)',
};
function y(t, a) {
  return t ? (a !== 'vi' ? t : f[t] || t) : '';
}
function $(t, a) {
  const h = t.match(/^(\d{1,2}):(\d{2})/);
  if (!h) return { time: t, dayShift: 0 };
  const c = parseInt(h[1], 10),
    o = parseInt(h[2], 10),
    i = c * 60 + o - a * 60 + 420,
    e = ((i % 1440) + 1440) % 1440,
    n = i < 0 ? -1 : i >= 1440 ? 1 : 0,
    r = Math.floor(e / 60)
      .toString()
      .padStart(2, '0'),
    u = (e % 60).toString().padStart(2, '0');
  return { time: `${r}:${u}`, dayShift: n };
}
function l(t, a, h, c) {
  const o = t.match(/(\d{1,2})\s+([A-Za-z]{3})/),
    s = o ? T.indexOf(o[2]) - 1 : -1;
  return !o || s < 0
    ? h > 0
      ? 'ngày hôm sau'
      : 'ngày trước'
    : new Intl.DateTimeFormat(c === 'vi' ? 'vi-VN' : 'en-GB', {
        timeZone: 'UTC',
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
      }).format(new Date(Date.UTC(a, s, Number(o[1]) + h)));
}
export { y as a, l as b, M as f, $ as t };
