import { r as t, j as g } from './vendor-react-B62-MmwA.js';
const z = ({
  children: m,
  className: x = '',
  maxTilt: o = 5,
  perspective: r = 1e3,
  glare: n = !0,
  glareOpacity: c = 0.15,
  scale: s = 1.012,
  style: y = {},
  onClick: $,
}) => {
  const a = t.useRef(null),
    [M, i] = t.useState(''),
    [b, d] = t.useState({ opacity: 0 }),
    [S, l] = t.useState(!1),
    X = t.useCallback(
      (u) => {
        if (!a.current) return;
        const e = a.current.getBoundingClientRect(),
          f = u.clientX - e.left,
          p = u.clientY - e.top,
          v = e.width / 2,
          h = e.height / 2,
          w = -((p - h) / h) * o,
          C = ((f - v) / v) * o;
        if (
          (i(
            `perspective(${r}px) rotateX(${w.toFixed(2)}deg) rotateY(${C.toFixed(2)}deg) scale3d(${s}, ${s}, ${s})`,
          ),
          n)
        ) {
          const E = (f / e.width) * 100,
            R = (p / e.height) * 100;
          d({
            opacity: c,
            background: `radial-gradient(circle 320px at ${E}% ${R}%, rgba(255, 255, 255, 0.8), transparent 70%)`,
          });
        }
      },
      [o, r, s, n, c],
    ),
    Y = () => {
      l(!0);
    },
    j = () => {
      (l(!1),
        i(`perspective(${r}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`),
        d({ opacity: 0 }));
    };
  return g.jsxs('div', {
    ref: a,
    onClick: $,
    onMouseEnter: Y,
    onMouseMove: X,
    onMouseLeave: j,
    style: {
      transform: M || void 0,
      transition: S ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      transformStyle: 'preserve-3d',
      ...y,
    },
    className: `relative overflow-hidden will-change-transform ${x}`,
    children: [
      m,
      n &&
        g.jsx('div', {
          'aria-hidden': 'true',
          style: { ...b, transition: 'opacity 0.25s ease' },
          className: 'absolute inset-0 pointer-events-none mix-blend-overlay z-30',
        }),
    ],
  });
};
export { z as C };
