const e = {
    ferrari: { light: '#dc2626', dark: '#ef4444' },
    mclaren: { light: '#c2410c', dark: '#fb923c' },
    redbull: { light: '#1e40af', dark: '#60a5fa' },
    mercedes: { light: '#0f766e', dark: '#2dd4bf' },
    astonmartin: { light: '#047857', dark: '#34d399' },
    alpine: { light: '#0284c7', dark: '#38bdf8' },
    racingbulls: { light: '#4338ca', dark: '#818cf8' },
    haas: { light: '#b91c1c', dark: '#f87171' },
    williams: { light: '#0369a1', dark: '#38bdf8' },
    audi: { light: '#15803d', dark: '#4ade80' },
    cadillac: { light: '#b45309', dark: '#fbbf24' },
  },
  i = { light: '#1e293b', dark: '#f1f5f9' },
  n = {
    leclerc: 'ferrari',
    charlesleclerc: 'ferrari',
    hamilton: 'ferrari',
    lewishamilton: 'ferrari',
    norris: 'mclaren',
    landonorris: 'mclaren',
    piastri: 'mclaren',
    oscarpiastri: 'mclaren',
    verstappen: 'redbull',
    maxverstappen: 'redbull',
    hadjar: 'redbull',
    isackhadjar: 'redbull',
    russell: 'mercedes',
    georgerussell: 'mercedes',
    antonelli: 'mercedes',
    andreakimiantonelli: 'mercedes',
    kimiantonelli: 'mercedes',
    alonso: 'astonmartin',
    fernandoalonso: 'astonmartin',
    stroll: 'astonmartin',
    lancestroll: 'astonmartin',
    gasly: 'alpine',
    pierregasly: 'alpine',
    colapinto: 'alpine',
    francocolapinto: 'alpine',
    lawson: 'racingbulls',
    liamlawson: 'racingbulls',
    lindblad: 'racingbulls',
    arvidlindblad: 'racingbulls',
    tsunoda: 'racingbulls',
    yukitsunoda: 'racingbulls',
    ocon: 'haas',
    estebanocon: 'haas',
    bearman: 'haas',
    oliverbearman: 'haas',
    sainz: 'williams',
    carlossainz: 'williams',
    albon: 'williams',
    alexalbon: 'williams',
    alexanderalbon: 'williams',
    hulkenberg: 'audi',
    nicohulkenberg: 'audi',
    bortoleto: 'audi',
    gabrielbortoleto: 'audi',
    perez: 'cadillac',
    sergioperez: 'cadillac',
    bottas: 'cadillac',
    valtteribottas: 'cadillac',
  };
function s(l) {
  if (!l) return null;
  const a = l.toLowerCase().replace(/[^a-z0-9]/g, '');
  return a in e
    ? a
    : a in n
      ? n[a]
      : a.includes('ferrari')
        ? 'ferrari'
        : a.includes('mclaren')
          ? 'mclaren'
          : a.includes('redbull')
            ? 'redbull'
            : a.includes('mercedes')
              ? 'mercedes'
              : a.includes('aston')
                ? 'astonmartin'
                : a.includes('alpine')
                  ? 'alpine'
                  : a === 'rb' ||
                      a.startsWith('rbf1') ||
                      a.includes('racingbulls') ||
                      a.includes('vcarb') ||
                      a.includes('cashapp')
                    ? 'racingbulls'
                    : a.includes('haas')
                      ? 'haas'
                      : a.includes('williams')
                        ? 'williams'
                        : a.includes('audi') || a.includes('sauber') || a.includes('kick')
                          ? 'audi'
                          : a.includes('cadillac')
                            ? 'cadillac'
                            : null;
}
function c(l, a = !1) {
  const r = s(l);
  return !r || !e[r] ? (a ? i.dark : i.light) : a ? e[r].dark : e[r].light;
}
export { c as g, s as r };
