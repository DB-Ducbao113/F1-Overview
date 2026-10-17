const d = {
    fp1: 90,
    fp2: 90,
    fp3: 90,
    sprintQualifying: 90,
    sprint: 90,
    qualifying: 120,
    race: 180,
  },
  f = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
function m(t, r) {
  const e = t.sessions[r];
  if (!e || t.venueUtcOffset === void 0) return null;
  const n = e.dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/),
    a = e.dateStr.match(/^(?:[A-Za-z]{3}\s+)?(\d{1,2})\s+([A-Za-z]{3})(?:\s+(\d{4}))?$/),
    s = n
      ? { year: Number(n[1]), month: Number(n[2]) - 1, day: Number(n[3]) }
      : a
        ? { year: Number(a[3] || t.season), month: f[a[2]], day: Number(a[1]) }
        : null,
    u = e.timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!s || s.month === void 0 || !u) return null;
  const o = Number(u[1]),
    i = Number(u[2]);
  if (o > 23 || i > 59) return null;
  const l = Date.UTC(s.year, s.month, s.day, o, i) - t.venueUtcOffset * 60 * 60 * 1e3,
    c = new Date(l);
  return Number.isNaN(c.getTime()) ? null : c;
}
function S(t, r) {
  const e = m(t, r);
  if (!e) return null;
  const n = new Date(e.getTime() + d[r] * 6e4);
  return { start: e, end: n };
}
function N(t, r = Date.now()) {
  const e = S(t, 'race');
  if (!e) return t.status;
  if (t.status === 'completed' || r >= e.end.getTime()) return 'completed';
  if (t.status === 'current') return 'current';
  const n = Object.keys(t.sessions)
      .map((s) => {
        var u;
        return (u = m(t, s)) == null ? void 0 : u.getTime();
      })
      .filter((s) => s !== void 0),
    a = n.length > 0 ? Math.min(...n) : null;
  return a !== null && r >= a ? 'current' : 'upcoming';
}
export { N as a, S as g };
