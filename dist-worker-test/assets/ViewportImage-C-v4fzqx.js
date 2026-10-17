import { r, j as o } from './vendor-react-B62-MmwA.js';
const f = ({ wrapperClassName: i = 'absolute inset-0', ...a }) => {
  const t = r.useRef(null),
    [c, s] = r.useState(!1);
  return (
    r.useEffect(() => {
      const n = t.current;
      if (!n) return;
      if (!('IntersectionObserver' in window)) {
        s(!0);
        return;
      }
      const e = new IntersectionObserver(
        ([u]) => {
          u.isIntersecting && (s(!0), e.disconnect());
        },
        { rootMargin: '150px 0px' },
      );
      return (e.observe(n), () => e.disconnect());
    }, []),
    o.jsx('span', {
      ref: t,
      className: i,
      children: c && o.jsx('img', { ...a, loading: 'lazy', decoding: 'async' }),
    })
  );
};
export { f as V };
