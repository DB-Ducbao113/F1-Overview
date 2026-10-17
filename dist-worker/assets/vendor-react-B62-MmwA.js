function di(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, 'default') ? u.default : u;
}
var Gu = { exports: {} },
  Nr = {},
  Xu = { exports: {} },
  re = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var gc;
function cp() {
  if (gc) return re;
  gc = 1;
  var u = Symbol.for('react.element'),
    s = Symbol.for('react.portal'),
    i = Symbol.for('react.fragment'),
    c = Symbol.for('react.strict_mode'),
    f = Symbol.for('react.profiler'),
    p = Symbol.for('react.provider'),
    g = Symbol.for('react.context'),
    S = Symbol.for('react.forward_ref'),
    y = Symbol.for('react.suspense'),
    E = Symbol.for('react.memo'),
    R = Symbol.for('react.lazy'),
    C = Symbol.iterator;
  function P(v) {
    return v === null || typeof v != 'object'
      ? null
      : ((v = (C && v[C]) || v['@@iterator']), typeof v == 'function' ? v : null);
  }
  var j = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    B = Object.assign,
    T = {};
  function N(v, z, q) {
    ((this.props = v), (this.context = z), (this.refs = T), (this.updater = q || j));
  }
  ((N.prototype.isReactComponent = {}),
    (N.prototype.setState = function (v, z) {
      if (typeof v != 'object' && typeof v != 'function' && v != null)
        throw Error(
          'setState(...): takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, v, z, 'setState');
    }),
    (N.prototype.forceUpdate = function (v) {
      this.updater.enqueueForceUpdate(this, v, 'forceUpdate');
    }));
  function M() {}
  M.prototype = N.prototype;
  function A(v, z, q) {
    ((this.props = v), (this.context = z), (this.refs = T), (this.updater = q || j));
  }
  var V = (A.prototype = new M());
  ((V.constructor = A), B(V, N.prototype), (V.isPureReactComponent = !0));
  var b = Array.isArray,
    ne = Object.prototype.hasOwnProperty,
    ee = { current: null },
    oe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function fe(v, z, q) {
    var Z,
      le = {},
      te = null,
      ae = null;
    if (z != null)
      for (Z in (z.ref !== void 0 && (ae = z.ref), z.key !== void 0 && (te = '' + z.key), z))
        ne.call(z, Z) && !oe.hasOwnProperty(Z) && (le[Z] = z[Z]);
    var se = arguments.length - 2;
    if (se === 1) le.children = q;
    else if (1 < se) {
      for (var ve = Array(se), Ze = 0; Ze < se; Ze++) ve[Ze] = arguments[Ze + 2];
      le.children = ve;
    }
    if (v && v.defaultProps)
      for (Z in ((se = v.defaultProps), se)) le[Z] === void 0 && (le[Z] = se[Z]);
    return { $$typeof: u, type: v, key: te, ref: ae, props: le, _owner: ee.current };
  }
  function De(v, z) {
    return { $$typeof: u, type: v.type, key: z, ref: v.ref, props: v.props, _owner: v._owner };
  }
  function Ue(v) {
    return typeof v == 'object' && v !== null && v.$$typeof === u;
  }
  function rt(v) {
    var z = { '=': '=0', ':': '=2' };
    return (
      '$' +
      v.replace(/[=:]/g, function (q) {
        return z[q];
      })
    );
  }
  var je = /\/+/g;
  function ke(v, z) {
    return typeof v == 'object' && v !== null && v.key != null ? rt('' + v.key) : z.toString(36);
  }
  function Oe(v, z, q, Z, le) {
    var te = typeof v;
    (te === 'undefined' || te === 'boolean') && (v = null);
    var ae = !1;
    if (v === null) ae = !0;
    else
      switch (te) {
        case 'string':
        case 'number':
          ae = !0;
          break;
        case 'object':
          switch (v.$$typeof) {
            case u:
            case s:
              ae = !0;
          }
      }
    if (ae)
      return (
        (ae = v),
        (le = le(ae)),
        (v = Z === '' ? '.' + ke(ae, 0) : Z),
        b(le)
          ? ((q = ''),
            v != null && (q = v.replace(je, '$&/') + '/'),
            Oe(le, z, q, '', function (Ze) {
              return Ze;
            }))
          : le != null &&
            (Ue(le) &&
              (le = De(
                le,
                q +
                  (!le.key || (ae && ae.key === le.key)
                    ? ''
                    : ('' + le.key).replace(je, '$&/') + '/') +
                  v,
              )),
            z.push(le)),
        1
      );
    if (((ae = 0), (Z = Z === '' ? '.' : Z + ':'), b(v)))
      for (var se = 0; se < v.length; se++) {
        te = v[se];
        var ve = Z + ke(te, se);
        ae += Oe(te, z, q, ve, le);
      }
    else if (((ve = P(v)), typeof ve == 'function'))
      for (v = ve.call(v), se = 0; !(te = v.next()).done;)
        ((te = te.value), (ve = Z + ke(te, se++)), (ae += Oe(te, z, q, ve, le)));
    else if (te === 'object')
      throw (
        (z = String(v)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (z === '[object Object]' ? 'object with keys {' + Object.keys(v).join(', ') + '}' : z) +
            '). If you meant to render a collection of children, use an array instead.',
        )
      );
    return ae;
  }
  function Ce(v, z, q) {
    if (v == null) return v;
    var Z = [],
      le = 0;
    return (
      Oe(v, Z, '', '', function (te) {
        return z.call(q, te, le++);
      }),
      Z
    );
  }
  function Ne(v) {
    if (v._status === -1) {
      var z = v._result;
      ((z = z()),
        z.then(
          function (q) {
            (v._status === 0 || v._status === -1) && ((v._status = 1), (v._result = q));
          },
          function (q) {
            (v._status === 0 || v._status === -1) && ((v._status = 2), (v._result = q));
          },
        ),
        v._status === -1 && ((v._status = 0), (v._result = z)));
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var de = { current: null },
    _ = { transition: null },
    U = { ReactCurrentDispatcher: de, ReactCurrentBatchConfig: _, ReactCurrentOwner: ee };
  function I() {
    throw Error('act(...) is not supported in production builds of React.');
  }
  return (
    (re.Children = {
      map: Ce,
      forEach: function (v, z, q) {
        Ce(
          v,
          function () {
            z.apply(this, arguments);
          },
          q,
        );
      },
      count: function (v) {
        var z = 0;
        return (
          Ce(v, function () {
            z++;
          }),
          z
        );
      },
      toArray: function (v) {
        return (
          Ce(v, function (z) {
            return z;
          }) || []
        );
      },
      only: function (v) {
        if (!Ue(v))
          throw Error('React.Children.only expected to receive a single React element child.');
        return v;
      },
    }),
    (re.Component = N),
    (re.Fragment = i),
    (re.Profiler = f),
    (re.PureComponent = A),
    (re.StrictMode = c),
    (re.Suspense = y),
    (re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = U),
    (re.act = I),
    (re.cloneElement = function (v, z, q) {
      if (v == null)
        throw Error(
          'React.cloneElement(...): The argument must be a React element, but you passed ' +
            v +
            '.',
        );
      var Z = B({}, v.props),
        le = v.key,
        te = v.ref,
        ae = v._owner;
      if (z != null) {
        if (
          (z.ref !== void 0 && ((te = z.ref), (ae = ee.current)),
          z.key !== void 0 && (le = '' + z.key),
          v.type && v.type.defaultProps)
        )
          var se = v.type.defaultProps;
        for (ve in z)
          ne.call(z, ve) &&
            !oe.hasOwnProperty(ve) &&
            (Z[ve] = z[ve] === void 0 && se !== void 0 ? se[ve] : z[ve]);
      }
      var ve = arguments.length - 2;
      if (ve === 1) Z.children = q;
      else if (1 < ve) {
        se = Array(ve);
        for (var Ze = 0; Ze < ve; Ze++) se[Ze] = arguments[Ze + 2];
        Z.children = se;
      }
      return { $$typeof: u, type: v.type, key: le, ref: te, props: Z, _owner: ae };
    }),
    (re.createContext = function (v) {
      return (
        (v = {
          $$typeof: g,
          _currentValue: v,
          _currentValue2: v,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }),
        (v.Provider = { $$typeof: p, _context: v }),
        (v.Consumer = v)
      );
    }),
    (re.createElement = fe),
    (re.createFactory = function (v) {
      var z = fe.bind(null, v);
      return ((z.type = v), z);
    }),
    (re.createRef = function () {
      return { current: null };
    }),
    (re.forwardRef = function (v) {
      return { $$typeof: S, render: v };
    }),
    (re.isValidElement = Ue),
    (re.lazy = function (v) {
      return { $$typeof: R, _payload: { _status: -1, _result: v }, _init: Ne };
    }),
    (re.memo = function (v, z) {
      return { $$typeof: E, type: v, compare: z === void 0 ? null : z };
    }),
    (re.startTransition = function (v) {
      var z = _.transition;
      _.transition = {};
      try {
        v();
      } finally {
        _.transition = z;
      }
    }),
    (re.unstable_act = I),
    (re.useCallback = function (v, z) {
      return de.current.useCallback(v, z);
    }),
    (re.useContext = function (v) {
      return de.current.useContext(v);
    }),
    (re.useDebugValue = function () {}),
    (re.useDeferredValue = function (v) {
      return de.current.useDeferredValue(v);
    }),
    (re.useEffect = function (v, z) {
      return de.current.useEffect(v, z);
    }),
    (re.useId = function () {
      return de.current.useId();
    }),
    (re.useImperativeHandle = function (v, z, q) {
      return de.current.useImperativeHandle(v, z, q);
    }),
    (re.useInsertionEffect = function (v, z) {
      return de.current.useInsertionEffect(v, z);
    }),
    (re.useLayoutEffect = function (v, z) {
      return de.current.useLayoutEffect(v, z);
    }),
    (re.useMemo = function (v, z) {
      return de.current.useMemo(v, z);
    }),
    (re.useReducer = function (v, z, q) {
      return de.current.useReducer(v, z, q);
    }),
    (re.useRef = function (v) {
      return de.current.useRef(v);
    }),
    (re.useState = function (v) {
      return de.current.useState(v);
    }),
    (re.useSyncExternalStore = function (v, z, q) {
      return de.current.useSyncExternalStore(v, z, q);
    }),
    (re.useTransition = function () {
      return de.current.useTransition();
    }),
    (re.version = '18.3.1'),
    re
  );
}
var wc;
function Ir() {
  return (wc || ((wc = 1), (Xu.exports = cp())), Xu.exports);
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Sc;
function fp() {
  if (Sc) return Nr;
  Sc = 1;
  var u = Ir(),
    s = Symbol.for('react.element'),
    i = Symbol.for('react.fragment'),
    c = Object.prototype.hasOwnProperty,
    f = u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    p = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(S, y, E) {
    var R,
      C = {},
      P = null,
      j = null;
    (E !== void 0 && (P = '' + E),
      y.key !== void 0 && (P = '' + y.key),
      y.ref !== void 0 && (j = y.ref));
    for (R in y) c.call(y, R) && !p.hasOwnProperty(R) && (C[R] = y[R]);
    if (S && S.defaultProps) for (R in ((y = S.defaultProps), y)) C[R] === void 0 && (C[R] = y[R]);
    return { $$typeof: s, type: S, key: P, ref: j, props: C, _owner: f.current };
  }
  return ((Nr.Fragment = i), (Nr.jsx = g), (Nr.jsxs = g), Nr);
}
var kc;
function dp() {
  return (kc || ((kc = 1), (Gu.exports = fp())), Gu.exports);
}
var ym = dp(),
  L = Ir();
const pp = di(L);
var Ql = {},
  Ju = { exports: {} },
  Je = {},
  Zu = { exports: {} },
  qu = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ec;
function hp() {
  return (
    Ec ||
      ((Ec = 1),
      (function (u) {
        function s(_, U) {
          var I = _.length;
          _.push(U);
          e: for (; 0 < I;) {
            var v = (I - 1) >>> 1,
              z = _[v];
            if (0 < f(z, U)) ((_[v] = U), (_[I] = z), (I = v));
            else break e;
          }
        }
        function i(_) {
          return _.length === 0 ? null : _[0];
        }
        function c(_) {
          if (_.length === 0) return null;
          var U = _[0],
            I = _.pop();
          if (I !== U) {
            _[0] = I;
            e: for (var v = 0, z = _.length, q = z >>> 1; v < q;) {
              var Z = 2 * (v + 1) - 1,
                le = _[Z],
                te = Z + 1,
                ae = _[te];
              if (0 > f(le, I))
                te < z && 0 > f(ae, le)
                  ? ((_[v] = ae), (_[te] = I), (v = te))
                  : ((_[v] = le), (_[Z] = I), (v = Z));
              else if (te < z && 0 > f(ae, I)) ((_[v] = ae), (_[te] = I), (v = te));
              else break e;
            }
          }
          return U;
        }
        function f(_, U) {
          var I = _.sortIndex - U.sortIndex;
          return I !== 0 ? I : _.id - U.id;
        }
        if (typeof performance == 'object' && typeof performance.now == 'function') {
          var p = performance;
          u.unstable_now = function () {
            return p.now();
          };
        } else {
          var g = Date,
            S = g.now();
          u.unstable_now = function () {
            return g.now() - S;
          };
        }
        var y = [],
          E = [],
          R = 1,
          C = null,
          P = 3,
          j = !1,
          B = !1,
          T = !1,
          N = typeof setTimeout == 'function' ? setTimeout : null,
          M = typeof clearTimeout == 'function' ? clearTimeout : null,
          A = typeof setImmediate < 'u' ? setImmediate : null;
        typeof navigator < 'u' &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function V(_) {
          for (var U = i(E); U !== null;) {
            if (U.callback === null) c(E);
            else if (U.startTime <= _) (c(E), (U.sortIndex = U.expirationTime), s(y, U));
            else break;
            U = i(E);
          }
        }
        function b(_) {
          if (((T = !1), V(_), !B))
            if (i(y) !== null) ((B = !0), Ne(ne));
            else {
              var U = i(E);
              U !== null && de(b, U.startTime - _);
            }
        }
        function ne(_, U) {
          ((B = !1), T && ((T = !1), M(fe), (fe = -1)), (j = !0));
          var I = P;
          try {
            for (V(U), C = i(y); C !== null && (!(C.expirationTime > U) || (_ && !rt()));) {
              var v = C.callback;
              if (typeof v == 'function') {
                ((C.callback = null), (P = C.priorityLevel));
                var z = v(C.expirationTime <= U);
                ((U = u.unstable_now()),
                  typeof z == 'function' ? (C.callback = z) : C === i(y) && c(y),
                  V(U));
              } else c(y);
              C = i(y);
            }
            if (C !== null) var q = !0;
            else {
              var Z = i(E);
              (Z !== null && de(b, Z.startTime - U), (q = !1));
            }
            return q;
          } finally {
            ((C = null), (P = I), (j = !1));
          }
        }
        var ee = !1,
          oe = null,
          fe = -1,
          De = 5,
          Ue = -1;
        function rt() {
          return !(u.unstable_now() - Ue < De);
        }
        function je() {
          if (oe !== null) {
            var _ = u.unstable_now();
            Ue = _;
            var U = !0;
            try {
              U = oe(!0, _);
            } finally {
              U ? ke() : ((ee = !1), (oe = null));
            }
          } else ee = !1;
        }
        var ke;
        if (typeof A == 'function')
          ke = function () {
            A(je);
          };
        else if (typeof MessageChannel < 'u') {
          var Oe = new MessageChannel(),
            Ce = Oe.port2;
          ((Oe.port1.onmessage = je),
            (ke = function () {
              Ce.postMessage(null);
            }));
        } else
          ke = function () {
            N(je, 0);
          };
        function Ne(_) {
          ((oe = _), ee || ((ee = !0), ke()));
        }
        function de(_, U) {
          fe = N(function () {
            _(u.unstable_now());
          }, U);
        }
        ((u.unstable_IdlePriority = 5),
          (u.unstable_ImmediatePriority = 1),
          (u.unstable_LowPriority = 4),
          (u.unstable_NormalPriority = 3),
          (u.unstable_Profiling = null),
          (u.unstable_UserBlockingPriority = 2),
          (u.unstable_cancelCallback = function (_) {
            _.callback = null;
          }),
          (u.unstable_continueExecution = function () {
            B || j || ((B = !0), Ne(ne));
          }),
          (u.unstable_forceFrameRate = function (_) {
            0 > _ || 125 < _
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (De = 0 < _ ? Math.floor(1e3 / _) : 5);
          }),
          (u.unstable_getCurrentPriorityLevel = function () {
            return P;
          }),
          (u.unstable_getFirstCallbackNode = function () {
            return i(y);
          }),
          (u.unstable_next = function (_) {
            switch (P) {
              case 1:
              case 2:
              case 3:
                var U = 3;
                break;
              default:
                U = P;
            }
            var I = P;
            P = U;
            try {
              return _();
            } finally {
              P = I;
            }
          }),
          (u.unstable_pauseExecution = function () {}),
          (u.unstable_requestPaint = function () {}),
          (u.unstable_runWithPriority = function (_, U) {
            switch (_) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                _ = 3;
            }
            var I = P;
            P = _;
            try {
              return U();
            } finally {
              P = I;
            }
          }),
          (u.unstable_scheduleCallback = function (_, U, I) {
            var v = u.unstable_now();
            switch (
              (typeof I == 'object' && I !== null
                ? ((I = I.delay), (I = typeof I == 'number' && 0 < I ? v + I : v))
                : (I = v),
              _)
            ) {
              case 1:
                var z = -1;
                break;
              case 2:
                z = 250;
                break;
              case 5:
                z = 1073741823;
                break;
              case 4:
                z = 1e4;
                break;
              default:
                z = 5e3;
            }
            return (
              (z = I + z),
              (_ = {
                id: R++,
                callback: U,
                priorityLevel: _,
                startTime: I,
                expirationTime: z,
                sortIndex: -1,
              }),
              I > v
                ? ((_.sortIndex = I),
                  s(E, _),
                  i(y) === null && _ === i(E) && (T ? (M(fe), (fe = -1)) : (T = !0), de(b, I - v)))
                : ((_.sortIndex = z), s(y, _), B || j || ((B = !0), Ne(ne))),
              _
            );
          }),
          (u.unstable_shouldYield = rt),
          (u.unstable_wrapCallback = function (_) {
            var U = P;
            return function () {
              var I = P;
              P = U;
              try {
                return _.apply(this, arguments);
              } finally {
                P = I;
              }
            };
          }));
      })(qu)),
    qu
  );
}
var Cc;
function mp() {
  return (Cc || ((Cc = 1), (Zu.exports = hp())), Zu.exports);
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var xc;
function vp() {
  if (xc) return Je;
  xc = 1;
  var u = Ir(),
    s = mp();
  function i(e) {
    for (
      var t = 'https://reactjs.org/docs/error-decoder.html?invariant=' + e, n = 1;
      n < arguments.length;
      n++
    )
      t += '&args[]=' + encodeURIComponent(arguments[n]);
    return (
      'Minified React error #' +
      e +
      '; visit ' +
      t +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  var c = new Set(),
    f = {};
  function p(e, t) {
    (g(e, t), g(e + 'Capture', t));
  }
  function g(e, t) {
    for (f[e] = t, e = 0; e < t.length; e++) c.add(t[e]);
  }
  var S = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    y = Object.prototype.hasOwnProperty,
    E =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    R = {},
    C = {};
  function P(e) {
    return y.call(C, e) ? !0 : y.call(R, e) ? !1 : E.test(e) ? (C[e] = !0) : ((R[e] = !0), !1);
  }
  function j(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case 'function':
      case 'symbol':
        return !0;
      case 'boolean':
        return r
          ? !1
          : n !== null
            ? !n.acceptsBooleans
            : ((e = e.toLowerCase().slice(0, 5)), e !== 'data-' && e !== 'aria-');
      default:
        return !1;
    }
  }
  function B(e, t, n, r) {
    if (t === null || typeof t > 'u' || j(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null)
      switch (n.type) {
        case 3:
          return !t;
        case 4:
          return t === !1;
        case 5:
          return isNaN(t);
        case 6:
          return isNaN(t) || 1 > t;
      }
    return !1;
  }
  function T(e, t, n, r, l, o, a) {
    ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
      (this.attributeName = r),
      (this.attributeNamespace = l),
      (this.mustUseProperty = n),
      (this.propertyName = e),
      (this.type = t),
      (this.sanitizeURL = o),
      (this.removeEmptyString = a));
  }
  var N = {};
  ('children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
    .split(' ')
    .forEach(function (e) {
      N[e] = new T(e, 0, !1, e, null, !1, !1);
    }),
    [
      ['acceptCharset', 'accept-charset'],
      ['className', 'class'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
    ].forEach(function (e) {
      var t = e[0];
      N[t] = new T(t, 1, !1, e[1], null, !1, !1);
    }),
    ['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (e) {
      N[e] = new T(e, 2, !1, e.toLowerCase(), null, !1, !1);
    }),
    ['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(
      function (e) {
        N[e] = new T(e, 2, !1, e, null, !1, !1);
      },
    ),
    'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
      .split(' ')
      .forEach(function (e) {
        N[e] = new T(e, 3, !1, e.toLowerCase(), null, !1, !1);
      }),
    ['checked', 'multiple', 'muted', 'selected'].forEach(function (e) {
      N[e] = new T(e, 3, !0, e, null, !1, !1);
    }),
    ['capture', 'download'].forEach(function (e) {
      N[e] = new T(e, 4, !1, e, null, !1, !1);
    }),
    ['cols', 'rows', 'size', 'span'].forEach(function (e) {
      N[e] = new T(e, 6, !1, e, null, !1, !1);
    }),
    ['rowSpan', 'start'].forEach(function (e) {
      N[e] = new T(e, 5, !1, e.toLowerCase(), null, !1, !1);
    }));
  var M = /[\-:]([a-z])/g;
  function A(e) {
    return e[1].toUpperCase();
  }
  ('accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
    .split(' ')
    .forEach(function (e) {
      var t = e.replace(M, A);
      N[t] = new T(t, 1, !1, e, null, !1, !1);
    }),
    'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'
      .split(' ')
      .forEach(function (e) {
        var t = e.replace(M, A);
        N[t] = new T(t, 1, !1, e, 'http://www.w3.org/1999/xlink', !1, !1);
      }),
    ['xml:base', 'xml:lang', 'xml:space'].forEach(function (e) {
      var t = e.replace(M, A);
      N[t] = new T(t, 1, !1, e, 'http://www.w3.org/XML/1998/namespace', !1, !1);
    }),
    ['tabIndex', 'crossOrigin'].forEach(function (e) {
      N[e] = new T(e, 1, !1, e.toLowerCase(), null, !1, !1);
    }),
    (N.xlinkHref = new T('xlinkHref', 1, !1, 'xlink:href', 'http://www.w3.org/1999/xlink', !0, !1)),
    ['src', 'href', 'action', 'formAction'].forEach(function (e) {
      N[e] = new T(e, 1, !1, e.toLowerCase(), null, !0, !0);
    }));
  function V(e, t, n, r) {
    var l = N.hasOwnProperty(t) ? N[t] : null;
    (l !== null
      ? l.type !== 0
      : r || !(2 < t.length) || (t[0] !== 'o' && t[0] !== 'O') || (t[1] !== 'n' && t[1] !== 'N')) &&
      (B(t, n, l, r) && (n = null),
      r || l === null
        ? P(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, '' + n))
        : l.mustUseProperty
          ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : '') : n)
          : ((t = l.attributeName),
            (r = l.attributeNamespace),
            n === null
              ? e.removeAttribute(t)
              : ((l = l.type),
                (n = l === 3 || (l === 4 && n === !0) ? '' : '' + n),
                r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var b = u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    ne = Symbol.for('react.element'),
    ee = Symbol.for('react.portal'),
    oe = Symbol.for('react.fragment'),
    fe = Symbol.for('react.strict_mode'),
    De = Symbol.for('react.profiler'),
    Ue = Symbol.for('react.provider'),
    rt = Symbol.for('react.context'),
    je = Symbol.for('react.forward_ref'),
    ke = Symbol.for('react.suspense'),
    Oe = Symbol.for('react.suspense_list'),
    Ce = Symbol.for('react.memo'),
    Ne = Symbol.for('react.lazy'),
    de = Symbol.for('react.offscreen'),
    _ = Symbol.iterator;
  function U(e) {
    return e === null || typeof e != 'object'
      ? null
      : ((e = (_ && e[_]) || e['@@iterator']), typeof e == 'function' ? e : null);
  }
  var I = Object.assign,
    v;
  function z(e) {
    if (v === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        v = (t && t[1]) || '';
      }
    return (
      `
` +
      v +
      e
    );
  }
  var q = !1;
  function Z(e, t) {
    if (!e || q) return '';
    q = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t)
        if (
          ((t = function () {
            throw Error();
          }),
          Object.defineProperty(t.prototype, 'props', {
            set: function () {
              throw Error();
            },
          }),
          typeof Reflect == 'object' && Reflect.construct)
        ) {
          try {
            Reflect.construct(t, []);
          } catch (x) {
            var r = x;
          }
          Reflect.construct(e, [], t);
        } else {
          try {
            t.call();
          } catch (x) {
            r = x;
          }
          e.call(t.prototype);
        }
      else {
        try {
          throw Error();
        } catch (x) {
          r = x;
        }
        e();
      }
    } catch (x) {
      if (x && r && typeof x.stack == 'string') {
        for (
          var l = x.stack.split(`
`),
            o = r.stack.split(`
`),
            a = l.length - 1,
            d = o.length - 1;
          1 <= a && 0 <= d && l[a] !== o[d];
        )
          d--;
        for (; 1 <= a && 0 <= d; a--, d--)
          if (l[a] !== o[d]) {
            if (a !== 1 || d !== 1)
              do
                if ((a--, d--, 0 > d || l[a] !== o[d])) {
                  var h =
                    `
` + l[a].replace(' at new ', ' at ');
                  return (
                    e.displayName &&
                      h.includes('<anonymous>') &&
                      (h = h.replace('<anonymous>', e.displayName)),
                    h
                  );
                }
              while (1 <= a && 0 <= d);
            break;
          }
      }
    } finally {
      ((q = !1), (Error.prepareStackTrace = n));
    }
    return (e = e ? e.displayName || e.name : '') ? z(e) : '';
  }
  function le(e) {
    switch (e.tag) {
      case 5:
        return z(e.type);
      case 16:
        return z('Lazy');
      case 13:
        return z('Suspense');
      case 19:
        return z('SuspenseList');
      case 0:
      case 2:
      case 15:
        return ((e = Z(e.type, !1)), e);
      case 11:
        return ((e = Z(e.type.render, !1)), e);
      case 1:
        return ((e = Z(e.type, !0)), e);
      default:
        return '';
    }
  }
  function te(e) {
    if (e == null) return null;
    if (typeof e == 'function') return e.displayName || e.name || null;
    if (typeof e == 'string') return e;
    switch (e) {
      case oe:
        return 'Fragment';
      case ee:
        return 'Portal';
      case De:
        return 'Profiler';
      case fe:
        return 'StrictMode';
      case ke:
        return 'Suspense';
      case Oe:
        return 'SuspenseList';
    }
    if (typeof e == 'object')
      switch (e.$$typeof) {
        case rt:
          return (e.displayName || 'Context') + '.Consumer';
        case Ue:
          return (e._context.displayName || 'Context') + '.Provider';
        case je:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ''),
              (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
            e
          );
        case Ce:
          return ((t = e.displayName || null), t !== null ? t : te(e.type) || 'Memo');
        case Ne:
          ((t = e._payload), (e = e._init));
          try {
            return te(e(t));
          } catch {}
      }
    return null;
  }
  function ae(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return 'Cache';
      case 9:
        return (t.displayName || 'Context') + '.Consumer';
      case 10:
        return (t._context.displayName || 'Context') + '.Provider';
      case 18:
        return 'DehydratedFragment';
      case 11:
        return (
          (e = t.render),
          (e = e.displayName || e.name || ''),
          t.displayName || (e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')
        );
      case 7:
        return 'Fragment';
      case 5:
        return t;
      case 4:
        return 'Portal';
      case 3:
        return 'Root';
      case 6:
        return 'Text';
      case 16:
        return te(t);
      case 8:
        return t === fe ? 'StrictMode' : 'Mode';
      case 22:
        return 'Offscreen';
      case 12:
        return 'Profiler';
      case 21:
        return 'Scope';
      case 13:
        return 'Suspense';
      case 19:
        return 'SuspenseList';
      case 25:
        return 'TracingMarker';
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == 'function') return t.displayName || t.name || null;
        if (typeof t == 'string') return t;
    }
    return null;
  }
  function se(e) {
    switch (typeof e) {
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return e;
      case 'object':
        return e;
      default:
        return '';
    }
  }
  function ve(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
  }
  function Ze(e) {
    var t = ve(e) ? 'checked' : 'value',
      n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
      r = '' + e[t];
    if (
      !e.hasOwnProperty(t) &&
      typeof n < 'u' &&
      typeof n.get == 'function' &&
      typeof n.set == 'function'
    ) {
      var l = n.get,
        o = n.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return l.call(this);
          },
          set: function (a) {
            ((r = '' + a), o.call(this, a));
          },
        }),
        Object.defineProperty(e, t, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return r;
          },
          setValue: function (a) {
            r = '' + a;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function Fr(e) {
    e._valueTracker || (e._valueTracker = Ze(e));
  }
  function xi(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      r = '';
    return (
      e && (r = ve(e) ? (e.checked ? 'true' : 'false') : e.value),
      (e = r),
      e !== n ? (t.setValue(e), !0) : !1
    );
  }
  function Mr(e) {
    if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function eo(e, t) {
    var n = t.checked;
    return I({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: n ?? e._wrapperState.initialChecked,
    });
  }
  function Ri(e, t) {
    var n = t.defaultValue == null ? '' : t.defaultValue,
      r = t.checked != null ? t.checked : t.defaultChecked;
    ((n = se(t.value != null ? t.value : n)),
      (e._wrapperState = {
        initialChecked: r,
        initialValue: n,
        controlled:
          t.type === 'checkbox' || t.type === 'radio' ? t.checked != null : t.value != null,
      }));
  }
  function _i(e, t) {
    ((t = t.checked), t != null && V(e, 'checked', t, !1));
  }
  function to(e, t) {
    _i(e, t);
    var n = se(t.value),
      r = t.type;
    if (n != null)
      r === 'number'
        ? ((n === 0 && e.value === '') || e.value != n) && (e.value = '' + n)
        : e.value !== '' + n && (e.value = '' + n);
    else if (r === 'submit' || r === 'reset') {
      e.removeAttribute('value');
      return;
    }
    (t.hasOwnProperty('value')
      ? no(e, t.type, n)
      : t.hasOwnProperty('defaultValue') && no(e, t.type, se(t.defaultValue)),
      t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked));
  }
  function Pi(e, t, n) {
    if (t.hasOwnProperty('value') || t.hasOwnProperty('defaultValue')) {
      var r = t.type;
      if (!((r !== 'submit' && r !== 'reset') || (t.value !== void 0 && t.value !== null))) return;
      ((t = '' + e._wrapperState.initialValue),
        n || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((n = e.name),
      n !== '' && (e.name = ''),
      (e.defaultChecked = !!e._wrapperState.initialChecked),
      n !== '' && (e.name = n));
  }
  function no(e, t, n) {
    (t !== 'number' || Mr(e.ownerDocument) !== e) &&
      (n == null
        ? (e.defaultValue = '' + e._wrapperState.initialValue)
        : e.defaultValue !== '' + n && (e.defaultValue = '' + n));
  }
  var Vn = Array.isArray;
  function mn(e, t, n, r) {
    if (((e = e.options), t)) {
      t = {};
      for (var l = 0; l < n.length; l++) t['$' + n[l]] = !0;
      for (n = 0; n < e.length; n++)
        ((l = t.hasOwnProperty('$' + e[n].value)),
          e[n].selected !== l && (e[n].selected = l),
          l && r && (e[n].defaultSelected = !0));
    } else {
      for (n = '' + se(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          ((e[l].selected = !0), r && (e[l].defaultSelected = !0));
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ro(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(i(91));
    return I({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: '' + e._wrapperState.initialValue,
    });
  }
  function Li(e, t) {
    var n = t.value;
    if (n == null) {
      if (((n = t.children), (t = t.defaultValue), n != null)) {
        if (t != null) throw Error(i(92));
        if (Vn(n)) {
          if (1 < n.length) throw Error(i(93));
          n = n[0];
        }
        t = n;
      }
      (t == null && (t = ''), (n = t));
    }
    e._wrapperState = { initialValue: se(n) };
  }
  function Ni(e, t) {
    var n = se(t.value),
      r = se(t.defaultValue);
    (n != null &&
      ((n = '' + n),
      n !== e.value && (e.value = n),
      t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
      r != null && (e.defaultValue = '' + r));
  }
  function Ti(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== '' && t !== null && (e.value = t);
  }
  function zi(e) {
    switch (e) {
      case 'svg':
        return 'http://www.w3.org/2000/svg';
      case 'math':
        return 'http://www.w3.org/1998/Math/MathML';
      default:
        return 'http://www.w3.org/1999/xhtml';
    }
  }
  function lo(e, t) {
    return e == null || e === 'http://www.w3.org/1999/xhtml'
      ? zi(t)
      : e === 'http://www.w3.org/2000/svg' && t === 'foreignObject'
        ? 'http://www.w3.org/1999/xhtml'
        : e;
  }
  var Ur,
    Ii = (function (e) {
      return typeof MSApp < 'u' && MSApp.execUnsafeLocalFunction
        ? function (t, n, r, l) {
            MSApp.execUnsafeLocalFunction(function () {
              return e(t, n, r, l);
            });
          }
        : e;
    })(function (e, t) {
      if (e.namespaceURI !== 'http://www.w3.org/2000/svg' || 'innerHTML' in e) e.innerHTML = t;
      else {
        for (
          Ur = Ur || document.createElement('div'),
            Ur.innerHTML = '<svg>' + t.valueOf().toString() + '</svg>',
            t = Ur.firstChild;
          e.firstChild;
        )
          e.removeChild(e.firstChild);
        for (; t.firstChild;) e.appendChild(t.firstChild);
      }
    });
  function Qn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Kn = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    hf = ['Webkit', 'ms', 'Moz', 'O'];
  Object.keys(Kn).forEach(function (e) {
    hf.forEach(function (t) {
      ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Kn[t] = Kn[e]));
    });
  });
  function Di(e, t, n) {
    return t == null || typeof t == 'boolean' || t === ''
      ? ''
      : n || typeof t != 'number' || t === 0 || (Kn.hasOwnProperty(e) && Kn[e])
        ? ('' + t).trim()
        : t + 'px';
  }
  function Oi(e, t) {
    e = e.style;
    for (var n in t)
      if (t.hasOwnProperty(n)) {
        var r = n.indexOf('--') === 0,
          l = Di(n, t[n], r);
        (n === 'float' && (n = 'cssFloat'), r ? e.setProperty(n, l) : (e[n] = l));
      }
  }
  var mf = I(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    },
  );
  function oo(e, t) {
    if (t) {
      if (mf[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
        throw Error(i(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(i(60));
        if (
          typeof t.dangerouslySetInnerHTML != 'object' ||
          !('__html' in t.dangerouslySetInnerHTML)
        )
          throw Error(i(61));
      }
      if (t.style != null && typeof t.style != 'object') throw Error(i(62));
    }
  }
  function uo(e, t) {
    if (e.indexOf('-') === -1) return typeof t.is == 'string';
    switch (e) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var io = null;
  function ao(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var so = null,
    vn = null,
    yn = null;
  function Fi(e) {
    if ((e = hr(e))) {
      if (typeof so != 'function') throw Error(i(280));
      var t = e.stateNode;
      t && ((t = ul(t)), so(e.stateNode, e.type, t));
    }
  }
  function Mi(e) {
    vn ? (yn ? yn.push(e) : (yn = [e])) : (vn = e);
  }
  function Ui() {
    if (vn) {
      var e = vn,
        t = yn;
      if (((yn = vn = null), Fi(e), t)) for (e = 0; e < t.length; e++) Fi(t[e]);
    }
  }
  function ji(e, t) {
    return e(t);
  }
  function $i() {}
  var co = !1;
  function Ai(e, t, n) {
    if (co) return e(t, n);
    co = !0;
    try {
      return ji(e, t, n);
    } finally {
      ((co = !1), (vn !== null || yn !== null) && ($i(), Ui()));
    }
  }
  function Yn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = ul(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ((r = !r.disabled) ||
          ((e = e.type),
          (r = !(e === 'button' || e === 'input' || e === 'select' || e === 'textarea'))),
          (e = !r));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != 'function') throw Error(i(231, t, typeof n));
    return n;
  }
  var fo = !1;
  if (S)
    try {
      var Gn = {};
      (Object.defineProperty(Gn, 'passive', {
        get: function () {
          fo = !0;
        },
      }),
        window.addEventListener('test', Gn, Gn),
        window.removeEventListener('test', Gn, Gn));
    } catch {
      fo = !1;
    }
  function vf(e, t, n, r, l, o, a, d, h) {
    var x = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, x);
    } catch (O) {
      this.onError(O);
    }
  }
  var Xn = !1,
    jr = null,
    $r = !1,
    po = null,
    yf = {
      onError: function (e) {
        ((Xn = !0), (jr = e));
      },
    };
  function gf(e, t, n, r, l, o, a, d, h) {
    ((Xn = !1), (jr = null), vf.apply(yf, arguments));
  }
  function wf(e, t, n, r, l, o, a, d, h) {
    if ((gf.apply(this, arguments), Xn)) {
      if (Xn) {
        var x = jr;
        ((Xn = !1), (jr = null));
      } else throw Error(i(198));
      $r || (($r = !0), (po = x));
    }
  }
  function en(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return;) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function Bi(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function Hi(e) {
    if (en(e) !== e) throw Error(i(188));
  }
  function Sf(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = en(e)), t === null)) throw Error(i(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ;) {
      var l = n.return;
      if (l === null) break;
      var o = l.alternate;
      if (o === null) {
        if (((r = l.return), r !== null)) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === o.child) {
        for (o = l.child; o;) {
          if (o === n) return (Hi(l), e);
          if (o === r) return (Hi(l), t);
          o = o.sibling;
        }
        throw Error(i(188));
      }
      if (n.return !== r.return) ((n = l), (r = o));
      else {
        for (var a = !1, d = l.child; d;) {
          if (d === n) {
            ((a = !0), (n = l), (r = o));
            break;
          }
          if (d === r) {
            ((a = !0), (r = l), (n = o));
            break;
          }
          d = d.sibling;
        }
        if (!a) {
          for (d = o.child; d;) {
            if (d === n) {
              ((a = !0), (n = o), (r = l));
              break;
            }
            if (d === r) {
              ((a = !0), (r = o), (n = l));
              break;
            }
            d = d.sibling;
          }
          if (!a) throw Error(i(189));
        }
      }
      if (n.alternate !== r) throw Error(i(190));
    }
    if (n.tag !== 3) throw Error(i(188));
    return n.stateNode.current === n ? e : t;
  }
  function Wi(e) {
    return ((e = Sf(e)), e !== null ? Vi(e) : null);
  }
  function Vi(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null;) {
      var t = Vi(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Qi = s.unstable_scheduleCallback,
    Ki = s.unstable_cancelCallback,
    kf = s.unstable_shouldYield,
    Ef = s.unstable_requestPaint,
    xe = s.unstable_now,
    Cf = s.unstable_getCurrentPriorityLevel,
    ho = s.unstable_ImmediatePriority,
    Yi = s.unstable_UserBlockingPriority,
    Ar = s.unstable_NormalPriority,
    xf = s.unstable_LowPriority,
    Gi = s.unstable_IdlePriority,
    Br = null,
    kt = null;
  function Rf(e) {
    if (kt && typeof kt.onCommitFiberRoot == 'function')
      try {
        kt.onCommitFiberRoot(Br, e, void 0, (e.current.flags & 128) === 128);
      } catch {}
  }
  var ft = Math.clz32 ? Math.clz32 : Lf,
    _f = Math.log,
    Pf = Math.LN2;
  function Lf(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((_f(e) / Pf) | 0)) | 0);
  }
  var Hr = 64,
    Wr = 4194304;
  function Jn(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function Vr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0,
      l = e.suspendedLanes,
      o = e.pingedLanes,
      a = n & 268435455;
    if (a !== 0) {
      var d = a & ~l;
      d !== 0 ? (r = Jn(d)) : ((o &= a), o !== 0 && (r = Jn(o)));
    } else ((a = n & ~l), a !== 0 ? (r = Jn(a)) : o !== 0 && (r = Jn(o)));
    if (r === 0) return 0;
    if (
      t !== 0 &&
      t !== r &&
      (t & l) === 0 &&
      ((l = r & -r), (o = t & -t), l >= o || (l === 16 && (o & 4194240) !== 0))
    )
      return t;
    if (((r & 4) !== 0 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
      for (e = e.entanglements, t &= r; 0 < t;)
        ((n = 31 - ft(t)), (l = 1 << n), (r |= e[n]), (t &= ~l));
    return r;
  }
  function Nf(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Tf(e, t) {
    for (
      var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes;
      0 < o;
    ) {
      var a = 31 - ft(o),
        d = 1 << a,
        h = l[a];
      (h === -1
        ? ((d & n) === 0 || (d & r) !== 0) && (l[a] = Nf(d, t))
        : h <= t && (e.expiredLanes |= d),
        (o &= ~d));
    }
  }
  function mo(e) {
    return ((e = e.pendingLanes & -1073741825), e !== 0 ? e : e & 1073741824 ? 1073741824 : 0);
  }
  function Xi() {
    var e = Hr;
    return ((Hr <<= 1), (Hr & 4194240) === 0 && (Hr = 64), e);
  }
  function vo(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Zn(e, t, n) {
    ((e.pendingLanes |= t),
      t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
      (e = e.eventTimes),
      (t = 31 - ft(t)),
      (e[t] = n));
  }
  function zf(e, t) {
    var n = e.pendingLanes & ~t;
    ((e.pendingLanes = t),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.expiredLanes &= t),
      (e.mutableReadLanes &= t),
      (e.entangledLanes &= t),
      (t = e.entanglements));
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n;) {
      var l = 31 - ft(n),
        o = 1 << l;
      ((t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~o));
    }
  }
  function yo(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n;) {
      var r = 31 - ft(n),
        l = 1 << r;
      ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
    }
  }
  var ce = 0;
  function Ji(e) {
    return ((e &= -e), 1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1);
  }
  var Zi,
    go,
    qi,
    bi,
    ea,
    wo = !1,
    Qr = [],
    Ft = null,
    Mt = null,
    Ut = null,
    qn = new Map(),
    bn = new Map(),
    jt = [],
    If =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
        ' ',
      );
  function ta(e, t) {
    switch (e) {
      case 'focusin':
      case 'focusout':
        Ft = null;
        break;
      case 'dragenter':
      case 'dragleave':
        Mt = null;
        break;
      case 'mouseover':
      case 'mouseout':
        Ut = null;
        break;
      case 'pointerover':
      case 'pointerout':
        qn.delete(t.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        bn.delete(t.pointerId);
    }
  }
  function er(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: r,
          nativeEvent: o,
          targetContainers: [l],
        }),
        t !== null && ((t = hr(t)), t !== null && go(t)),
        e)
      : ((e.eventSystemFlags |= r),
        (t = e.targetContainers),
        l !== null && t.indexOf(l) === -1 && t.push(l),
        e);
  }
  function Df(e, t, n, r, l) {
    switch (t) {
      case 'focusin':
        return ((Ft = er(Ft, e, t, n, r, l)), !0);
      case 'dragenter':
        return ((Mt = er(Mt, e, t, n, r, l)), !0);
      case 'mouseover':
        return ((Ut = er(Ut, e, t, n, r, l)), !0);
      case 'pointerover':
        var o = l.pointerId;
        return (qn.set(o, er(qn.get(o) || null, e, t, n, r, l)), !0);
      case 'gotpointercapture':
        return ((o = l.pointerId), bn.set(o, er(bn.get(o) || null, e, t, n, r, l)), !0);
    }
    return !1;
  }
  function na(e) {
    var t = tn(e.target);
    if (t !== null) {
      var n = en(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = Bi(n)), t !== null)) {
            ((e.blockedOn = t),
              ea(e.priority, function () {
                qi(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Kr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
      var n = ko(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ((io = r), n.target.dispatchEvent(r), (io = null));
      } else return ((t = hr(n)), t !== null && go(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function ra(e, t, n) {
    Kr(e) && n.delete(t);
  }
  function Of() {
    ((wo = !1),
      Ft !== null && Kr(Ft) && (Ft = null),
      Mt !== null && Kr(Mt) && (Mt = null),
      Ut !== null && Kr(Ut) && (Ut = null),
      qn.forEach(ra),
      bn.forEach(ra));
  }
  function tr(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      wo || ((wo = !0), s.unstable_scheduleCallback(s.unstable_NormalPriority, Of)));
  }
  function nr(e) {
    function t(l) {
      return tr(l, e);
    }
    if (0 < Qr.length) {
      tr(Qr[0], e);
      for (var n = 1; n < Qr.length; n++) {
        var r = Qr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (
      Ft !== null && tr(Ft, e),
        Mt !== null && tr(Mt, e),
        Ut !== null && tr(Ut, e),
        qn.forEach(t),
        bn.forEach(t),
        n = 0;
      n < jt.length;
      n++
    )
      ((r = jt[n]), r.blockedOn === e && (r.blockedOn = null));
    for (; 0 < jt.length && ((n = jt[0]), n.blockedOn === null);)
      (na(n), n.blockedOn === null && jt.shift());
  }
  var gn = b.ReactCurrentBatchConfig,
    Yr = !0;
  function Ff(e, t, n, r) {
    var l = ce,
      o = gn.transition;
    gn.transition = null;
    try {
      ((ce = 1), So(e, t, n, r));
    } finally {
      ((ce = l), (gn.transition = o));
    }
  }
  function Mf(e, t, n, r) {
    var l = ce,
      o = gn.transition;
    gn.transition = null;
    try {
      ((ce = 4), So(e, t, n, r));
    } finally {
      ((ce = l), (gn.transition = o));
    }
  }
  function So(e, t, n, r) {
    if (Yr) {
      var l = ko(e, t, n, r);
      if (l === null) (jo(e, t, r, Gr, n), ta(e, r));
      else if (Df(l, e, t, n, r)) r.stopPropagation();
      else if ((ta(e, r), t & 4 && -1 < If.indexOf(e))) {
        for (; l !== null;) {
          var o = hr(l);
          if (
            (o !== null && Zi(o), (o = ko(e, t, n, r)), o === null && jo(e, t, r, Gr, n), o === l)
          )
            break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else jo(e, t, r, null, n);
    }
  }
  var Gr = null;
  function ko(e, t, n, r) {
    if (((Gr = null), (e = ao(r)), (e = tn(e)), e !== null))
      if (((t = en(e)), t === null)) e = null;
      else if (((n = t.tag), n === 13)) {
        if (((e = Bi(t)), e !== null)) return e;
        e = null;
      } else if (n === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated)
          return t.tag === 3 ? t.stateNode.containerInfo : null;
        e = null;
      } else t !== e && (e = null);
    return ((Gr = e), null);
  }
  function la(e) {
    switch (e) {
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 1;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'toggle':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 4;
      case 'message':
        switch (Cf()) {
          case ho:
            return 1;
          case Yi:
            return 4;
          case Ar:
          case xf:
            return 16;
          case Gi:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var $t = null,
    Eo = null,
    Xr = null;
  function oa() {
    if (Xr) return Xr;
    var e,
      t = Eo,
      n = t.length,
      r,
      l = 'value' in $t ? $t.value : $t.textContent,
      o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++);
    var a = n - e;
    for (r = 1; r <= a && t[n - r] === l[o - r]; r++);
    return (Xr = l.slice(e, 1 < r ? 1 - r : void 0));
  }
  function Jr(e) {
    var t = e.keyCode;
    return (
      'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function Zr() {
    return !0;
  }
  function ua() {
    return !1;
  }
  function qe(e) {
    function t(n, r, l, o, a) {
      ((this._reactName = n),
        (this._targetInst = l),
        (this.type = r),
        (this.nativeEvent = o),
        (this.target = a),
        (this.currentTarget = null));
      for (var d in e) e.hasOwnProperty(d) && ((n = e[d]), (this[d] = n ? n(o) : o[d]));
      return (
        (this.isDefaultPrevented = (
          o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1
        )
          ? Zr
          : ua),
        (this.isPropagationStopped = ua),
        this
      );
    }
    return (
      I(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != 'unknown' && (n.returnValue = !1),
            (this.isDefaultPrevented = Zr));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != 'unknown' && (n.cancelBubble = !0),
            (this.isPropagationStopped = Zr));
        },
        persist: function () {},
        isPersistent: Zr,
      }),
      t
    );
  }
  var wn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Co = qe(wn),
    rr = I({}, wn, { view: 0, detail: 0 }),
    Uf = qe(rr),
    xo,
    Ro,
    lr,
    qr = I({}, rr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Po,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return 'movementX' in e
          ? e.movementX
          : (e !== lr &&
              (lr && e.type === 'mousemove'
                ? ((xo = e.screenX - lr.screenX), (Ro = e.screenY - lr.screenY))
                : (Ro = xo = 0),
              (lr = e)),
            xo);
      },
      movementY: function (e) {
        return 'movementY' in e ? e.movementY : Ro;
      },
    }),
    ia = qe(qr),
    jf = I({}, qr, { dataTransfer: 0 }),
    $f = qe(jf),
    Af = I({}, rr, { relatedTarget: 0 }),
    _o = qe(Af),
    Bf = I({}, wn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Hf = qe(Bf),
    Wf = I({}, wn, {
      clipboardData: function (e) {
        return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
      },
    }),
    Vf = qe(Wf),
    Qf = I({}, wn, { data: 0 }),
    aa = qe(Qf),
    Kf = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    Yf = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    Gf = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function Xf(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Gf[e]) ? !!t[e] : !1;
  }
  function Po() {
    return Xf;
  }
  var Jf = I({}, rr, {
      key: function (e) {
        if (e.key) {
          var t = Kf[e.key] || e.key;
          if (t !== 'Unidentified') return t;
        }
        return e.type === 'keypress'
          ? ((e = Jr(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
          : e.type === 'keydown' || e.type === 'keyup'
            ? Yf[e.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Po,
      charCode: function (e) {
        return e.type === 'keypress' ? Jr(e) : 0;
      },
      keyCode: function (e) {
        return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === 'keypress'
          ? Jr(e)
          : e.type === 'keydown' || e.type === 'keyup'
            ? e.keyCode
            : 0;
      },
    }),
    Zf = qe(Jf),
    qf = I({}, qr, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    sa = qe(qf),
    bf = I({}, rr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Po,
    }),
    ed = qe(bf),
    td = I({}, wn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    nd = qe(td),
    rd = I({}, qr, {
      deltaX: function (e) {
        return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return 'deltaY' in e
          ? e.deltaY
          : 'wheelDeltaY' in e
            ? -e.wheelDeltaY
            : 'wheelDelta' in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    ld = qe(rd),
    od = [9, 13, 27, 32],
    Lo = S && 'CompositionEvent' in window,
    or = null;
  S && 'documentMode' in document && (or = document.documentMode);
  var ud = S && 'TextEvent' in window && !or,
    ca = S && (!Lo || (or && 8 < or && 11 >= or)),
    fa = ' ',
    da = !1;
  function pa(e, t) {
    switch (e) {
      case 'keyup':
        return od.indexOf(t.keyCode) !== -1;
      case 'keydown':
        return t.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function ha(e) {
    return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
  }
  var Sn = !1;
  function id(e, t) {
    switch (e) {
      case 'compositionend':
        return ha(t);
      case 'keypress':
        return t.which !== 32 ? null : ((da = !0), fa);
      case 'textInput':
        return ((e = t.data), e === fa && da ? null : e);
      default:
        return null;
    }
  }
  function ad(e, t) {
    if (Sn)
      return e === 'compositionend' || (!Lo && pa(e, t))
        ? ((e = oa()), (Xr = Eo = $t = null), (Sn = !1), e)
        : null;
    switch (e) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case 'compositionend':
        return ca && t.locale !== 'ko' ? null : t.data;
      default:
        return null;
    }
  }
  var sd = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function ma(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === 'input' ? !!sd[e.type] : t === 'textarea';
  }
  function va(e, t, n, r) {
    (Mi(r),
      (t = rl(t, 'onChange')),
      0 < t.length &&
        ((n = new Co('onChange', 'change', null, n, r)), e.push({ event: n, listeners: t })));
  }
  var ur = null,
    ir = null;
  function cd(e) {
    Oa(e, 0);
  }
  function br(e) {
    var t = Rn(e);
    if (xi(t)) return e;
  }
  function fd(e, t) {
    if (e === 'change') return t;
  }
  var ya = !1;
  if (S) {
    var No;
    if (S) {
      var To = 'oninput' in document;
      if (!To) {
        var ga = document.createElement('div');
        (ga.setAttribute('oninput', 'return;'), (To = typeof ga.oninput == 'function'));
      }
      No = To;
    } else No = !1;
    ya = No && (!document.documentMode || 9 < document.documentMode);
  }
  function wa() {
    ur && (ur.detachEvent('onpropertychange', Sa), (ir = ur = null));
  }
  function Sa(e) {
    if (e.propertyName === 'value' && br(ir)) {
      var t = [];
      (va(t, ir, e, ao(e)), Ai(cd, t));
    }
  }
  function dd(e, t, n) {
    e === 'focusin'
      ? (wa(), (ur = t), (ir = n), ur.attachEvent('onpropertychange', Sa))
      : e === 'focusout' && wa();
  }
  function pd(e) {
    if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return br(ir);
  }
  function hd(e, t) {
    if (e === 'click') return br(t);
  }
  function md(e, t) {
    if (e === 'input' || e === 'change') return br(t);
  }
  function vd(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var dt = typeof Object.is == 'function' ? Object.is : vd;
  function ar(e, t) {
    if (dt(e, t)) return !0;
    if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
    var n = Object.keys(e),
      r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!y.call(t, l) || !dt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ka(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }
  function Ea(e, t) {
    var n = ka(e);
    e = 0;
    for (var r; n;) {
      if (n.nodeType === 3) {
        if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n;) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = ka(n);
    }
  }
  function Ca(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Ca(e, t.parentNode)
            : 'contains' in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function xa() {
    for (var e = window, t = Mr(); t instanceof e.HTMLIFrameElement;) {
      try {
        var n = typeof t.contentWindow.location.href == 'string';
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Mr(e.document);
    }
    return t;
  }
  function zo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === 'input' &&
        (e.type === 'text' ||
          e.type === 'search' ||
          e.type === 'tel' ||
          e.type === 'url' ||
          e.type === 'password')) ||
        t === 'textarea' ||
        e.contentEditable === 'true')
    );
  }
  function yd(e) {
    var t = xa(),
      n = e.focusedElem,
      r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Ca(n.ownerDocument.documentElement, n)) {
      if (r !== null && zo(n)) {
        if (((t = r.start), (e = r.end), e === void 0 && (e = t), 'selectionStart' in n))
          ((n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length)));
        else if (
          ((e = ((t = n.ownerDocument || document) && t.defaultView) || window), e.getSelection)
        ) {
          e = e.getSelection();
          var l = n.textContent.length,
            o = Math.min(r.start, l);
          ((r = r.end === void 0 ? o : Math.min(r.end, l)),
            !e.extend && o > r && ((l = r), (r = o), (o = l)),
            (l = Ea(n, o)));
          var a = Ea(n, r);
          l &&
            a &&
            (e.rangeCount !== 1 ||
              e.anchorNode !== l.node ||
              e.anchorOffset !== l.offset ||
              e.focusNode !== a.node ||
              e.focusOffset !== a.offset) &&
            ((t = t.createRange()),
            t.setStart(l.node, l.offset),
            e.removeAllRanges(),
            o > r
              ? (e.addRange(t), e.extend(a.node, a.offset))
              : (t.setEnd(a.node, a.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; (e = e.parentNode);)
        e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == 'function' && n.focus(), n = 0; n < t.length; n++)
        ((e = t[n]), (e.element.scrollLeft = e.left), (e.element.scrollTop = e.top));
    }
  }
  var gd = S && 'documentMode' in document && 11 >= document.documentMode,
    kn = null,
    Io = null,
    sr = null,
    Do = !1;
  function Ra(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Do ||
      kn == null ||
      kn !== Mr(r) ||
      ((r = kn),
      'selectionStart' in r && zo(r)
        ? (r = { start: r.selectionStart, end: r.selectionEnd })
        : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
          (r = {
            anchorNode: r.anchorNode,
            anchorOffset: r.anchorOffset,
            focusNode: r.focusNode,
            focusOffset: r.focusOffset,
          })),
      (sr && ar(sr, r)) ||
        ((sr = r),
        (r = rl(Io, 'onSelect')),
        0 < r.length &&
          ((t = new Co('onSelect', 'select', null, t, n)),
          e.push({ event: t, listeners: r }),
          (t.target = kn))));
  }
  function el(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n['Webkit' + e] = 'webkit' + t),
      (n['Moz' + e] = 'moz' + t),
      n
    );
  }
  var En = {
      animationend: el('Animation', 'AnimationEnd'),
      animationiteration: el('Animation', 'AnimationIteration'),
      animationstart: el('Animation', 'AnimationStart'),
      transitionend: el('Transition', 'TransitionEnd'),
    },
    Oo = {},
    _a = {};
  S &&
    ((_a = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete En.animationend.animation,
      delete En.animationiteration.animation,
      delete En.animationstart.animation),
    'TransitionEvent' in window || delete En.transitionend.transition);
  function tl(e) {
    if (Oo[e]) return Oo[e];
    if (!En[e]) return e;
    var t = En[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in _a) return (Oo[e] = t[n]);
    return e;
  }
  var Pa = tl('animationend'),
    La = tl('animationiteration'),
    Na = tl('animationstart'),
    Ta = tl('transitionend'),
    za = new Map(),
    Ia =
      'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' ',
      );
  function At(e, t) {
    (za.set(e, t), p(t, [e]));
  }
  for (var Fo = 0; Fo < Ia.length; Fo++) {
    var Mo = Ia[Fo],
      wd = Mo.toLowerCase(),
      Sd = Mo[0].toUpperCase() + Mo.slice(1);
    At(wd, 'on' + Sd);
  }
  (At(Pa, 'onAnimationEnd'),
    At(La, 'onAnimationIteration'),
    At(Na, 'onAnimationStart'),
    At('dblclick', 'onDoubleClick'),
    At('focusin', 'onFocus'),
    At('focusout', 'onBlur'),
    At(Ta, 'onTransitionEnd'),
    g('onMouseEnter', ['mouseout', 'mouseover']),
    g('onMouseLeave', ['mouseout', 'mouseover']),
    g('onPointerEnter', ['pointerout', 'pointerover']),
    g('onPointerLeave', ['pointerout', 'pointerover']),
    p('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    p(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    ),
    p('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    p('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    p(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    ),
    p(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    ));
  var cr =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' ',
      ),
    kd = new Set('cancel close invalid load scroll toggle'.split(' ').concat(cr));
  function Da(e, t, n) {
    var r = e.type || 'unknown-event';
    ((e.currentTarget = n), wf(r, t, void 0, e), (e.currentTarget = null));
  }
  function Oa(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n],
        l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t)
          for (var a = r.length - 1; 0 <= a; a--) {
            var d = r[a],
              h = d.instance,
              x = d.currentTarget;
            if (((d = d.listener), h !== o && l.isPropagationStopped())) break e;
            (Da(l, d, x), (o = h));
          }
        else
          for (a = 0; a < r.length; a++) {
            if (
              ((d = r[a]),
              (h = d.instance),
              (x = d.currentTarget),
              (d = d.listener),
              h !== o && l.isPropagationStopped())
            )
              break e;
            (Da(l, d, x), (o = h));
          }
      }
    }
    if ($r) throw ((e = po), ($r = !1), (po = null), e);
  }
  function he(e, t) {
    var n = t[Vo];
    n === void 0 && (n = t[Vo] = new Set());
    var r = e + '__bubble';
    n.has(r) || (Fa(t, e, 2, !1), n.add(r));
  }
  function Uo(e, t, n) {
    var r = 0;
    (t && (r |= 4), Fa(n, e, r, t));
  }
  var nl = '_reactListening' + Math.random().toString(36).slice(2);
  function fr(e) {
    if (!e[nl]) {
      ((e[nl] = !0),
        c.forEach(function (n) {
          n !== 'selectionchange' && (kd.has(n) || Uo(n, !1, e), Uo(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[nl] || ((t[nl] = !0), Uo('selectionchange', !1, t));
    }
  }
  function Fa(e, t, n, r) {
    switch (la(t)) {
      case 1:
        var l = Ff;
        break;
      case 4:
        l = Mf;
        break;
      default:
        l = So;
    }
    ((n = l.bind(null, t, n, e)),
      (l = void 0),
      !fo || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (l = !0),
      r
        ? l !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: l })
          : e.addEventListener(t, n, !0)
        : l !== void 0
          ? e.addEventListener(t, n, { passive: l })
          : e.addEventListener(t, n, !1));
  }
  function jo(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
      e: for (;;) {
        if (r === null) return;
        var a = r.tag;
        if (a === 3 || a === 4) {
          var d = r.stateNode.containerInfo;
          if (d === l || (d.nodeType === 8 && d.parentNode === l)) break;
          if (a === 4)
            for (a = r.return; a !== null;) {
              var h = a.tag;
              if (
                (h === 3 || h === 4) &&
                ((h = a.stateNode.containerInfo),
                h === l || (h.nodeType === 8 && h.parentNode === l))
              )
                return;
              a = a.return;
            }
          for (; d !== null;) {
            if (((a = tn(d)), a === null)) return;
            if (((h = a.tag), h === 5 || h === 6)) {
              r = o = a;
              continue e;
            }
            d = d.parentNode;
          }
        }
        r = r.return;
      }
    Ai(function () {
      var x = o,
        O = ao(n),
        F = [];
      e: {
        var D = za.get(e);
        if (D !== void 0) {
          var H = Co,
            Q = e;
          switch (e) {
            case 'keypress':
              if (Jr(n) === 0) break e;
            case 'keydown':
            case 'keyup':
              H = Zf;
              break;
            case 'focusin':
              ((Q = 'focus'), (H = _o));
              break;
            case 'focusout':
              ((Q = 'blur'), (H = _o));
              break;
            case 'beforeblur':
            case 'afterblur':
              H = _o;
              break;
            case 'click':
              if (n.button === 2) break e;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              H = ia;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              H = $f;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              H = ed;
              break;
            case Pa:
            case La:
            case Na:
              H = Hf;
              break;
            case Ta:
              H = nd;
              break;
            case 'scroll':
              H = Uf;
              break;
            case 'wheel':
              H = ld;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              H = Vf;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              H = sa;
          }
          var K = (t & 4) !== 0,
            Re = !K && e === 'scroll',
            w = K ? (D !== null ? D + 'Capture' : null) : D;
          K = [];
          for (var m = x, k; m !== null;) {
            k = m;
            var $ = k.stateNode;
            if (
              (k.tag === 5 &&
                $ !== null &&
                ((k = $), w !== null && (($ = Yn(m, w)), $ != null && K.push(dr(m, $, k)))),
              Re)
            )
              break;
            m = m.return;
          }
          0 < K.length && ((D = new H(D, Q, null, n, O)), F.push({ event: D, listeners: K }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((D = e === 'mouseover' || e === 'pointerover'),
            (H = e === 'mouseout' || e === 'pointerout'),
            D && n !== io && (Q = n.relatedTarget || n.fromElement) && (tn(Q) || Q[_t]))
          )
            break e;
          if (
            (H || D) &&
            ((D =
              O.window === O
                ? O
                : (D = O.ownerDocument)
                  ? D.defaultView || D.parentWindow
                  : window),
            H
              ? ((Q = n.relatedTarget || n.toElement),
                (H = x),
                (Q = Q ? tn(Q) : null),
                Q !== null &&
                  ((Re = en(Q)), Q !== Re || (Q.tag !== 5 && Q.tag !== 6)) &&
                  (Q = null))
              : ((H = null), (Q = x)),
            H !== Q)
          ) {
            if (
              ((K = ia),
              ($ = 'onMouseLeave'),
              (w = 'onMouseEnter'),
              (m = 'mouse'),
              (e === 'pointerout' || e === 'pointerover') &&
                ((K = sa), ($ = 'onPointerLeave'), (w = 'onPointerEnter'), (m = 'pointer')),
              (Re = H == null ? D : Rn(H)),
              (k = Q == null ? D : Rn(Q)),
              (D = new K($, m + 'leave', H, n, O)),
              (D.target = Re),
              (D.relatedTarget = k),
              ($ = null),
              tn(O) === x &&
                ((K = new K(w, m + 'enter', Q, n, O)),
                (K.target = k),
                (K.relatedTarget = Re),
                ($ = K)),
              (Re = $),
              H && Q)
            )
              t: {
                for (K = H, w = Q, m = 0, k = K; k; k = Cn(k)) m++;
                for (k = 0, $ = w; $; $ = Cn($)) k++;
                for (; 0 < m - k;) ((K = Cn(K)), m--);
                for (; 0 < k - m;) ((w = Cn(w)), k--);
                for (; m--;) {
                  if (K === w || (w !== null && K === w.alternate)) break t;
                  ((K = Cn(K)), (w = Cn(w)));
                }
                K = null;
              }
            else K = null;
            (H !== null && Ma(F, D, H, K, !1), Q !== null && Re !== null && Ma(F, Re, Q, K, !0));
          }
        }
        e: {
          if (
            ((D = x ? Rn(x) : window),
            (H = D.nodeName && D.nodeName.toLowerCase()),
            H === 'select' || (H === 'input' && D.type === 'file'))
          )
            var Y = fd;
          else if (ma(D))
            if (ya) Y = md;
            else {
              Y = pd;
              var G = dd;
            }
          else
            (H = D.nodeName) &&
              H.toLowerCase() === 'input' &&
              (D.type === 'checkbox' || D.type === 'radio') &&
              (Y = hd);
          if (Y && (Y = Y(e, x))) {
            va(F, Y, n, O);
            break e;
          }
          (G && G(e, D, x),
            e === 'focusout' &&
              (G = D._wrapperState) &&
              G.controlled &&
              D.type === 'number' &&
              no(D, 'number', D.value));
        }
        switch (((G = x ? Rn(x) : window), e)) {
          case 'focusin':
            (ma(G) || G.contentEditable === 'true') && ((kn = G), (Io = x), (sr = null));
            break;
          case 'focusout':
            sr = Io = kn = null;
            break;
          case 'mousedown':
            Do = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((Do = !1), Ra(F, n, O));
            break;
          case 'selectionchange':
            if (gd) break;
          case 'keydown':
          case 'keyup':
            Ra(F, n, O);
        }
        var X;
        if (Lo)
          e: {
            switch (e) {
              case 'compositionstart':
                var J = 'onCompositionStart';
                break e;
              case 'compositionend':
                J = 'onCompositionEnd';
                break e;
              case 'compositionupdate':
                J = 'onCompositionUpdate';
                break e;
            }
            J = void 0;
          }
        else
          Sn
            ? pa(e, n) && (J = 'onCompositionEnd')
            : e === 'keydown' && n.keyCode === 229 && (J = 'onCompositionStart');
        (J &&
          (ca &&
            n.locale !== 'ko' &&
            (Sn || J !== 'onCompositionStart'
              ? J === 'onCompositionEnd' && Sn && (X = oa())
              : (($t = O), (Eo = 'value' in $t ? $t.value : $t.textContent), (Sn = !0))),
          (G = rl(x, J)),
          0 < G.length &&
            ((J = new aa(J, e, null, n, O)),
            F.push({ event: J, listeners: G }),
            X ? (J.data = X) : ((X = ha(n)), X !== null && (J.data = X)))),
          (X = ud ? id(e, n) : ad(e, n)) &&
            ((x = rl(x, 'onBeforeInput')),
            0 < x.length &&
              ((O = new aa('onBeforeInput', 'beforeinput', null, n, O)),
              F.push({ event: O, listeners: x }),
              (O.data = X))));
      }
      Oa(F, t);
    });
  }
  function dr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function rl(e, t) {
    for (var n = t + 'Capture', r = []; e !== null;) {
      var l = e,
        o = l.stateNode;
      (l.tag === 5 &&
        o !== null &&
        ((l = o),
        (o = Yn(e, n)),
        o != null && r.unshift(dr(e, o, l)),
        (o = Yn(e, t)),
        o != null && r.push(dr(e, o, l))),
        (e = e.return));
    }
    return r;
  }
  function Cn(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Ma(e, t, n, r, l) {
    for (var o = t._reactName, a = []; n !== null && n !== r;) {
      var d = n,
        h = d.alternate,
        x = d.stateNode;
      if (h !== null && h === r) break;
      (d.tag === 5 &&
        x !== null &&
        ((d = x),
        l
          ? ((h = Yn(n, o)), h != null && a.unshift(dr(n, h, d)))
          : l || ((h = Yn(n, o)), h != null && a.push(dr(n, h, d)))),
        (n = n.return));
    }
    a.length !== 0 && e.push({ event: t, listeners: a });
  }
  var Ed = /\r\n?/g,
    Cd = /\u0000|\uFFFD/g;
  function Ua(e) {
    return (typeof e == 'string' ? e : '' + e)
      .replace(
        Ed,
        `
`,
      )
      .replace(Cd, '');
  }
  function ll(e, t, n) {
    if (((t = Ua(t)), Ua(e) !== t && n)) throw Error(i(425));
  }
  function ol() {}
  var $o = null,
    Ao = null;
  function Bo(e, t) {
    return (
      e === 'textarea' ||
      e === 'noscript' ||
      typeof t.children == 'string' ||
      typeof t.children == 'number' ||
      (typeof t.dangerouslySetInnerHTML == 'object' &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Ho = typeof setTimeout == 'function' ? setTimeout : void 0,
    xd = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    ja = typeof Promise == 'function' ? Promise : void 0,
    Rd =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof ja < 'u'
          ? function (e) {
              return ja.resolve(null).then(e).catch(_d);
            }
          : Ho;
  function _d(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Wo(e, t) {
    var n = t,
      r = 0;
    do {
      var l = n.nextSibling;
      if ((e.removeChild(n), l && l.nodeType === 8))
        if (((n = l.data), n === '/$')) {
          if (r === 0) {
            (e.removeChild(l), nr(t));
            return;
          }
          r--;
        } else (n !== '$' && n !== '$?' && n !== '$!') || r++;
      n = l;
    } while (n);
    nr(t);
  }
  function Bt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (((t = e.data), t === '$' || t === '$!' || t === '$?')) break;
        if (t === '/$') return null;
      }
    }
    return e;
  }
  function $a(e) {
    e = e.previousSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === '$' || n === '$!' || n === '$?') {
          if (t === 0) return e;
          t--;
        } else n === '/$' && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var xn = Math.random().toString(36).slice(2),
    Et = '__reactFiber$' + xn,
    pr = '__reactProps$' + xn,
    _t = '__reactContainer$' + xn,
    Vo = '__reactEvents$' + xn,
    Pd = '__reactListeners$' + xn,
    Ld = '__reactHandles$' + xn;
  function tn(e) {
    var t = e[Et];
    if (t) return t;
    for (var n = e.parentNode; n;) {
      if ((t = n[_t] || n[Et])) {
        if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
          for (e = $a(e); e !== null;) {
            if ((n = e[Et])) return n;
            e = $a(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function hr(e) {
    return (
      (e = e[Et] || e[_t]),
      !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
    );
  }
  function Rn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(i(33));
  }
  function ul(e) {
    return e[pr] || null;
  }
  var Qo = [],
    _n = -1;
  function Ht(e) {
    return { current: e };
  }
  function me(e) {
    0 > _n || ((e.current = Qo[_n]), (Qo[_n] = null), _n--);
  }
  function pe(e, t) {
    (_n++, (Qo[_n] = e.current), (e.current = t));
  }
  var Wt = {},
    $e = Ht(Wt),
    Qe = Ht(!1),
    nn = Wt;
  function Pn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Wt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
      return r.__reactInternalMemoizedMaskedChildContext;
    var l = {},
      o;
    for (o in n) l[o] = t[o];
    return (
      r &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = t),
        (e.__reactInternalMemoizedMaskedChildContext = l)),
      l
    );
  }
  function Ke(e) {
    return ((e = e.childContextTypes), e != null);
  }
  function il() {
    (me(Qe), me($e));
  }
  function Aa(e, t, n) {
    if ($e.current !== Wt) throw Error(i(168));
    (pe($e, t), pe(Qe, n));
  }
  function Ba(e, t, n) {
    var r = e.stateNode;
    if (((t = t.childContextTypes), typeof r.getChildContext != 'function')) return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(i(108, ae(e) || 'Unknown', l));
    return I({}, n, r);
  }
  function al(e) {
    return (
      (e = ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Wt),
      (nn = $e.current),
      pe($e, e),
      pe(Qe, Qe.current),
      !0
    );
  }
  function Ha(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(i(169));
    (n
      ? ((e = Ba(e, t, nn)),
        (r.__reactInternalMemoizedMergedChildContext = e),
        me(Qe),
        me($e),
        pe($e, e))
      : me(Qe),
      pe(Qe, n));
  }
  var Pt = null,
    sl = !1,
    Ko = !1;
  function Wa(e) {
    Pt === null ? (Pt = [e]) : Pt.push(e);
  }
  function Nd(e) {
    ((sl = !0), Wa(e));
  }
  function Vt() {
    if (!Ko && Pt !== null) {
      Ko = !0;
      var e = 0,
        t = ce;
      try {
        var n = Pt;
        for (ce = 1; e < n.length; e++) {
          var r = n[e];
          do r = r(!0);
          while (r !== null);
        }
        ((Pt = null), (sl = !1));
      } catch (l) {
        throw (Pt !== null && (Pt = Pt.slice(e + 1)), Qi(ho, Vt), l);
      } finally {
        ((ce = t), (Ko = !1));
      }
    }
    return null;
  }
  var Ln = [],
    Nn = 0,
    cl = null,
    fl = 0,
    lt = [],
    ot = 0,
    rn = null,
    Lt = 1,
    Nt = '';
  function ln(e, t) {
    ((Ln[Nn++] = fl), (Ln[Nn++] = cl), (cl = e), (fl = t));
  }
  function Va(e, t, n) {
    ((lt[ot++] = Lt), (lt[ot++] = Nt), (lt[ot++] = rn), (rn = e));
    var r = Lt;
    e = Nt;
    var l = 32 - ft(r) - 1;
    ((r &= ~(1 << l)), (n += 1));
    var o = 32 - ft(t) + l;
    if (30 < o) {
      var a = l - (l % 5);
      ((o = (r & ((1 << a) - 1)).toString(32)),
        (r >>= a),
        (l -= a),
        (Lt = (1 << (32 - ft(t) + l)) | (n << l) | r),
        (Nt = o + e));
    } else ((Lt = (1 << o) | (n << l) | r), (Nt = e));
  }
  function Yo(e) {
    e.return !== null && (ln(e, 1), Va(e, 1, 0));
  }
  function Go(e) {
    for (; e === cl;) ((cl = Ln[--Nn]), (Ln[Nn] = null), (fl = Ln[--Nn]), (Ln[Nn] = null));
    for (; e === rn;)
      ((rn = lt[--ot]),
        (lt[ot] = null),
        (Nt = lt[--ot]),
        (lt[ot] = null),
        (Lt = lt[--ot]),
        (lt[ot] = null));
  }
  var be = null,
    et = null,
    ye = !1,
    pt = null;
  function Qa(e, t) {
    var n = st(5, null, null, 0);
    ((n.elementType = 'DELETED'),
      (n.stateNode = t),
      (n.return = e),
      (t = e.deletions),
      t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
  }
  function Ka(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return (
          (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t),
          t !== null ? ((e.stateNode = t), (be = e), (et = Bt(t.firstChild)), !0) : !1
        );
      case 6:
        return (
          (t = e.pendingProps === '' || t.nodeType !== 3 ? null : t),
          t !== null ? ((e.stateNode = t), (be = e), (et = null), !0) : !1
        );
      case 13:
        return (
          (t = t.nodeType !== 8 ? null : t),
          t !== null
            ? ((n = rn !== null ? { id: Lt, overflow: Nt } : null),
              (e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }),
              (n = st(18, null, null, 0)),
              (n.stateNode = t),
              (n.return = e),
              (e.child = n),
              (be = e),
              (et = null),
              !0)
            : !1
        );
      default:
        return !1;
    }
  }
  function Xo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Jo(e) {
    if (ye) {
      var t = et;
      if (t) {
        var n = t;
        if (!Ka(e, t)) {
          if (Xo(e)) throw Error(i(418));
          t = Bt(n.nextSibling);
          var r = be;
          t && Ka(e, t) ? Qa(r, n) : ((e.flags = (e.flags & -4097) | 2), (ye = !1), (be = e));
        }
      } else {
        if (Xo(e)) throw Error(i(418));
        ((e.flags = (e.flags & -4097) | 2), (ye = !1), (be = e));
      }
    }
  }
  function Ya(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) e = e.return;
    be = e;
  }
  function dl(e) {
    if (e !== be) return !1;
    if (!ye) return (Ya(e), (ye = !0), !1);
    var t;
    if (
      ((t = e.tag !== 3) &&
        !(t = e.tag !== 5) &&
        ((t = e.type), (t = t !== 'head' && t !== 'body' && !Bo(e.type, e.memoizedProps))),
      t && (t = et))
    ) {
      if (Xo(e)) throw (Ga(), Error(i(418)));
      for (; t;) (Qa(e, t), (t = Bt(t.nextSibling)));
    }
    if ((Ya(e), e.tag === 13)) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(i(317));
      e: {
        for (e = e.nextSibling, t = 0; e;) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === '/$') {
              if (t === 0) {
                et = Bt(e.nextSibling);
                break e;
              }
              t--;
            } else (n !== '$' && n !== '$!' && n !== '$?') || t++;
          }
          e = e.nextSibling;
        }
        et = null;
      }
    } else et = be ? Bt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ga() {
    for (var e = et; e;) e = Bt(e.nextSibling);
  }
  function Tn() {
    ((et = be = null), (ye = !1));
  }
  function Zo(e) {
    pt === null ? (pt = [e]) : pt.push(e);
  }
  var Td = b.ReactCurrentBatchConfig;
  function mr(e, t, n) {
    if (((e = n.ref), e !== null && typeof e != 'function' && typeof e != 'object')) {
      if (n._owner) {
        if (((n = n._owner), n)) {
          if (n.tag !== 1) throw Error(i(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(i(147, e));
        var l = r,
          o = '' + e;
        return t !== null && t.ref !== null && typeof t.ref == 'function' && t.ref._stringRef === o
          ? t.ref
          : ((t = function (a) {
              var d = l.refs;
              a === null ? delete d[o] : (d[o] = a);
            }),
            (t._stringRef = o),
            t);
      }
      if (typeof e != 'string') throw Error(i(284));
      if (!n._owner) throw Error(i(290, e));
    }
    return e;
  }
  function pl(e, t) {
    throw (
      (e = Object.prototype.toString.call(t)),
      Error(
        i(31, e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e),
      )
    );
  }
  function Xa(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Ja(e) {
    function t(w, m) {
      if (e) {
        var k = w.deletions;
        k === null ? ((w.deletions = [m]), (w.flags |= 16)) : k.push(m);
      }
    }
    function n(w, m) {
      if (!e) return null;
      for (; m !== null;) (t(w, m), (m = m.sibling));
      return null;
    }
    function r(w, m) {
      for (w = new Map(); m !== null;)
        (m.key !== null ? w.set(m.key, m) : w.set(m.index, m), (m = m.sibling));
      return w;
    }
    function l(w, m) {
      return ((w = qt(w, m)), (w.index = 0), (w.sibling = null), w);
    }
    function o(w, m, k) {
      return (
        (w.index = k),
        e
          ? ((k = w.alternate),
            k !== null ? ((k = k.index), k < m ? ((w.flags |= 2), m) : k) : ((w.flags |= 2), m))
          : ((w.flags |= 1048576), m)
      );
    }
    function a(w) {
      return (e && w.alternate === null && (w.flags |= 2), w);
    }
    function d(w, m, k, $) {
      return m === null || m.tag !== 6
        ? ((m = Hu(k, w.mode, $)), (m.return = w), m)
        : ((m = l(m, k)), (m.return = w), m);
    }
    function h(w, m, k, $) {
      var Y = k.type;
      return Y === oe
        ? O(w, m, k.props.children, $, k.key)
        : m !== null &&
            (m.elementType === Y ||
              (typeof Y == 'object' && Y !== null && Y.$$typeof === Ne && Xa(Y) === m.type))
          ? (($ = l(m, k.props)), ($.ref = mr(w, m, k)), ($.return = w), $)
          : (($ = Ul(k.type, k.key, k.props, null, w.mode, $)),
            ($.ref = mr(w, m, k)),
            ($.return = w),
            $);
    }
    function x(w, m, k, $) {
      return m === null ||
        m.tag !== 4 ||
        m.stateNode.containerInfo !== k.containerInfo ||
        m.stateNode.implementation !== k.implementation
        ? ((m = Wu(k, w.mode, $)), (m.return = w), m)
        : ((m = l(m, k.children || [])), (m.return = w), m);
    }
    function O(w, m, k, $, Y) {
      return m === null || m.tag !== 7
        ? ((m = pn(k, w.mode, $, Y)), (m.return = w), m)
        : ((m = l(m, k)), (m.return = w), m);
    }
    function F(w, m, k) {
      if ((typeof m == 'string' && m !== '') || typeof m == 'number')
        return ((m = Hu('' + m, w.mode, k)), (m.return = w), m);
      if (typeof m == 'object' && m !== null) {
        switch (m.$$typeof) {
          case ne:
            return (
              (k = Ul(m.type, m.key, m.props, null, w.mode, k)),
              (k.ref = mr(w, null, m)),
              (k.return = w),
              k
            );
          case ee:
            return ((m = Wu(m, w.mode, k)), (m.return = w), m);
          case Ne:
            var $ = m._init;
            return F(w, $(m._payload), k);
        }
        if (Vn(m) || U(m)) return ((m = pn(m, w.mode, k, null)), (m.return = w), m);
        pl(w, m);
      }
      return null;
    }
    function D(w, m, k, $) {
      var Y = m !== null ? m.key : null;
      if ((typeof k == 'string' && k !== '') || typeof k == 'number')
        return Y !== null ? null : d(w, m, '' + k, $);
      if (typeof k == 'object' && k !== null) {
        switch (k.$$typeof) {
          case ne:
            return k.key === Y ? h(w, m, k, $) : null;
          case ee:
            return k.key === Y ? x(w, m, k, $) : null;
          case Ne:
            return ((Y = k._init), D(w, m, Y(k._payload), $));
        }
        if (Vn(k) || U(k)) return Y !== null ? null : O(w, m, k, $, null);
        pl(w, k);
      }
      return null;
    }
    function H(w, m, k, $, Y) {
      if ((typeof $ == 'string' && $ !== '') || typeof $ == 'number')
        return ((w = w.get(k) || null), d(m, w, '' + $, Y));
      if (typeof $ == 'object' && $ !== null) {
        switch ($.$$typeof) {
          case ne:
            return ((w = w.get($.key === null ? k : $.key) || null), h(m, w, $, Y));
          case ee:
            return ((w = w.get($.key === null ? k : $.key) || null), x(m, w, $, Y));
          case Ne:
            var G = $._init;
            return H(w, m, k, G($._payload), Y);
        }
        if (Vn($) || U($)) return ((w = w.get(k) || null), O(m, w, $, Y, null));
        pl(m, $);
      }
      return null;
    }
    function Q(w, m, k, $) {
      for (var Y = null, G = null, X = m, J = (m = 0), Ie = null; X !== null && J < k.length; J++) {
        X.index > J ? ((Ie = X), (X = null)) : (Ie = X.sibling);
        var ie = D(w, X, k[J], $);
        if (ie === null) {
          X === null && (X = Ie);
          break;
        }
        (e && X && ie.alternate === null && t(w, X),
          (m = o(ie, m, J)),
          G === null ? (Y = ie) : (G.sibling = ie),
          (G = ie),
          (X = Ie));
      }
      if (J === k.length) return (n(w, X), ye && ln(w, J), Y);
      if (X === null) {
        for (; J < k.length; J++)
          ((X = F(w, k[J], $)),
            X !== null && ((m = o(X, m, J)), G === null ? (Y = X) : (G.sibling = X), (G = X)));
        return (ye && ln(w, J), Y);
      }
      for (X = r(w, X); J < k.length; J++)
        ((Ie = H(X, w, J, k[J], $)),
          Ie !== null &&
            (e && Ie.alternate !== null && X.delete(Ie.key === null ? J : Ie.key),
            (m = o(Ie, m, J)),
            G === null ? (Y = Ie) : (G.sibling = Ie),
            (G = Ie)));
      return (
        e &&
          X.forEach(function (bt) {
            return t(w, bt);
          }),
        ye && ln(w, J),
        Y
      );
    }
    function K(w, m, k, $) {
      var Y = U(k);
      if (typeof Y != 'function') throw Error(i(150));
      if (((k = Y.call(k)), k == null)) throw Error(i(151));
      for (
        var G = (Y = null), X = m, J = (m = 0), Ie = null, ie = k.next();
        X !== null && !ie.done;
        J++, ie = k.next()
      ) {
        X.index > J ? ((Ie = X), (X = null)) : (Ie = X.sibling);
        var bt = D(w, X, ie.value, $);
        if (bt === null) {
          X === null && (X = Ie);
          break;
        }
        (e && X && bt.alternate === null && t(w, X),
          (m = o(bt, m, J)),
          G === null ? (Y = bt) : (G.sibling = bt),
          (G = bt),
          (X = Ie));
      }
      if (ie.done) return (n(w, X), ye && ln(w, J), Y);
      if (X === null) {
        for (; !ie.done; J++, ie = k.next())
          ((ie = F(w, ie.value, $)),
            ie !== null && ((m = o(ie, m, J)), G === null ? (Y = ie) : (G.sibling = ie), (G = ie)));
        return (ye && ln(w, J), Y);
      }
      for (X = r(w, X); !ie.done; J++, ie = k.next())
        ((ie = H(X, w, J, ie.value, $)),
          ie !== null &&
            (e && ie.alternate !== null && X.delete(ie.key === null ? J : ie.key),
            (m = o(ie, m, J)),
            G === null ? (Y = ie) : (G.sibling = ie),
            (G = ie)));
      return (
        e &&
          X.forEach(function (sp) {
            return t(w, sp);
          }),
        ye && ln(w, J),
        Y
      );
    }
    function Re(w, m, k, $) {
      if (
        (typeof k == 'object' &&
          k !== null &&
          k.type === oe &&
          k.key === null &&
          (k = k.props.children),
        typeof k == 'object' && k !== null)
      ) {
        switch (k.$$typeof) {
          case ne:
            e: {
              for (var Y = k.key, G = m; G !== null;) {
                if (G.key === Y) {
                  if (((Y = k.type), Y === oe)) {
                    if (G.tag === 7) {
                      (n(w, G.sibling), (m = l(G, k.props.children)), (m.return = w), (w = m));
                      break e;
                    }
                  } else if (
                    G.elementType === Y ||
                    (typeof Y == 'object' && Y !== null && Y.$$typeof === Ne && Xa(Y) === G.type)
                  ) {
                    (n(w, G.sibling),
                      (m = l(G, k.props)),
                      (m.ref = mr(w, G, k)),
                      (m.return = w),
                      (w = m));
                    break e;
                  }
                  n(w, G);
                  break;
                } else t(w, G);
                G = G.sibling;
              }
              k.type === oe
                ? ((m = pn(k.props.children, w.mode, $, k.key)), (m.return = w), (w = m))
                : (($ = Ul(k.type, k.key, k.props, null, w.mode, $)),
                  ($.ref = mr(w, m, k)),
                  ($.return = w),
                  (w = $));
            }
            return a(w);
          case ee:
            e: {
              for (G = k.key; m !== null;) {
                if (m.key === G)
                  if (
                    m.tag === 4 &&
                    m.stateNode.containerInfo === k.containerInfo &&
                    m.stateNode.implementation === k.implementation
                  ) {
                    (n(w, m.sibling), (m = l(m, k.children || [])), (m.return = w), (w = m));
                    break e;
                  } else {
                    n(w, m);
                    break;
                  }
                else t(w, m);
                m = m.sibling;
              }
              ((m = Wu(k, w.mode, $)), (m.return = w), (w = m));
            }
            return a(w);
          case Ne:
            return ((G = k._init), Re(w, m, G(k._payload), $));
        }
        if (Vn(k)) return Q(w, m, k, $);
        if (U(k)) return K(w, m, k, $);
        pl(w, k);
      }
      return (typeof k == 'string' && k !== '') || typeof k == 'number'
        ? ((k = '' + k),
          m !== null && m.tag === 6
            ? (n(w, m.sibling), (m = l(m, k)), (m.return = w), (w = m))
            : (n(w, m), (m = Hu(k, w.mode, $)), (m.return = w), (w = m)),
          a(w))
        : n(w, m);
    }
    return Re;
  }
  var zn = Ja(!0),
    Za = Ja(!1),
    hl = Ht(null),
    ml = null,
    In = null,
    qo = null;
  function bo() {
    qo = In = ml = null;
  }
  function eu(e) {
    var t = hl.current;
    (me(hl), (e._currentValue = t));
  }
  function tu(e, t, n) {
    for (; e !== null;) {
      var r = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
          : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function Dn(e, t) {
    ((ml = e),
      (qo = In = null),
      (e = e.dependencies),
      e !== null &&
        e.firstContext !== null &&
        ((e.lanes & t) !== 0 && (Ye = !0), (e.firstContext = null)));
  }
  function ut(e) {
    var t = e._currentValue;
    if (qo !== e)
      if (((e = { context: e, memoizedValue: t, next: null }), In === null)) {
        if (ml === null) throw Error(i(308));
        ((In = e), (ml.dependencies = { lanes: 0, firstContext: e }));
      } else In = In.next = e;
    return t;
  }
  var on = null;
  function nu(e) {
    on === null ? (on = [e]) : on.push(e);
  }
  function qa(e, t, n, r) {
    var l = t.interleaved;
    return (
      l === null ? ((n.next = n), nu(t)) : ((n.next = l.next), (l.next = n)),
      (t.interleaved = n),
      Tt(e, r)
    );
  }
  function Tt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null;)
      ((e.childLanes |= t),
        (n = e.alternate),
        n !== null && (n.childLanes |= t),
        (n = e),
        (e = e.return));
    return n.tag === 3 ? n.stateNode : null;
  }
  var Qt = !1;
  function ru(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    };
  }
  function ba(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          effects: e.effects,
        }));
  }
  function zt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Kt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (((r = r.shared), (ue & 2) !== 0)) {
      var l = r.pending;
      return (
        l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
        (r.pending = t),
        Tt(e, n)
      );
    }
    return (
      (l = r.interleaved),
      l === null ? ((t.next = t), nu(r)) : ((t.next = l.next), (l.next = t)),
      (r.interleaved = t),
      Tt(e, n)
    );
  }
  function vl(e, t, n) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), yo(e, n));
    }
  }
  function es(e, t) {
    var n = e.updateQueue,
      r = e.alternate;
    if (r !== null && ((r = r.updateQueue), n === r)) {
      var l = null,
        o = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var a = {
            eventTime: n.eventTime,
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: n.callback,
            next: null,
          };
          (o === null ? (l = o = a) : (o = o.next = a), (n = n.next));
        } while (n !== null);
        o === null ? (l = o = t) : (o = o.next = t);
      } else l = o = t;
      ((n = {
        baseState: r.baseState,
        firstBaseUpdate: l,
        lastBaseUpdate: o,
        shared: r.shared,
        effects: r.effects,
      }),
        (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t));
  }
  function yl(e, t, n, r) {
    var l = e.updateQueue;
    Qt = !1;
    var o = l.firstBaseUpdate,
      a = l.lastBaseUpdate,
      d = l.shared.pending;
    if (d !== null) {
      l.shared.pending = null;
      var h = d,
        x = h.next;
      ((h.next = null), a === null ? (o = x) : (a.next = x), (a = h));
      var O = e.alternate;
      O !== null &&
        ((O = O.updateQueue),
        (d = O.lastBaseUpdate),
        d !== a && (d === null ? (O.firstBaseUpdate = x) : (d.next = x), (O.lastBaseUpdate = h)));
    }
    if (o !== null) {
      var F = l.baseState;
      ((a = 0), (O = x = h = null), (d = o));
      do {
        var D = d.lane,
          H = d.eventTime;
        if ((r & D) === D) {
          O !== null &&
            (O = O.next =
              {
                eventTime: H,
                lane: 0,
                tag: d.tag,
                payload: d.payload,
                callback: d.callback,
                next: null,
              });
          e: {
            var Q = e,
              K = d;
            switch (((D = t), (H = n), K.tag)) {
              case 1:
                if (((Q = K.payload), typeof Q == 'function')) {
                  F = Q.call(H, F, D);
                  break e;
                }
                F = Q;
                break e;
              case 3:
                Q.flags = (Q.flags & -65537) | 128;
              case 0:
                if (
                  ((Q = K.payload), (D = typeof Q == 'function' ? Q.call(H, F, D) : Q), D == null)
                )
                  break e;
                F = I({}, F, D);
                break e;
              case 2:
                Qt = !0;
            }
          }
          d.callback !== null &&
            d.lane !== 0 &&
            ((e.flags |= 64), (D = l.effects), D === null ? (l.effects = [d]) : D.push(d));
        } else
          ((H = {
            eventTime: H,
            lane: D,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null,
          }),
            O === null ? ((x = O = H), (h = F)) : (O = O.next = H),
            (a |= D));
        if (((d = d.next), d === null)) {
          if (((d = l.shared.pending), d === null)) break;
          ((D = d),
            (d = D.next),
            (D.next = null),
            (l.lastBaseUpdate = D),
            (l.shared.pending = null));
        }
      } while (!0);
      if (
        (O === null && (h = F),
        (l.baseState = h),
        (l.firstBaseUpdate = x),
        (l.lastBaseUpdate = O),
        (t = l.shared.interleaved),
        t !== null)
      ) {
        l = t;
        do ((a |= l.lane), (l = l.next));
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      ((sn |= a), (e.lanes = a), (e.memoizedState = F));
    }
  }
  function ts(e, t, n) {
    if (((e = t.effects), (t.effects = null), e !== null))
      for (t = 0; t < e.length; t++) {
        var r = e[t],
          l = r.callback;
        if (l !== null) {
          if (((r.callback = null), (r = n), typeof l != 'function')) throw Error(i(191, l));
          l.call(r);
        }
      }
  }
  var vr = {},
    Ct = Ht(vr),
    yr = Ht(vr),
    gr = Ht(vr);
  function un(e) {
    if (e === vr) throw Error(i(174));
    return e;
  }
  function lu(e, t) {
    switch ((pe(gr, t), pe(yr, e), pe(Ct, vr), (e = t.nodeType), e)) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : lo(null, '');
        break;
      default:
        ((e = e === 8 ? t.parentNode : t),
          (t = e.namespaceURI || null),
          (e = e.tagName),
          (t = lo(t, e)));
    }
    (me(Ct), pe(Ct, t));
  }
  function On() {
    (me(Ct), me(yr), me(gr));
  }
  function ns(e) {
    un(gr.current);
    var t = un(Ct.current),
      n = lo(t, e.type);
    t !== n && (pe(yr, e), pe(Ct, n));
  }
  function ou(e) {
    yr.current === e && (me(Ct), me(yr));
  }
  var we = Ht(0);
  function gl(e) {
    for (var t = e; t !== null;) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || n.data === '$?' || n.data === '$!'))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var uu = [];
  function iu() {
    for (var e = 0; e < uu.length; e++) uu[e]._workInProgressVersionPrimary = null;
    uu.length = 0;
  }
  var wl = b.ReactCurrentDispatcher,
    au = b.ReactCurrentBatchConfig,
    an = 0,
    Se = null,
    Pe = null,
    Te = null,
    Sl = !1,
    wr = !1,
    Sr = 0,
    zd = 0;
  function Ae() {
    throw Error(i(321));
  }
  function su(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!dt(e[n], t[n])) return !1;
    return !0;
  }
  function cu(e, t, n, r, l, o) {
    if (
      ((an = o),
      (Se = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (wl.current = e === null || e.memoizedState === null ? Fd : Md),
      (e = n(r, l)),
      wr)
    ) {
      o = 0;
      do {
        if (((wr = !1), (Sr = 0), 25 <= o)) throw Error(i(301));
        ((o += 1), (Te = Pe = null), (t.updateQueue = null), (wl.current = Ud), (e = n(r, l)));
      } while (wr);
    }
    if (
      ((wl.current = Cl),
      (t = Pe !== null && Pe.next !== null),
      (an = 0),
      (Te = Pe = Se = null),
      (Sl = !1),
      t)
    )
      throw Error(i(300));
    return e;
  }
  function fu() {
    var e = Sr !== 0;
    return ((Sr = 0), e);
  }
  function xt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Te === null ? (Se.memoizedState = Te = e) : (Te = Te.next = e), Te);
  }
  function it() {
    if (Pe === null) {
      var e = Se.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Pe.next;
    var t = Te === null ? Se.memoizedState : Te.next;
    if (t !== null) ((Te = t), (Pe = e));
    else {
      if (e === null) throw Error(i(310));
      ((Pe = e),
        (e = {
          memoizedState: Pe.memoizedState,
          baseState: Pe.baseState,
          baseQueue: Pe.baseQueue,
          queue: Pe.queue,
          next: null,
        }),
        Te === null ? (Se.memoizedState = Te = e) : (Te = Te.next = e));
    }
    return Te;
  }
  function kr(e, t) {
    return typeof t == 'function' ? t(e) : t;
  }
  function du(e) {
    var t = it(),
      n = t.queue;
    if (n === null) throw Error(i(311));
    n.lastRenderedReducer = e;
    var r = Pe,
      l = r.baseQueue,
      o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var a = l.next;
        ((l.next = o.next), (o.next = a));
      }
      ((r.baseQueue = l = o), (n.pending = null));
    }
    if (l !== null) {
      ((o = l.next), (r = r.baseState));
      var d = (a = null),
        h = null,
        x = o;
      do {
        var O = x.lane;
        if ((an & O) === O)
          (h !== null &&
            (h = h.next =
              {
                lane: 0,
                action: x.action,
                hasEagerState: x.hasEagerState,
                eagerState: x.eagerState,
                next: null,
              }),
            (r = x.hasEagerState ? x.eagerState : e(r, x.action)));
        else {
          var F = {
            lane: O,
            action: x.action,
            hasEagerState: x.hasEagerState,
            eagerState: x.eagerState,
            next: null,
          };
          (h === null ? ((d = h = F), (a = r)) : (h = h.next = F), (Se.lanes |= O), (sn |= O));
        }
        x = x.next;
      } while (x !== null && x !== o);
      (h === null ? (a = r) : (h.next = d),
        dt(r, t.memoizedState) || (Ye = !0),
        (t.memoizedState = r),
        (t.baseState = a),
        (t.baseQueue = h),
        (n.lastRenderedState = r));
    }
    if (((e = n.interleaved), e !== null)) {
      l = e;
      do ((o = l.lane), (Se.lanes |= o), (sn |= o), (l = l.next));
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function pu(e) {
    var t = it(),
      n = t.queue;
    if (n === null) throw Error(i(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch,
      l = n.pending,
      o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var a = (l = l.next);
      do ((o = e(o, a.action)), (a = a.next));
      while (a !== l);
      (dt(o, t.memoizedState) || (Ye = !0),
        (t.memoizedState = o),
        t.baseQueue === null && (t.baseState = o),
        (n.lastRenderedState = o));
    }
    return [o, r];
  }
  function rs() {}
  function ls(e, t) {
    var n = Se,
      r = it(),
      l = t(),
      o = !dt(r.memoizedState, l);
    if (
      (o && ((r.memoizedState = l), (Ye = !0)),
      (r = r.queue),
      hu(is.bind(null, n, r, e), [e]),
      r.getSnapshot !== t || o || (Te !== null && Te.memoizedState.tag & 1))
    ) {
      if (((n.flags |= 2048), Er(9, us.bind(null, n, r, l, t), void 0, null), ze === null))
        throw Error(i(349));
      (an & 30) !== 0 || os(n, t, l);
    }
    return l;
  }
  function os(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = Se.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }), (Se.updateQueue = t), (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function us(e, t, n, r) {
    ((t.value = n), (t.getSnapshot = r), as(t) && ss(e));
  }
  function is(e, t, n) {
    return n(function () {
      as(t) && ss(e);
    });
  }
  function as(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !dt(e, n);
    } catch {
      return !0;
    }
  }
  function ss(e) {
    var t = Tt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function cs(e) {
    var t = xt();
    return (
      typeof e == 'function' && (e = e()),
      (t.memoizedState = t.baseState = e),
      (e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: kr,
        lastRenderedState: e,
      }),
      (t.queue = e),
      (e = e.dispatch = Od.bind(null, Se, e)),
      [t.memoizedState, e]
    );
  }
  function Er(e, t, n, r) {
    return (
      (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
      (t = Se.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (Se.updateQueue = t),
          (t.lastEffect = e.next = e))
        : ((n = t.lastEffect),
          n === null
            ? (t.lastEffect = e.next = e)
            : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
      e
    );
  }
  function fs() {
    return it().memoizedState;
  }
  function kl(e, t, n, r) {
    var l = xt();
    ((Se.flags |= e), (l.memoizedState = Er(1 | t, n, void 0, r === void 0 ? null : r)));
  }
  function El(e, t, n, r) {
    var l = it();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Pe !== null) {
      var a = Pe.memoizedState;
      if (((o = a.destroy), r !== null && su(r, a.deps))) {
        l.memoizedState = Er(t, n, o, r);
        return;
      }
    }
    ((Se.flags |= e), (l.memoizedState = Er(1 | t, n, o, r)));
  }
  function ds(e, t) {
    return kl(8390656, 8, e, t);
  }
  function hu(e, t) {
    return El(2048, 8, e, t);
  }
  function ps(e, t) {
    return El(4, 2, e, t);
  }
  function hs(e, t) {
    return El(4, 4, e, t);
  }
  function ms(e, t) {
    if (typeof t == 'function')
      return (
        (e = e()),
        t(e),
        function () {
          t(null);
        }
      );
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function vs(e, t, n) {
    return ((n = n != null ? n.concat([e]) : null), El(4, 4, ms.bind(null, t, e), n));
  }
  function mu() {}
  function ys(e, t) {
    var n = it();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && su(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
  }
  function gs(e, t) {
    var n = it();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && su(t, r[1])
      ? r[0]
      : ((e = e()), (n.memoizedState = [e, t]), e);
  }
  function ws(e, t, n) {
    return (an & 21) === 0
      ? (e.baseState && ((e.baseState = !1), (Ye = !0)), (e.memoizedState = n))
      : (dt(n, t) || ((n = Xi()), (Se.lanes |= n), (sn |= n), (e.baseState = !0)), t);
  }
  function Id(e, t) {
    var n = ce;
    ((ce = n !== 0 && 4 > n ? n : 4), e(!0));
    var r = au.transition;
    au.transition = {};
    try {
      (e(!1), t());
    } finally {
      ((ce = n), (au.transition = r));
    }
  }
  function Ss() {
    return it().memoizedState;
  }
  function Dd(e, t, n) {
    var r = Jt(e);
    if (((n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }), ks(e)))
      Es(t, n);
    else if (((n = qa(e, t, n, r)), n !== null)) {
      var l = Ve();
      (yt(n, e, r, l), Cs(n, t, r));
    }
  }
  function Od(e, t, n) {
    var r = Jt(e),
      l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (ks(e)) Es(t, l);
    else {
      var o = e.alternate;
      if (
        e.lanes === 0 &&
        (o === null || o.lanes === 0) &&
        ((o = t.lastRenderedReducer), o !== null)
      )
        try {
          var a = t.lastRenderedState,
            d = o(a, n);
          if (((l.hasEagerState = !0), (l.eagerState = d), dt(d, a))) {
            var h = t.interleaved;
            (h === null ? ((l.next = l), nu(t)) : ((l.next = h.next), (h.next = l)),
              (t.interleaved = l));
            return;
          }
        } catch {
        } finally {
        }
      ((n = qa(e, t, l, r)), n !== null && ((l = Ve()), yt(n, e, r, l), Cs(n, t, r)));
    }
  }
  function ks(e) {
    var t = e.alternate;
    return e === Se || (t !== null && t === Se);
  }
  function Es(e, t) {
    wr = Sl = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
  }
  function Cs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), yo(e, n));
    }
  }
  var Cl = {
      readContext: ut,
      useCallback: Ae,
      useContext: Ae,
      useEffect: Ae,
      useImperativeHandle: Ae,
      useInsertionEffect: Ae,
      useLayoutEffect: Ae,
      useMemo: Ae,
      useReducer: Ae,
      useRef: Ae,
      useState: Ae,
      useDebugValue: Ae,
      useDeferredValue: Ae,
      useTransition: Ae,
      useMutableSource: Ae,
      useSyncExternalStore: Ae,
      useId: Ae,
      unstable_isNewReconciler: !1,
    },
    Fd = {
      readContext: ut,
      useCallback: function (e, t) {
        return ((xt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: ut,
      useEffect: ds,
      useImperativeHandle: function (e, t, n) {
        return ((n = n != null ? n.concat([e]) : null), kl(4194308, 4, ms.bind(null, t, e), n));
      },
      useLayoutEffect: function (e, t) {
        return kl(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        return kl(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = xt();
        return ((t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e);
      },
      useReducer: function (e, t, n) {
        var r = xt();
        return (
          (t = n !== void 0 ? n(t) : t),
          (r.memoizedState = r.baseState = t),
          (e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t,
          }),
          (r.queue = e),
          (e = e.dispatch = Dd.bind(null, Se, e)),
          [r.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = xt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: cs,
      useDebugValue: mu,
      useDeferredValue: function (e) {
        return (xt().memoizedState = e);
      },
      useTransition: function () {
        var e = cs(!1),
          t = e[0];
        return ((e = Id.bind(null, e[1])), (xt().memoizedState = e), [t, e]);
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (e, t, n) {
        var r = Se,
          l = xt();
        if (ye) {
          if (n === void 0) throw Error(i(407));
          n = n();
        } else {
          if (((n = t()), ze === null)) throw Error(i(349));
          (an & 30) !== 0 || os(r, t, n);
        }
        l.memoizedState = n;
        var o = { value: n, getSnapshot: t };
        return (
          (l.queue = o),
          ds(is.bind(null, r, o, e), [e]),
          (r.flags |= 2048),
          Er(9, us.bind(null, r, o, n, t), void 0, null),
          n
        );
      },
      useId: function () {
        var e = xt(),
          t = ze.identifierPrefix;
        if (ye) {
          var n = Nt,
            r = Lt;
          ((n = (r & ~(1 << (32 - ft(r) - 1))).toString(32) + n),
            (t = ':' + t + 'R' + n),
            (n = Sr++),
            0 < n && (t += 'H' + n.toString(32)),
            (t += ':'));
        } else ((n = zd++), (t = ':' + t + 'r' + n.toString(32) + ':'));
        return (e.memoizedState = t);
      },
      unstable_isNewReconciler: !1,
    },
    Md = {
      readContext: ut,
      useCallback: ys,
      useContext: ut,
      useEffect: hu,
      useImperativeHandle: vs,
      useInsertionEffect: ps,
      useLayoutEffect: hs,
      useMemo: gs,
      useReducer: du,
      useRef: fs,
      useState: function () {
        return du(kr);
      },
      useDebugValue: mu,
      useDeferredValue: function (e) {
        var t = it();
        return ws(t, Pe.memoizedState, e);
      },
      useTransition: function () {
        var e = du(kr)[0],
          t = it().memoizedState;
        return [e, t];
      },
      useMutableSource: rs,
      useSyncExternalStore: ls,
      useId: Ss,
      unstable_isNewReconciler: !1,
    },
    Ud = {
      readContext: ut,
      useCallback: ys,
      useContext: ut,
      useEffect: hu,
      useImperativeHandle: vs,
      useInsertionEffect: ps,
      useLayoutEffect: hs,
      useMemo: gs,
      useReducer: pu,
      useRef: fs,
      useState: function () {
        return pu(kr);
      },
      useDebugValue: mu,
      useDeferredValue: function (e) {
        var t = it();
        return Pe === null ? (t.memoizedState = e) : ws(t, Pe.memoizedState, e);
      },
      useTransition: function () {
        var e = pu(kr)[0],
          t = it().memoizedState;
        return [e, t];
      },
      useMutableSource: rs,
      useSyncExternalStore: ls,
      useId: Ss,
      unstable_isNewReconciler: !1,
    };
  function ht(e, t) {
    if (e && e.defaultProps) {
      ((t = I({}, t)), (e = e.defaultProps));
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function vu(e, t, n, r) {
    ((t = e.memoizedState),
      (n = n(r, t)),
      (n = n == null ? t : I({}, t, n)),
      (e.memoizedState = n),
      e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var xl = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? en(e) === e : !1;
    },
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ve(),
        l = Jt(e),
        o = zt(r, l);
      ((o.payload = t),
        n != null && (o.callback = n),
        (t = Kt(e, o, l)),
        t !== null && (yt(t, e, l, r), vl(t, e, l)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ve(),
        l = Jt(e),
        o = zt(r, l);
      ((o.tag = 1),
        (o.payload = t),
        n != null && (o.callback = n),
        (t = Kt(e, o, l)),
        t !== null && (yt(t, e, l, r), vl(t, e, l)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = Ve(),
        r = Jt(e),
        l = zt(n, r);
      ((l.tag = 2),
        t != null && (l.callback = t),
        (t = Kt(e, l, r)),
        t !== null && (yt(t, e, r, n), vl(t, e, r)));
    },
  };
  function xs(e, t, n, r, l, o, a) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == 'function'
        ? e.shouldComponentUpdate(r, o, a)
        : t.prototype && t.prototype.isPureReactComponent
          ? !ar(n, r) || !ar(l, o)
          : !0
    );
  }
  function Rs(e, t, n) {
    var r = !1,
      l = Wt,
      o = t.contextType;
    return (
      typeof o == 'object' && o !== null
        ? (o = ut(o))
        : ((l = Ke(t) ? nn : $e.current),
          (r = t.contextTypes),
          (o = (r = r != null) ? Pn(e, l) : Wt)),
      (t = new t(n, o)),
      (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
      (t.updater = xl),
      (e.stateNode = t),
      (t._reactInternals = e),
      r &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = l),
        (e.__reactInternalMemoizedMaskedChildContext = o)),
      t
    );
  }
  function _s(e, t, n, r) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(n, r),
      typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
        t.UNSAFE_componentWillReceiveProps(n, r),
      t.state !== e && xl.enqueueReplaceState(t, t.state, null));
  }
  function yu(e, t, n, r) {
    var l = e.stateNode;
    ((l.props = n), (l.state = e.memoizedState), (l.refs = {}), ru(e));
    var o = t.contextType;
    (typeof o == 'object' && o !== null
      ? (l.context = ut(o))
      : ((o = Ke(t) ? nn : $e.current), (l.context = Pn(e, o))),
      (l.state = e.memoizedState),
      (o = t.getDerivedStateFromProps),
      typeof o == 'function' && (vu(e, t, o, n), (l.state = e.memoizedState)),
      typeof t.getDerivedStateFromProps == 'function' ||
        typeof l.getSnapshotBeforeUpdate == 'function' ||
        (typeof l.UNSAFE_componentWillMount != 'function' &&
          typeof l.componentWillMount != 'function') ||
        ((t = l.state),
        typeof l.componentWillMount == 'function' && l.componentWillMount(),
        typeof l.UNSAFE_componentWillMount == 'function' && l.UNSAFE_componentWillMount(),
        t !== l.state && xl.enqueueReplaceState(l, l.state, null),
        yl(e, n, l, r),
        (l.state = e.memoizedState)),
      typeof l.componentDidMount == 'function' && (e.flags |= 4194308));
  }
  function Fn(e, t) {
    try {
      var n = '',
        r = t;
      do ((n += le(r)), (r = r.return));
      while (r);
      var l = n;
    } catch (o) {
      l =
        `
Error generating stack: ` +
        o.message +
        `
` +
        o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function gu(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function wu(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  var jd = typeof WeakMap == 'function' ? WeakMap : Map;
  function Ps(e, t, n) {
    ((n = zt(-1, n)), (n.tag = 3), (n.payload = { element: null }));
    var r = t.value;
    return (
      (n.callback = function () {
        (zl || ((zl = !0), (Ou = r)), wu(e, t));
      }),
      n
    );
  }
  function Ls(e, t, n) {
    ((n = zt(-1, n)), (n.tag = 3));
    var r = e.type.getDerivedStateFromError;
    if (typeof r == 'function') {
      var l = t.value;
      ((n.payload = function () {
        return r(l);
      }),
        (n.callback = function () {
          wu(e, t);
        }));
    }
    var o = e.stateNode;
    return (
      o !== null &&
        typeof o.componentDidCatch == 'function' &&
        (n.callback = function () {
          (wu(e, t),
            typeof r != 'function' && (Gt === null ? (Gt = new Set([this])) : Gt.add(this)));
          var a = t.stack;
          this.componentDidCatch(t.value, { componentStack: a !== null ? a : '' });
        }),
      n
    );
  }
  function Ns(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new jd();
      var l = new Set();
      r.set(t, l);
    } else ((l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l)));
    l.has(n) || (l.add(n), (e = qd.bind(null, e, t, n)), t.then(e, e));
  }
  function Ts(e) {
    do {
      var t;
      if (
        ((t = e.tag === 13) &&
          ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
        t)
      )
        return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function zs(e, t, n, r, l) {
    return (e.mode & 1) === 0
      ? (e === t
          ? (e.flags |= 65536)
          : ((e.flags |= 128),
            (n.flags |= 131072),
            (n.flags &= -52805),
            n.tag === 1 &&
              (n.alternate === null ? (n.tag = 17) : ((t = zt(-1, 1)), (t.tag = 2), Kt(n, t, 1))),
            (n.lanes |= 1)),
        e)
      : ((e.flags |= 65536), (e.lanes = l), e);
  }
  var $d = b.ReactCurrentOwner,
    Ye = !1;
  function We(e, t, n, r) {
    t.child = e === null ? Za(t, null, n, r) : zn(t, e.child, n, r);
  }
  function Is(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return (
      Dn(t, l),
      (r = cu(e, t, n, r, o, l)),
      (n = fu()),
      e !== null && !Ye
        ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~l), It(e, t, l))
        : (ye && n && Yo(t), (t.flags |= 1), We(e, t, r, l), t.child)
    );
  }
  function Ds(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == 'function' &&
        !Bu(o) &&
        o.defaultProps === void 0 &&
        n.compare === null &&
        n.defaultProps === void 0
        ? ((t.tag = 15), (t.type = o), Os(e, t, o, r, l))
        : ((e = Ul(n.type, null, r, t, t.mode, l)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((o = e.child), (e.lanes & l) === 0)) {
      var a = o.memoizedProps;
      if (((n = n.compare), (n = n !== null ? n : ar), n(a, r) && e.ref === t.ref))
        return It(e, t, l);
    }
    return ((t.flags |= 1), (e = qt(o, r)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function Os(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (ar(o, r) && e.ref === t.ref)
        if (((Ye = !1), (t.pendingProps = r = o), (e.lanes & l) !== 0))
          (e.flags & 131072) !== 0 && (Ye = !0);
        else return ((t.lanes = e.lanes), It(e, t, l));
    }
    return Su(e, t, n, r, l);
  }
  function Fs(e, t, n) {
    var r = t.pendingProps,
      l = r.children,
      o = e !== null ? e.memoizedState : null;
    if (r.mode === 'hidden')
      if ((t.mode & 1) === 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
          pe(Un, tt),
          (tt |= n));
      else {
        if ((n & 1073741824) === 0)
          return (
            (e = o !== null ? o.baseLanes | n : n),
            (t.lanes = t.childLanes = 1073741824),
            (t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }),
            (t.updateQueue = null),
            pe(Un, tt),
            (tt |= e),
            null
          );
        ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
          (r = o !== null ? o.baseLanes : n),
          pe(Un, tt),
          (tt |= r));
      }
    else
      (o !== null ? ((r = o.baseLanes | n), (t.memoizedState = null)) : (r = n),
        pe(Un, tt),
        (tt |= r));
    return (We(e, t, l, n), t.child);
  }
  function Ms(e, t) {
    var n = t.ref;
    ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
      ((t.flags |= 512), (t.flags |= 2097152));
  }
  function Su(e, t, n, r, l) {
    var o = Ke(n) ? nn : $e.current;
    return (
      (o = Pn(t, o)),
      Dn(t, l),
      (n = cu(e, t, n, r, o, l)),
      (r = fu()),
      e !== null && !Ye
        ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~l), It(e, t, l))
        : (ye && r && Yo(t), (t.flags |= 1), We(e, t, n, l), t.child)
    );
  }
  function Us(e, t, n, r, l) {
    if (Ke(n)) {
      var o = !0;
      al(t);
    } else o = !1;
    if ((Dn(t, l), t.stateNode === null)) (_l(e, t), Rs(t, n, r), yu(t, n, r, l), (r = !0));
    else if (e === null) {
      var a = t.stateNode,
        d = t.memoizedProps;
      a.props = d;
      var h = a.context,
        x = n.contextType;
      typeof x == 'object' && x !== null
        ? (x = ut(x))
        : ((x = Ke(n) ? nn : $e.current), (x = Pn(t, x)));
      var O = n.getDerivedStateFromProps,
        F = typeof O == 'function' || typeof a.getSnapshotBeforeUpdate == 'function';
      (F ||
        (typeof a.UNSAFE_componentWillReceiveProps != 'function' &&
          typeof a.componentWillReceiveProps != 'function') ||
        ((d !== r || h !== x) && _s(t, a, r, x)),
        (Qt = !1));
      var D = t.memoizedState;
      ((a.state = D),
        yl(t, r, a, l),
        (h = t.memoizedState),
        d !== r || D !== h || Qe.current || Qt
          ? (typeof O == 'function' && (vu(t, n, O, r), (h = t.memoizedState)),
            (d = Qt || xs(t, n, d, r, D, h, x))
              ? (F ||
                  (typeof a.UNSAFE_componentWillMount != 'function' &&
                    typeof a.componentWillMount != 'function') ||
                  (typeof a.componentWillMount == 'function' && a.componentWillMount(),
                  typeof a.UNSAFE_componentWillMount == 'function' &&
                    a.UNSAFE_componentWillMount()),
                typeof a.componentDidMount == 'function' && (t.flags |= 4194308))
              : (typeof a.componentDidMount == 'function' && (t.flags |= 4194308),
                (t.memoizedProps = r),
                (t.memoizedState = h)),
            (a.props = r),
            (a.state = h),
            (a.context = x),
            (r = d))
          : (typeof a.componentDidMount == 'function' && (t.flags |= 4194308), (r = !1)));
    } else {
      ((a = t.stateNode),
        ba(e, t),
        (d = t.memoizedProps),
        (x = t.type === t.elementType ? d : ht(t.type, d)),
        (a.props = x),
        (F = t.pendingProps),
        (D = a.context),
        (h = n.contextType),
        typeof h == 'object' && h !== null
          ? (h = ut(h))
          : ((h = Ke(n) ? nn : $e.current), (h = Pn(t, h))));
      var H = n.getDerivedStateFromProps;
      ((O = typeof H == 'function' || typeof a.getSnapshotBeforeUpdate == 'function') ||
        (typeof a.UNSAFE_componentWillReceiveProps != 'function' &&
          typeof a.componentWillReceiveProps != 'function') ||
        ((d !== F || D !== h) && _s(t, a, r, h)),
        (Qt = !1),
        (D = t.memoizedState),
        (a.state = D),
        yl(t, r, a, l));
      var Q = t.memoizedState;
      d !== F || D !== Q || Qe.current || Qt
        ? (typeof H == 'function' && (vu(t, n, H, r), (Q = t.memoizedState)),
          (x = Qt || xs(t, n, x, r, D, Q, h) || !1)
            ? (O ||
                (typeof a.UNSAFE_componentWillUpdate != 'function' &&
                  typeof a.componentWillUpdate != 'function') ||
                (typeof a.componentWillUpdate == 'function' && a.componentWillUpdate(r, Q, h),
                typeof a.UNSAFE_componentWillUpdate == 'function' &&
                  a.UNSAFE_componentWillUpdate(r, Q, h)),
              typeof a.componentDidUpdate == 'function' && (t.flags |= 4),
              typeof a.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
            : (typeof a.componentDidUpdate != 'function' ||
                (d === e.memoizedProps && D === e.memoizedState) ||
                (t.flags |= 4),
              typeof a.getSnapshotBeforeUpdate != 'function' ||
                (d === e.memoizedProps && D === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = r),
              (t.memoizedState = Q)),
          (a.props = r),
          (a.state = Q),
          (a.context = h),
          (r = x))
        : (typeof a.componentDidUpdate != 'function' ||
            (d === e.memoizedProps && D === e.memoizedState) ||
            (t.flags |= 4),
          typeof a.getSnapshotBeforeUpdate != 'function' ||
            (d === e.memoizedProps && D === e.memoizedState) ||
            (t.flags |= 1024),
          (r = !1));
    }
    return ku(e, t, n, r, o, l);
  }
  function ku(e, t, n, r, l, o) {
    Ms(e, t);
    var a = (t.flags & 128) !== 0;
    if (!r && !a) return (l && Ha(t, n, !1), It(e, t, o));
    ((r = t.stateNode), ($d.current = t));
    var d = a && typeof n.getDerivedStateFromError != 'function' ? null : r.render();
    return (
      (t.flags |= 1),
      e !== null && a
        ? ((t.child = zn(t, e.child, null, o)), (t.child = zn(t, null, d, o)))
        : We(e, t, d, o),
      (t.memoizedState = r.state),
      l && Ha(t, n, !0),
      t.child
    );
  }
  function js(e) {
    var t = e.stateNode;
    (t.pendingContext
      ? Aa(e, t.pendingContext, t.pendingContext !== t.context)
      : t.context && Aa(e, t.context, !1),
      lu(e, t.containerInfo));
  }
  function $s(e, t, n, r, l) {
    return (Tn(), Zo(l), (t.flags |= 256), We(e, t, n, r), t.child);
  }
  var Eu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Cu(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function As(e, t, n) {
    var r = t.pendingProps,
      l = we.current,
      o = !1,
      a = (t.flags & 128) !== 0,
      d;
    if (
      ((d = a) || (d = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
      d ? ((o = !0), (t.flags &= -129)) : (e === null || e.memoizedState !== null) && (l |= 1),
      pe(we, l & 1),
      e === null)
    )
      return (
        Jo(t),
        (e = t.memoizedState),
        e !== null && ((e = e.dehydrated), e !== null)
          ? ((t.mode & 1) === 0
              ? (t.lanes = 1)
              : e.data === '$!'
                ? (t.lanes = 8)
                : (t.lanes = 1073741824),
            null)
          : ((a = r.children),
            (e = r.fallback),
            o
              ? ((r = t.mode),
                (o = t.child),
                (a = { mode: 'hidden', children: a }),
                (r & 1) === 0 && o !== null
                  ? ((o.childLanes = 0), (o.pendingProps = a))
                  : (o = jl(a, r, 0, null)),
                (e = pn(e, r, n, null)),
                (o.return = t),
                (e.return = t),
                (o.sibling = e),
                (t.child = o),
                (t.child.memoizedState = Cu(n)),
                (t.memoizedState = Eu),
                e)
              : xu(t, a))
      );
    if (((l = e.memoizedState), l !== null && ((d = l.dehydrated), d !== null)))
      return Ad(e, t, a, r, d, l, n);
    if (o) {
      ((o = r.fallback), (a = t.mode), (l = e.child), (d = l.sibling));
      var h = { mode: 'hidden', children: r.children };
      return (
        (a & 1) === 0 && t.child !== l
          ? ((r = t.child), (r.childLanes = 0), (r.pendingProps = h), (t.deletions = null))
          : ((r = qt(l, h)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
        d !== null ? (o = qt(d, o)) : ((o = pn(o, a, n, null)), (o.flags |= 2)),
        (o.return = t),
        (r.return = t),
        (r.sibling = o),
        (t.child = r),
        (r = o),
        (o = t.child),
        (a = e.child.memoizedState),
        (a =
          a === null
            ? Cu(n)
            : { baseLanes: a.baseLanes | n, cachePool: null, transitions: a.transitions }),
        (o.memoizedState = a),
        (o.childLanes = e.childLanes & ~n),
        (t.memoizedState = Eu),
        r
      );
    }
    return (
      (o = e.child),
      (e = o.sibling),
      (r = qt(o, { mode: 'visible', children: r.children })),
      (t.mode & 1) === 0 && (r.lanes = n),
      (r.return = t),
      (r.sibling = null),
      e !== null &&
        ((n = t.deletions), n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
      (t.child = r),
      (t.memoizedState = null),
      r
    );
  }
  function xu(e, t) {
    return (
      (t = jl({ mode: 'visible', children: t }, e.mode, 0, null)),
      (t.return = e),
      (e.child = t)
    );
  }
  function Rl(e, t, n, r) {
    return (
      r !== null && Zo(r),
      zn(t, e.child, null, n),
      (e = xu(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function Ad(e, t, n, r, l, o, a) {
    if (n)
      return t.flags & 256
        ? ((t.flags &= -257), (r = gu(Error(i(422)))), Rl(e, t, a, r))
        : t.memoizedState !== null
          ? ((t.child = e.child), (t.flags |= 128), null)
          : ((o = r.fallback),
            (l = t.mode),
            (r = jl({ mode: 'visible', children: r.children }, l, 0, null)),
            (o = pn(o, l, a, null)),
            (o.flags |= 2),
            (r.return = t),
            (o.return = t),
            (r.sibling = o),
            (t.child = r),
            (t.mode & 1) !== 0 && zn(t, e.child, null, a),
            (t.child.memoizedState = Cu(a)),
            (t.memoizedState = Eu),
            o);
    if ((t.mode & 1) === 0) return Rl(e, t, a, null);
    if (l.data === '$!') {
      if (((r = l.nextSibling && l.nextSibling.dataset), r)) var d = r.dgst;
      return ((r = d), (o = Error(i(419))), (r = gu(o, r, void 0)), Rl(e, t, a, r));
    }
    if (((d = (a & e.childLanes) !== 0), Ye || d)) {
      if (((r = ze), r !== null)) {
        switch (a & -a) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        ((l = (l & (r.suspendedLanes | a)) !== 0 ? 0 : l),
          l !== 0 && l !== o.retryLane && ((o.retryLane = l), Tt(e, l), yt(r, e, l, -1)));
      }
      return (Au(), (r = gu(Error(i(421)))), Rl(e, t, a, r));
    }
    return l.data === '$?'
      ? ((t.flags |= 128), (t.child = e.child), (t = bd.bind(null, e)), (l._reactRetry = t), null)
      : ((e = o.treeContext),
        (et = Bt(l.nextSibling)),
        (be = t),
        (ye = !0),
        (pt = null),
        e !== null &&
          ((lt[ot++] = Lt),
          (lt[ot++] = Nt),
          (lt[ot++] = rn),
          (Lt = e.id),
          (Nt = e.overflow),
          (rn = t)),
        (t = xu(t, r.children)),
        (t.flags |= 4096),
        t);
  }
  function Bs(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    (r !== null && (r.lanes |= t), tu(e.return, t, n));
  }
  function Ru(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: r,
          tail: n,
          tailMode: l,
        })
      : ((o.isBackwards = t),
        (o.rendering = null),
        (o.renderingStartTime = 0),
        (o.last = r),
        (o.tail = n),
        (o.tailMode = l));
  }
  function Hs(e, t, n) {
    var r = t.pendingProps,
      l = r.revealOrder,
      o = r.tail;
    if ((We(e, t, r.children, n), (r = we.current), (r & 2) !== 0))
      ((r = (r & 1) | 2), (t.flags |= 128));
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null;) {
          if (e.tag === 13) e.memoizedState !== null && Bs(e, n, t);
          else if (e.tag === 19) Bs(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null;) {
            if (e.return === null || e.return === t) break e;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      r &= 1;
    }
    if ((pe(we, r), (t.mode & 1) === 0)) t.memoizedState = null;
    else
      switch (l) {
        case 'forwards':
          for (n = t.child, l = null; n !== null;)
            ((e = n.alternate), e !== null && gl(e) === null && (l = n), (n = n.sibling));
          ((n = l),
            n === null ? ((l = t.child), (t.child = null)) : ((l = n.sibling), (n.sibling = null)),
            Ru(t, !1, l, n, o));
          break;
        case 'backwards':
          for (n = null, l = t.child, t.child = null; l !== null;) {
            if (((e = l.alternate), e !== null && gl(e) === null)) {
              t.child = l;
              break;
            }
            ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
          }
          Ru(t, !0, n, null, o);
          break;
        case 'together':
          Ru(t, !1, null, null, void 0);
          break;
        default:
          t.memoizedState = null;
      }
    return t.child;
  }
  function _l(e, t) {
    (t.mode & 1) === 0 &&
      e !== null &&
      ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
  }
  function It(e, t, n) {
    if (
      (e !== null && (t.dependencies = e.dependencies), (sn |= t.lanes), (n & t.childLanes) === 0)
    )
      return null;
    if (e !== null && t.child !== e.child) throw Error(i(153));
    if (t.child !== null) {
      for (e = t.child, n = qt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;)
        ((e = e.sibling), (n = n.sibling = qt(e, e.pendingProps)), (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function Bd(e, t, n) {
    switch (t.tag) {
      case 3:
        (js(t), Tn());
        break;
      case 5:
        ns(t);
        break;
      case 1:
        Ke(t.type) && al(t);
        break;
      case 4:
        lu(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context,
          l = t.memoizedProps.value;
        (pe(hl, r._currentValue), (r._currentValue = l));
        break;
      case 13:
        if (((r = t.memoizedState), r !== null))
          return r.dehydrated !== null
            ? (pe(we, we.current & 1), (t.flags |= 128), null)
            : (n & t.child.childLanes) !== 0
              ? As(e, t, n)
              : (pe(we, we.current & 1), (e = It(e, t, n)), e !== null ? e.sibling : null);
        pe(we, we.current & 1);
        break;
      case 19:
        if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
          if (r) return Hs(e, t, n);
          t.flags |= 128;
        }
        if (
          ((l = t.memoizedState),
          l !== null && ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
          pe(we, we.current),
          r)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((t.lanes = 0), Fs(e, t, n));
    }
    return It(e, t, n);
  }
  var Ws, _u, Vs, Qs;
  ((Ws = function (e, t) {
    for (var n = t.child; n !== null;) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        ((n.child.return = n), (n = n.child));
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null;) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      ((n.sibling.return = n.return), (n = n.sibling));
    }
  }),
    (_u = function () {}),
    (Vs = function (e, t, n, r) {
      var l = e.memoizedProps;
      if (l !== r) {
        ((e = t.stateNode), un(Ct.current));
        var o = null;
        switch (n) {
          case 'input':
            ((l = eo(e, l)), (r = eo(e, r)), (o = []));
            break;
          case 'select':
            ((l = I({}, l, { value: void 0 })), (r = I({}, r, { value: void 0 })), (o = []));
            break;
          case 'textarea':
            ((l = ro(e, l)), (r = ro(e, r)), (o = []));
            break;
          default:
            typeof l.onClick != 'function' && typeof r.onClick == 'function' && (e.onclick = ol);
        }
        oo(n, r);
        var a;
        n = null;
        for (x in l)
          if (!r.hasOwnProperty(x) && l.hasOwnProperty(x) && l[x] != null)
            if (x === 'style') {
              var d = l[x];
              for (a in d) d.hasOwnProperty(a) && (n || (n = {}), (n[a] = ''));
            } else
              x !== 'dangerouslySetInnerHTML' &&
                x !== 'children' &&
                x !== 'suppressContentEditableWarning' &&
                x !== 'suppressHydrationWarning' &&
                x !== 'autoFocus' &&
                (f.hasOwnProperty(x) ? o || (o = []) : (o = o || []).push(x, null));
        for (x in r) {
          var h = r[x];
          if (
            ((d = l != null ? l[x] : void 0),
            r.hasOwnProperty(x) && h !== d && (h != null || d != null))
          )
            if (x === 'style')
              if (d) {
                for (a in d)
                  !d.hasOwnProperty(a) ||
                    (h && h.hasOwnProperty(a)) ||
                    (n || (n = {}), (n[a] = ''));
                for (a in h) h.hasOwnProperty(a) && d[a] !== h[a] && (n || (n = {}), (n[a] = h[a]));
              } else (n || (o || (o = []), o.push(x, n)), (n = h));
            else
              x === 'dangerouslySetInnerHTML'
                ? ((h = h ? h.__html : void 0),
                  (d = d ? d.__html : void 0),
                  h != null && d !== h && (o = o || []).push(x, h))
                : x === 'children'
                  ? (typeof h != 'string' && typeof h != 'number') || (o = o || []).push(x, '' + h)
                  : x !== 'suppressContentEditableWarning' &&
                    x !== 'suppressHydrationWarning' &&
                    (f.hasOwnProperty(x)
                      ? (h != null && x === 'onScroll' && he('scroll', e), o || d === h || (o = []))
                      : (o = o || []).push(x, h));
        }
        n && (o = o || []).push('style', n);
        var x = o;
        (t.updateQueue = x) && (t.flags |= 4);
      }
    }),
    (Qs = function (e, t, n, r) {
      n !== r && (t.flags |= 4);
    }));
  function Cr(e, t) {
    if (!ye)
      switch (e.tailMode) {
        case 'hidden':
          t = e.tail;
          for (var n = null; t !== null;) (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
          break;
        case 'collapsed':
          n = e.tail;
          for (var r = null; n !== null;) (n.alternate !== null && (r = n), (n = n.sibling));
          r === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (r.sibling = null);
      }
  }
  function Be(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      r = 0;
    if (t)
      for (var l = e.child; l !== null;)
        ((n |= l.lanes | l.childLanes),
          (r |= l.subtreeFlags & 14680064),
          (r |= l.flags & 14680064),
          (l.return = e),
          (l = l.sibling));
    else
      for (l = e.child; l !== null;)
        ((n |= l.lanes | l.childLanes),
          (r |= l.subtreeFlags),
          (r |= l.flags),
          (l.return = e),
          (l = l.sibling));
    return ((e.subtreeFlags |= r), (e.childLanes = n), t);
  }
  function Hd(e, t, n) {
    var r = t.pendingProps;
    switch ((Go(t), t.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Be(t), null);
      case 1:
        return (Ke(t.type) && il(), Be(t), null);
      case 3:
        return (
          (r = t.stateNode),
          On(),
          me(Qe),
          me($e),
          iu(),
          r.pendingContext && ((r.context = r.pendingContext), (r.pendingContext = null)),
          (e === null || e.child === null) &&
            (dl(t)
              ? (t.flags |= 4)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), pt !== null && (Uu(pt), (pt = null)))),
          _u(e, t),
          Be(t),
          null
        );
      case 5:
        ou(t);
        var l = un(gr.current);
        if (((n = t.type), e !== null && t.stateNode != null))
          (Vs(e, t, n, r, l), e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(i(166));
            return (Be(t), null);
          }
          if (((e = un(Ct.current)), dl(t))) {
            ((r = t.stateNode), (n = t.type));
            var o = t.memoizedProps;
            switch (((r[Et] = t), (r[pr] = o), (e = (t.mode & 1) !== 0), n)) {
              case 'dialog':
                (he('cancel', r), he('close', r));
                break;
              case 'iframe':
              case 'object':
              case 'embed':
                he('load', r);
                break;
              case 'video':
              case 'audio':
                for (l = 0; l < cr.length; l++) he(cr[l], r);
                break;
              case 'source':
                he('error', r);
                break;
              case 'img':
              case 'image':
              case 'link':
                (he('error', r), he('load', r));
                break;
              case 'details':
                he('toggle', r);
                break;
              case 'input':
                (Ri(r, o), he('invalid', r));
                break;
              case 'select':
                ((r._wrapperState = { wasMultiple: !!o.multiple }), he('invalid', r));
                break;
              case 'textarea':
                (Li(r, o), he('invalid', r));
            }
            (oo(n, o), (l = null));
            for (var a in o)
              if (o.hasOwnProperty(a)) {
                var d = o[a];
                a === 'children'
                  ? typeof d == 'string'
                    ? r.textContent !== d &&
                      (o.suppressHydrationWarning !== !0 && ll(r.textContent, d, e),
                      (l = ['children', d]))
                    : typeof d == 'number' &&
                      r.textContent !== '' + d &&
                      (o.suppressHydrationWarning !== !0 && ll(r.textContent, d, e),
                      (l = ['children', '' + d]))
                  : f.hasOwnProperty(a) && d != null && a === 'onScroll' && he('scroll', r);
              }
            switch (n) {
              case 'input':
                (Fr(r), Pi(r, o, !0));
                break;
              case 'textarea':
                (Fr(r), Ti(r));
                break;
              case 'select':
              case 'option':
                break;
              default:
                typeof o.onClick == 'function' && (r.onclick = ol);
            }
            ((r = l), (t.updateQueue = r), r !== null && (t.flags |= 4));
          } else {
            ((a = l.nodeType === 9 ? l : l.ownerDocument),
              e === 'http://www.w3.org/1999/xhtml' && (e = zi(n)),
              e === 'http://www.w3.org/1999/xhtml'
                ? n === 'script'
                  ? ((e = a.createElement('div')),
                    (e.innerHTML = '<script><\/script>'),
                    (e = e.removeChild(e.firstChild)))
                  : typeof r.is == 'string'
                    ? (e = a.createElement(n, { is: r.is }))
                    : ((e = a.createElement(n)),
                      n === 'select' &&
                        ((a = e), r.multiple ? (a.multiple = !0) : r.size && (a.size = r.size)))
                : (e = a.createElementNS(e, n)),
              (e[Et] = t),
              (e[pr] = r),
              Ws(e, t, !1, !1),
              (t.stateNode = e));
            e: {
              switch (((a = uo(n, r)), n)) {
                case 'dialog':
                  (he('cancel', e), he('close', e), (l = r));
                  break;
                case 'iframe':
                case 'object':
                case 'embed':
                  (he('load', e), (l = r));
                  break;
                case 'video':
                case 'audio':
                  for (l = 0; l < cr.length; l++) he(cr[l], e);
                  l = r;
                  break;
                case 'source':
                  (he('error', e), (l = r));
                  break;
                case 'img':
                case 'image':
                case 'link':
                  (he('error', e), he('load', e), (l = r));
                  break;
                case 'details':
                  (he('toggle', e), (l = r));
                  break;
                case 'input':
                  (Ri(e, r), (l = eo(e, r)), he('invalid', e));
                  break;
                case 'option':
                  l = r;
                  break;
                case 'select':
                  ((e._wrapperState = { wasMultiple: !!r.multiple }),
                    (l = I({}, r, { value: void 0 })),
                    he('invalid', e));
                  break;
                case 'textarea':
                  (Li(e, r), (l = ro(e, r)), he('invalid', e));
                  break;
                default:
                  l = r;
              }
              (oo(n, l), (d = l));
              for (o in d)
                if (d.hasOwnProperty(o)) {
                  var h = d[o];
                  o === 'style'
                    ? Oi(e, h)
                    : o === 'dangerouslySetInnerHTML'
                      ? ((h = h ? h.__html : void 0), h != null && Ii(e, h))
                      : o === 'children'
                        ? typeof h == 'string'
                          ? (n !== 'textarea' || h !== '') && Qn(e, h)
                          : typeof h == 'number' && Qn(e, '' + h)
                        : o !== 'suppressContentEditableWarning' &&
                          o !== 'suppressHydrationWarning' &&
                          o !== 'autoFocus' &&
                          (f.hasOwnProperty(o)
                            ? h != null && o === 'onScroll' && he('scroll', e)
                            : h != null && V(e, o, h, a));
                }
              switch (n) {
                case 'input':
                  (Fr(e), Pi(e, r, !1));
                  break;
                case 'textarea':
                  (Fr(e), Ti(e));
                  break;
                case 'option':
                  r.value != null && e.setAttribute('value', '' + se(r.value));
                  break;
                case 'select':
                  ((e.multiple = !!r.multiple),
                    (o = r.value),
                    o != null
                      ? mn(e, !!r.multiple, o, !1)
                      : r.defaultValue != null && mn(e, !!r.multiple, r.defaultValue, !0));
                  break;
                default:
                  typeof l.onClick == 'function' && (e.onclick = ol);
              }
              switch (n) {
                case 'button':
                case 'input':
                case 'select':
                case 'textarea':
                  r = !!r.autoFocus;
                  break e;
                case 'img':
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
        }
        return (Be(t), null);
      case 6:
        if (e && t.stateNode != null) Qs(e, t, e.memoizedProps, r);
        else {
          if (typeof r != 'string' && t.stateNode === null) throw Error(i(166));
          if (((n = un(gr.current)), un(Ct.current), dl(t))) {
            if (
              ((r = t.stateNode),
              (n = t.memoizedProps),
              (r[Et] = t),
              (o = r.nodeValue !== n) && ((e = be), e !== null))
            )
              switch (e.tag) {
                case 3:
                  ll(r.nodeValue, n, (e.mode & 1) !== 0);
                  break;
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== !0 &&
                    ll(r.nodeValue, n, (e.mode & 1) !== 0);
              }
            o && (t.flags |= 4);
          } else
            ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
              (r[Et] = t),
              (t.stateNode = r));
        }
        return (Be(t), null);
      case 13:
        if (
          (me(we),
          (r = t.memoizedState),
          e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (ye && et !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
            (Ga(), Tn(), (t.flags |= 98560), (o = !1));
          else if (((o = dl(t)), r !== null && r.dehydrated !== null)) {
            if (e === null) {
              if (!o) throw Error(i(318));
              if (((o = t.memoizedState), (o = o !== null ? o.dehydrated : null), !o))
                throw Error(i(317));
              o[Et] = t;
            } else (Tn(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (Be(t), (o = !1));
          } else (pt !== null && (Uu(pt), (pt = null)), (o = !0));
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0
          ? ((t.lanes = n), t)
          : ((r = r !== null),
            r !== (e !== null && e.memoizedState !== null) &&
              r &&
              ((t.child.flags |= 8192),
              (t.mode & 1) !== 0 &&
                (e === null || (we.current & 1) !== 0 ? Le === 0 && (Le = 3) : Au())),
            t.updateQueue !== null && (t.flags |= 4),
            Be(t),
            null);
      case 4:
        return (On(), _u(e, t), e === null && fr(t.stateNode.containerInfo), Be(t), null);
      case 10:
        return (eu(t.type._context), Be(t), null);
      case 17:
        return (Ke(t.type) && il(), Be(t), null);
      case 19:
        if ((me(we), (o = t.memoizedState), o === null)) return (Be(t), null);
        if (((r = (t.flags & 128) !== 0), (a = o.rendering), a === null))
          if (r) Cr(o, !1);
          else {
            if (Le !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null;) {
                if (((a = gl(e)), a !== null)) {
                  for (
                    t.flags |= 128,
                      Cr(o, !1),
                      r = a.updateQueue,
                      r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                      t.subtreeFlags = 0,
                      r = n,
                      n = t.child;
                    n !== null;
                  )
                    ((o = n),
                      (e = r),
                      (o.flags &= 14680066),
                      (a = o.alternate),
                      a === null
                        ? ((o.childLanes = 0),
                          (o.lanes = e),
                          (o.child = null),
                          (o.subtreeFlags = 0),
                          (o.memoizedProps = null),
                          (o.memoizedState = null),
                          (o.updateQueue = null),
                          (o.dependencies = null),
                          (o.stateNode = null))
                        : ((o.childLanes = a.childLanes),
                          (o.lanes = a.lanes),
                          (o.child = a.child),
                          (o.subtreeFlags = 0),
                          (o.deletions = null),
                          (o.memoizedProps = a.memoizedProps),
                          (o.memoizedState = a.memoizedState),
                          (o.updateQueue = a.updateQueue),
                          (o.type = a.type),
                          (e = a.dependencies),
                          (o.dependencies =
                            e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
                      (n = n.sibling));
                  return (pe(we, (we.current & 1) | 2), t.child);
                }
                e = e.sibling;
              }
            o.tail !== null &&
              xe() > jn &&
              ((t.flags |= 128), (r = !0), Cr(o, !1), (t.lanes = 4194304));
          }
        else {
          if (!r)
            if (((e = gl(a)), e !== null)) {
              if (
                ((t.flags |= 128),
                (r = !0),
                (n = e.updateQueue),
                n !== null && ((t.updateQueue = n), (t.flags |= 4)),
                Cr(o, !0),
                o.tail === null && o.tailMode === 'hidden' && !a.alternate && !ye)
              )
                return (Be(t), null);
            } else
              2 * xe() - o.renderingStartTime > jn &&
                n !== 1073741824 &&
                ((t.flags |= 128), (r = !0), Cr(o, !1), (t.lanes = 4194304));
          o.isBackwards
            ? ((a.sibling = t.child), (t.child = a))
            : ((n = o.last), n !== null ? (n.sibling = a) : (t.child = a), (o.last = a));
        }
        return o.tail !== null
          ? ((t = o.tail),
            (o.rendering = t),
            (o.tail = t.sibling),
            (o.renderingStartTime = xe()),
            (t.sibling = null),
            (n = we.current),
            pe(we, r ? (n & 1) | 2 : n & 1),
            t)
          : (Be(t), null);
      case 22:
      case 23:
        return (
          $u(),
          (r = t.memoizedState !== null),
          e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
          r && (t.mode & 1) !== 0
            ? (tt & 1073741824) !== 0 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : Be(t),
          null
        );
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(i(156, t.tag));
  }
  function Wd(e, t) {
    switch ((Go(t), t.tag)) {
      case 1:
        return (
          Ke(t.type) && il(),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 3:
        return (
          On(),
          me(Qe),
          me($e),
          iu(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 5:
        return (ou(t), null);
      case 13:
        if ((me(we), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(i(340));
          Tn();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (me(we), null);
      case 4:
        return (On(), null);
      case 10:
        return (eu(t.type._context), null);
      case 22:
      case 23:
        return ($u(), null);
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Pl = !1,
    He = !1,
    Vd = typeof WeakSet == 'function' ? WeakSet : Set,
    W = null;
  function Mn(e, t) {
    var n = e.ref;
    if (n !== null)
      if (typeof n == 'function')
        try {
          n(null);
        } catch (r) {
          Ee(e, t, r);
        }
      else n.current = null;
  }
  function Pu(e, t, n) {
    try {
      n();
    } catch (r) {
      Ee(e, t, r);
    }
  }
  var Ks = !1;
  function Qd(e, t) {
    if ((($o = Yr), (e = xa()), zo(e))) {
      if ('selectionStart' in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          n = ((n = e.ownerDocument) && n.defaultView) || window;
          var r = n.getSelection && n.getSelection();
          if (r && r.rangeCount !== 0) {
            n = r.anchorNode;
            var l = r.anchorOffset,
              o = r.focusNode;
            r = r.focusOffset;
            try {
              (n.nodeType, o.nodeType);
            } catch {
              n = null;
              break e;
            }
            var a = 0,
              d = -1,
              h = -1,
              x = 0,
              O = 0,
              F = e,
              D = null;
            t: for (;;) {
              for (
                var H;
                F !== n || (l !== 0 && F.nodeType !== 3) || (d = a + l),
                  F !== o || (r !== 0 && F.nodeType !== 3) || (h = a + r),
                  F.nodeType === 3 && (a += F.nodeValue.length),
                  (H = F.firstChild) !== null;
              )
                ((D = F), (F = H));
              for (;;) {
                if (F === e) break t;
                if (
                  (D === n && ++x === l && (d = a),
                  D === o && ++O === r && (h = a),
                  (H = F.nextSibling) !== null)
                )
                  break;
                ((F = D), (D = F.parentNode));
              }
              F = H;
            }
            n = d === -1 || h === -1 ? null : { start: d, end: h };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Ao = { focusedElem: e, selectionRange: n }, Yr = !1, W = t; W !== null;)
      if (((t = W), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (W = e));
      else
        for (; W !== null;) {
          t = W;
          try {
            var Q = t.alternate;
            if ((t.flags & 1024) !== 0)
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (Q !== null) {
                    var K = Q.memoizedProps,
                      Re = Q.memoizedState,
                      w = t.stateNode,
                      m = w.getSnapshotBeforeUpdate(
                        t.elementType === t.type ? K : ht(t.type, K),
                        Re,
                      );
                    w.__reactInternalSnapshotBeforeUpdate = m;
                  }
                  break;
                case 3:
                  var k = t.stateNode.containerInfo;
                  k.nodeType === 1
                    ? (k.textContent = '')
                    : k.nodeType === 9 && k.documentElement && k.removeChild(k.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(i(163));
              }
          } catch ($) {
            Ee(t, t.return, $);
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (W = e));
            break;
          }
          W = t.return;
        }
    return ((Q = Ks), (Ks = !1), Q);
  }
  function xr(e, t, n) {
    var r = t.updateQueue;
    if (((r = r !== null ? r.lastEffect : null), r !== null)) {
      var l = (r = r.next);
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          ((l.destroy = void 0), o !== void 0 && Pu(t, n, o));
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Ll(e, t) {
    if (((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)) {
      var n = (t = t.next);
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function Lu(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == 'function' ? t(e) : (t.current = e);
    }
  }
  function Ys(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), Ys(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 &&
        ((t = e.stateNode),
        t !== null && (delete t[Et], delete t[pr], delete t[Vo], delete t[Pd], delete t[Ld])),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  function Gs(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Xs(e) {
    e: for (;;) {
      for (; e.sibling === null;) {
        if (e.return === null || Gs(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Nu(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
      ((e = e.stateNode),
        t
          ? n.nodeType === 8
            ? n.parentNode.insertBefore(e, t)
            : n.insertBefore(e, t)
          : (n.nodeType === 8
              ? ((t = n.parentNode), t.insertBefore(e, n))
              : ((t = n), t.appendChild(e)),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = ol)));
    else if (r !== 4 && ((e = e.child), e !== null))
      for (Nu(e, t, n), e = e.sibling; e !== null;) (Nu(e, t, n), (e = e.sibling));
  }
  function Tu(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
    else if (r !== 4 && ((e = e.child), e !== null))
      for (Tu(e, t, n), e = e.sibling; e !== null;) (Tu(e, t, n), (e = e.sibling));
  }
  var Fe = null,
    mt = !1;
  function Yt(e, t, n) {
    for (n = n.child; n !== null;) (Js(e, t, n), (n = n.sibling));
  }
  function Js(e, t, n) {
    if (kt && typeof kt.onCommitFiberUnmount == 'function')
      try {
        kt.onCommitFiberUnmount(Br, n);
      } catch {}
    switch (n.tag) {
      case 5:
        He || Mn(n, t);
      case 6:
        var r = Fe,
          l = mt;
        ((Fe = null),
          Yt(e, t, n),
          (Fe = r),
          (mt = l),
          Fe !== null &&
            (mt
              ? ((e = Fe),
                (n = n.stateNode),
                e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
              : Fe.removeChild(n.stateNode)));
        break;
      case 18:
        Fe !== null &&
          (mt
            ? ((e = Fe),
              (n = n.stateNode),
              e.nodeType === 8 ? Wo(e.parentNode, n) : e.nodeType === 1 && Wo(e, n),
              nr(e))
            : Wo(Fe, n.stateNode));
        break;
      case 4:
        ((r = Fe),
          (l = mt),
          (Fe = n.stateNode.containerInfo),
          (mt = !0),
          Yt(e, t, n),
          (Fe = r),
          (mt = l));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!He && ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))) {
          l = r = r.next;
          do {
            var o = l,
              a = o.destroy;
            ((o = o.tag),
              a !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && Pu(n, t, a),
              (l = l.next));
          } while (l !== r);
        }
        Yt(e, t, n);
        break;
      case 1:
        if (!He && (Mn(n, t), (r = n.stateNode), typeof r.componentWillUnmount == 'function'))
          try {
            ((r.props = n.memoizedProps), (r.state = n.memoizedState), r.componentWillUnmount());
          } catch (d) {
            Ee(n, t, d);
          }
        Yt(e, t, n);
        break;
      case 21:
        Yt(e, t, n);
        break;
      case 22:
        n.mode & 1
          ? ((He = (r = He) || n.memoizedState !== null), Yt(e, t, n), (He = r))
          : Yt(e, t, n);
        break;
      default:
        Yt(e, t, n);
    }
  }
  function Zs(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      (n === null && (n = e.stateNode = new Vd()),
        t.forEach(function (r) {
          var l = ep.bind(null, e, r);
          n.has(r) || (n.add(r), r.then(l, l));
        }));
    }
  }
  function vt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var r = 0; r < n.length; r++) {
        var l = n[r];
        try {
          var o = e,
            a = t,
            d = a;
          e: for (; d !== null;) {
            switch (d.tag) {
              case 5:
                ((Fe = d.stateNode), (mt = !1));
                break e;
              case 3:
                ((Fe = d.stateNode.containerInfo), (mt = !0));
                break e;
              case 4:
                ((Fe = d.stateNode.containerInfo), (mt = !0));
                break e;
            }
            d = d.return;
          }
          if (Fe === null) throw Error(i(160));
          (Js(o, a, l), (Fe = null), (mt = !1));
          var h = l.alternate;
          (h !== null && (h.return = null), (l.return = null));
        } catch (x) {
          Ee(l, t, x);
        }
      }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null;) (qs(t, e), (t = t.sibling));
  }
  function qs(e, t) {
    var n = e.alternate,
      r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((vt(t, e), Rt(e), r & 4)) {
          try {
            (xr(3, e, e.return), Ll(3, e));
          } catch (K) {
            Ee(e, e.return, K);
          }
          try {
            xr(5, e, e.return);
          } catch (K) {
            Ee(e, e.return, K);
          }
        }
        break;
      case 1:
        (vt(t, e), Rt(e), r & 512 && n !== null && Mn(n, n.return));
        break;
      case 5:
        if ((vt(t, e), Rt(e), r & 512 && n !== null && Mn(n, n.return), e.flags & 32)) {
          var l = e.stateNode;
          try {
            Qn(l, '');
          } catch (K) {
            Ee(e, e.return, K);
          }
        }
        if (r & 4 && ((l = e.stateNode), l != null)) {
          var o = e.memoizedProps,
            a = n !== null ? n.memoizedProps : o,
            d = e.type,
            h = e.updateQueue;
          if (((e.updateQueue = null), h !== null))
            try {
              (d === 'input' && o.type === 'radio' && o.name != null && _i(l, o), uo(d, a));
              var x = uo(d, o);
              for (a = 0; a < h.length; a += 2) {
                var O = h[a],
                  F = h[a + 1];
                O === 'style'
                  ? Oi(l, F)
                  : O === 'dangerouslySetInnerHTML'
                    ? Ii(l, F)
                    : O === 'children'
                      ? Qn(l, F)
                      : V(l, O, F, x);
              }
              switch (d) {
                case 'input':
                  to(l, o);
                  break;
                case 'textarea':
                  Ni(l, o);
                  break;
                case 'select':
                  var D = l._wrapperState.wasMultiple;
                  l._wrapperState.wasMultiple = !!o.multiple;
                  var H = o.value;
                  H != null
                    ? mn(l, !!o.multiple, H, !1)
                    : D !== !!o.multiple &&
                      (o.defaultValue != null
                        ? mn(l, !!o.multiple, o.defaultValue, !0)
                        : mn(l, !!o.multiple, o.multiple ? [] : '', !1));
              }
              l[pr] = o;
            } catch (K) {
              Ee(e, e.return, K);
            }
        }
        break;
      case 6:
        if ((vt(t, e), Rt(e), r & 4)) {
          if (e.stateNode === null) throw Error(i(162));
          ((l = e.stateNode), (o = e.memoizedProps));
          try {
            l.nodeValue = o;
          } catch (K) {
            Ee(e, e.return, K);
          }
        }
        break;
      case 3:
        if ((vt(t, e), Rt(e), r & 4 && n !== null && n.memoizedState.isDehydrated))
          try {
            nr(t.containerInfo);
          } catch (K) {
            Ee(e, e.return, K);
          }
        break;
      case 4:
        (vt(t, e), Rt(e));
        break;
      case 13:
        (vt(t, e),
          Rt(e),
          (l = e.child),
          l.flags & 8192 &&
            ((o = l.memoizedState !== null),
            (l.stateNode.isHidden = o),
            !o || (l.alternate !== null && l.alternate.memoizedState !== null) || (Du = xe())),
          r & 4 && Zs(e));
        break;
      case 22:
        if (
          ((O = n !== null && n.memoizedState !== null),
          e.mode & 1 ? ((He = (x = He) || O), vt(t, e), (He = x)) : vt(t, e),
          Rt(e),
          r & 8192)
        ) {
          if (
            ((x = e.memoizedState !== null), (e.stateNode.isHidden = x) && !O && (e.mode & 1) !== 0)
          )
            for (W = e, O = e.child; O !== null;) {
              for (F = W = O; W !== null;) {
                switch (((D = W), (H = D.child), D.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    xr(4, D, D.return);
                    break;
                  case 1:
                    Mn(D, D.return);
                    var Q = D.stateNode;
                    if (typeof Q.componentWillUnmount == 'function') {
                      ((r = D), (n = D.return));
                      try {
                        ((t = r),
                          (Q.props = t.memoizedProps),
                          (Q.state = t.memoizedState),
                          Q.componentWillUnmount());
                      } catch (K) {
                        Ee(r, n, K);
                      }
                    }
                    break;
                  case 5:
                    Mn(D, D.return);
                    break;
                  case 22:
                    if (D.memoizedState !== null) {
                      tc(F);
                      continue;
                    }
                }
                H !== null ? ((H.return = D), (W = H)) : tc(F);
              }
              O = O.sibling;
            }
          e: for (O = null, F = e; ;) {
            if (F.tag === 5) {
              if (O === null) {
                O = F;
                try {
                  ((l = F.stateNode),
                    x
                      ? ((o = l.style),
                        typeof o.setProperty == 'function'
                          ? o.setProperty('display', 'none', 'important')
                          : (o.display = 'none'))
                      : ((d = F.stateNode),
                        (h = F.memoizedProps.style),
                        (a = h != null && h.hasOwnProperty('display') ? h.display : null),
                        (d.style.display = Di('display', a))));
                } catch (K) {
                  Ee(e, e.return, K);
                }
              }
            } else if (F.tag === 6) {
              if (O === null)
                try {
                  F.stateNode.nodeValue = x ? '' : F.memoizedProps;
                } catch (K) {
                  Ee(e, e.return, K);
                }
            } else if (
              ((F.tag !== 22 && F.tag !== 23) || F.memoizedState === null || F === e) &&
              F.child !== null
            ) {
              ((F.child.return = F), (F = F.child));
              continue;
            }
            if (F === e) break e;
            for (; F.sibling === null;) {
              if (F.return === null || F.return === e) break e;
              (O === F && (O = null), (F = F.return));
            }
            (O === F && (O = null), (F.sibling.return = F.return), (F = F.sibling));
          }
        }
        break;
      case 19:
        (vt(t, e), Rt(e), r & 4 && Zs(e));
        break;
      case 21:
        break;
      default:
        (vt(t, e), Rt(e));
    }
  }
  function Rt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null;) {
            if (Gs(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(i(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Qn(l, ''), (r.flags &= -33));
            var o = Xs(e);
            Tu(e, o, l);
            break;
          case 3:
          case 4:
            var a = r.stateNode.containerInfo,
              d = Xs(e);
            Nu(e, d, a);
            break;
          default:
            throw Error(i(161));
        }
      } catch (h) {
        Ee(e, e.return, h);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Kd(e, t, n) {
    ((W = e), bs(e));
  }
  function bs(e, t, n) {
    for (var r = (e.mode & 1) !== 0; W !== null;) {
      var l = W,
        o = l.child;
      if (l.tag === 22 && r) {
        var a = l.memoizedState !== null || Pl;
        if (!a) {
          var d = l.alternate,
            h = (d !== null && d.memoizedState !== null) || He;
          d = Pl;
          var x = He;
          if (((Pl = a), (He = h) && !x))
            for (W = l; W !== null;)
              ((a = W),
                (h = a.child),
                a.tag === 22 && a.memoizedState !== null
                  ? nc(l)
                  : h !== null
                    ? ((h.return = a), (W = h))
                    : nc(l));
          for (; o !== null;) ((W = o), bs(o), (o = o.sibling));
          ((W = l), (Pl = d), (He = x));
        }
        ec(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? ((o.return = l), (W = o)) : ec(e);
    }
  }
  function ec(e) {
    for (; W !== null;) {
      var t = W;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                He || Ll(5, t);
                break;
              case 1:
                var r = t.stateNode;
                if (t.flags & 4 && !He)
                  if (n === null) r.componentDidMount();
                  else {
                    var l =
                      t.elementType === t.type ? n.memoizedProps : ht(t.type, n.memoizedProps);
                    r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                  }
                var o = t.updateQueue;
                o !== null && ts(t, o, r);
                break;
              case 3:
                var a = t.updateQueue;
                if (a !== null) {
                  if (((n = null), t.child !== null))
                    switch (t.child.tag) {
                      case 5:
                        n = t.child.stateNode;
                        break;
                      case 1:
                        n = t.child.stateNode;
                    }
                  ts(t, a, n);
                }
                break;
              case 5:
                var d = t.stateNode;
                if (n === null && t.flags & 4) {
                  n = d;
                  var h = t.memoizedProps;
                  switch (t.type) {
                    case 'button':
                    case 'input':
                    case 'select':
                    case 'textarea':
                      h.autoFocus && n.focus();
                      break;
                    case 'img':
                      h.src && (n.src = h.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (t.memoizedState === null) {
                  var x = t.alternate;
                  if (x !== null) {
                    var O = x.memoizedState;
                    if (O !== null) {
                      var F = O.dehydrated;
                      F !== null && nr(F);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(i(163));
            }
          He || (t.flags & 512 && Lu(t));
        } catch (D) {
          Ee(t, t.return, D);
        }
      }
      if (t === e) {
        W = null;
        break;
      }
      if (((n = t.sibling), n !== null)) {
        ((n.return = t.return), (W = n));
        break;
      }
      W = t.return;
    }
  }
  function tc(e) {
    for (; W !== null;) {
      var t = W;
      if (t === e) {
        W = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        ((n.return = t.return), (W = n));
        break;
      }
      W = t.return;
    }
  }
  function nc(e) {
    for (; W !== null;) {
      var t = W;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Ll(4, t);
            } catch (h) {
              Ee(t, n, h);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == 'function') {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (h) {
                Ee(t, l, h);
              }
            }
            var o = t.return;
            try {
              Lu(t);
            } catch (h) {
              Ee(t, o, h);
            }
            break;
          case 5:
            var a = t.return;
            try {
              Lu(t);
            } catch (h) {
              Ee(t, a, h);
            }
        }
      } catch (h) {
        Ee(t, t.return, h);
      }
      if (t === e) {
        W = null;
        break;
      }
      var d = t.sibling;
      if (d !== null) {
        ((d.return = t.return), (W = d));
        break;
      }
      W = t.return;
    }
  }
  var Yd = Math.ceil,
    Nl = b.ReactCurrentDispatcher,
    zu = b.ReactCurrentOwner,
    at = b.ReactCurrentBatchConfig,
    ue = 0,
    ze = null,
    _e = null,
    Me = 0,
    tt = 0,
    Un = Ht(0),
    Le = 0,
    Rr = null,
    sn = 0,
    Tl = 0,
    Iu = 0,
    _r = null,
    Ge = null,
    Du = 0,
    jn = 1 / 0,
    Dt = null,
    zl = !1,
    Ou = null,
    Gt = null,
    Il = !1,
    Xt = null,
    Dl = 0,
    Pr = 0,
    Fu = null,
    Ol = -1,
    Fl = 0;
  function Ve() {
    return (ue & 6) !== 0 ? xe() : Ol !== -1 ? Ol : (Ol = xe());
  }
  function Jt(e) {
    return (e.mode & 1) === 0
      ? 1
      : (ue & 2) !== 0 && Me !== 0
        ? Me & -Me
        : Td.transition !== null
          ? (Fl === 0 && (Fl = Xi()), Fl)
          : ((e = ce), e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : la(e.type))), e);
  }
  function yt(e, t, n, r) {
    if (50 < Pr) throw ((Pr = 0), (Fu = null), Error(i(185)));
    (Zn(e, n, r),
      ((ue & 2) === 0 || e !== ze) &&
        (e === ze && ((ue & 2) === 0 && (Tl |= n), Le === 4 && Zt(e, Me)),
        Xe(e, r),
        n === 1 && ue === 0 && (t.mode & 1) === 0 && ((jn = xe() + 500), sl && Vt())));
  }
  function Xe(e, t) {
    var n = e.callbackNode;
    Tf(e, t);
    var r = Vr(e, e === ze ? Me : 0);
    if (r === 0) (n !== null && Ki(n), (e.callbackNode = null), (e.callbackPriority = 0));
    else if (((t = r & -r), e.callbackPriority !== t)) {
      if ((n != null && Ki(n), t === 1))
        (e.tag === 0 ? Nd(lc.bind(null, e)) : Wa(lc.bind(null, e)),
          Rd(function () {
            (ue & 6) === 0 && Vt();
          }),
          (n = null));
      else {
        switch (Ji(r)) {
          case 1:
            n = ho;
            break;
          case 4:
            n = Yi;
            break;
          case 16:
            n = Ar;
            break;
          case 536870912:
            n = Gi;
            break;
          default:
            n = Ar;
        }
        n = dc(n, rc.bind(null, e));
      }
      ((e.callbackPriority = t), (e.callbackNode = n));
    }
  }
  function rc(e, t) {
    if (((Ol = -1), (Fl = 0), (ue & 6) !== 0)) throw Error(i(327));
    var n = e.callbackNode;
    if ($n() && e.callbackNode !== n) return null;
    var r = Vr(e, e === ze ? Me : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ml(e, r);
    else {
      t = r;
      var l = ue;
      ue |= 2;
      var o = uc();
      (ze !== e || Me !== t) && ((Dt = null), (jn = xe() + 500), fn(e, t));
      do
        try {
          Jd();
          break;
        } catch (d) {
          oc(e, d);
        }
      while (!0);
      (bo(), (Nl.current = o), (ue = l), _e !== null ? (t = 0) : ((ze = null), (Me = 0), (t = Le)));
    }
    if (t !== 0) {
      if ((t === 2 && ((l = mo(e)), l !== 0 && ((r = l), (t = Mu(e, l)))), t === 1))
        throw ((n = Rr), fn(e, 0), Zt(e, r), Xe(e, xe()), n);
      if (t === 6) Zt(e, r);
      else {
        if (
          ((l = e.current.alternate),
          (r & 30) === 0 &&
            !Gd(l) &&
            ((t = Ml(e, r)),
            t === 2 && ((o = mo(e)), o !== 0 && ((r = o), (t = Mu(e, o)))),
            t === 1))
        )
          throw ((n = Rr), fn(e, 0), Zt(e, r), Xe(e, xe()), n);
        switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
          case 0:
          case 1:
            throw Error(i(345));
          case 2:
            dn(e, Ge, Dt);
            break;
          case 3:
            if ((Zt(e, r), (r & 130023424) === r && ((t = Du + 500 - xe()), 10 < t))) {
              if (Vr(e, 0) !== 0) break;
              if (((l = e.suspendedLanes), (l & r) !== r)) {
                (Ve(), (e.pingedLanes |= e.suspendedLanes & l));
                break;
              }
              e.timeoutHandle = Ho(dn.bind(null, e, Ge, Dt), t);
              break;
            }
            dn(e, Ge, Dt);
            break;
          case 4:
            if ((Zt(e, r), (r & 4194240) === r)) break;
            for (t = e.eventTimes, l = -1; 0 < r;) {
              var a = 31 - ft(r);
              ((o = 1 << a), (a = t[a]), a > l && (l = a), (r &= ~o));
            }
            if (
              ((r = l),
              (r = xe() - r),
              (r =
                (120 > r
                  ? 120
                  : 480 > r
                    ? 480
                    : 1080 > r
                      ? 1080
                      : 1920 > r
                        ? 1920
                        : 3e3 > r
                          ? 3e3
                          : 4320 > r
                            ? 4320
                            : 1960 * Yd(r / 1960)) - r),
              10 < r)
            ) {
              e.timeoutHandle = Ho(dn.bind(null, e, Ge, Dt), r);
              break;
            }
            dn(e, Ge, Dt);
            break;
          case 5:
            dn(e, Ge, Dt);
            break;
          default:
            throw Error(i(329));
        }
      }
    }
    return (Xe(e, xe()), e.callbackNode === n ? rc.bind(null, e) : null);
  }
  function Mu(e, t) {
    var n = _r;
    return (
      e.current.memoizedState.isDehydrated && (fn(e, t).flags |= 256),
      (e = Ml(e, t)),
      e !== 2 && ((t = Ge), (Ge = n), t !== null && Uu(t)),
      e
    );
  }
  function Uu(e) {
    Ge === null ? (Ge = e) : Ge.push.apply(Ge, e);
  }
  function Gd(e) {
    for (var t = e; ;) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && ((n = n.stores), n !== null))
          for (var r = 0; r < n.length; r++) {
            var l = n[r],
              o = l.getSnapshot;
            l = l.value;
            try {
              if (!dt(o(), l)) return !1;
            } catch {
              return !1;
            }
          }
      }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function Zt(e, t) {
    for (
      t &= ~Iu, t &= ~Tl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes;
      0 < t;
    ) {
      var n = 31 - ft(t),
        r = 1 << n;
      ((e[n] = -1), (t &= ~r));
    }
  }
  function lc(e) {
    if ((ue & 6) !== 0) throw Error(i(327));
    $n();
    var t = Vr(e, 0);
    if ((t & 1) === 0) return (Xe(e, xe()), null);
    var n = Ml(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = mo(e);
      r !== 0 && ((t = r), (n = Mu(e, r)));
    }
    if (n === 1) throw ((n = Rr), fn(e, 0), Zt(e, t), Xe(e, xe()), n);
    if (n === 6) throw Error(i(345));
    return (
      (e.finishedWork = e.current.alternate),
      (e.finishedLanes = t),
      dn(e, Ge, Dt),
      Xe(e, xe()),
      null
    );
  }
  function ju(e, t) {
    var n = ue;
    ue |= 1;
    try {
      return e(t);
    } finally {
      ((ue = n), ue === 0 && ((jn = xe() + 500), sl && Vt()));
    }
  }
  function cn(e) {
    Xt !== null && Xt.tag === 0 && (ue & 6) === 0 && $n();
    var t = ue;
    ue |= 1;
    var n = at.transition,
      r = ce;
    try {
      if (((at.transition = null), (ce = 1), e)) return e();
    } finally {
      ((ce = r), (at.transition = n), (ue = t), (ue & 6) === 0 && Vt());
    }
  }
  function $u() {
    ((tt = Un.current), me(Un));
  }
  function fn(e, t) {
    ((e.finishedWork = null), (e.finishedLanes = 0));
    var n = e.timeoutHandle;
    if ((n !== -1 && ((e.timeoutHandle = -1), xd(n)), _e !== null))
      for (n = _e.return; n !== null;) {
        var r = n;
        switch ((Go(r), r.tag)) {
          case 1:
            ((r = r.type.childContextTypes), r != null && il());
            break;
          case 3:
            (On(), me(Qe), me($e), iu());
            break;
          case 5:
            ou(r);
            break;
          case 4:
            On();
            break;
          case 13:
            me(we);
            break;
          case 19:
            me(we);
            break;
          case 10:
            eu(r.type._context);
            break;
          case 22:
          case 23:
            $u();
        }
        n = n.return;
      }
    if (
      ((ze = e),
      (_e = e = qt(e.current, null)),
      (Me = tt = t),
      (Le = 0),
      (Rr = null),
      (Iu = Tl = sn = 0),
      (Ge = _r = null),
      on !== null)
    ) {
      for (t = 0; t < on.length; t++)
        if (((n = on[t]), (r = n.interleaved), r !== null)) {
          n.interleaved = null;
          var l = r.next,
            o = n.pending;
          if (o !== null) {
            var a = o.next;
            ((o.next = l), (r.next = a));
          }
          n.pending = r;
        }
      on = null;
    }
    return e;
  }
  function oc(e, t) {
    do {
      var n = _e;
      try {
        if ((bo(), (wl.current = Cl), Sl)) {
          for (var r = Se.memoizedState; r !== null;) {
            var l = r.queue;
            (l !== null && (l.pending = null), (r = r.next));
          }
          Sl = !1;
        }
        if (
          ((an = 0),
          (Te = Pe = Se = null),
          (wr = !1),
          (Sr = 0),
          (zu.current = null),
          n === null || n.return === null)
        ) {
          ((Le = 1), (Rr = t), (_e = null));
          break;
        }
        e: {
          var o = e,
            a = n.return,
            d = n,
            h = t;
          if (
            ((t = Me),
            (d.flags |= 32768),
            h !== null && typeof h == 'object' && typeof h.then == 'function')
          ) {
            var x = h,
              O = d,
              F = O.tag;
            if ((O.mode & 1) === 0 && (F === 0 || F === 11 || F === 15)) {
              var D = O.alternate;
              D
                ? ((O.updateQueue = D.updateQueue),
                  (O.memoizedState = D.memoizedState),
                  (O.lanes = D.lanes))
                : ((O.updateQueue = null), (O.memoizedState = null));
            }
            var H = Ts(a);
            if (H !== null) {
              ((H.flags &= -257), zs(H, a, d, o, t), H.mode & 1 && Ns(o, x, t), (t = H), (h = x));
              var Q = t.updateQueue;
              if (Q === null) {
                var K = new Set();
                (K.add(h), (t.updateQueue = K));
              } else Q.add(h);
              break e;
            } else {
              if ((t & 1) === 0) {
                (Ns(o, x, t), Au());
                break e;
              }
              h = Error(i(426));
            }
          } else if (ye && d.mode & 1) {
            var Re = Ts(a);
            if (Re !== null) {
              ((Re.flags & 65536) === 0 && (Re.flags |= 256), zs(Re, a, d, o, t), Zo(Fn(h, d)));
              break e;
            }
          }
          ((o = h = Fn(h, d)),
            Le !== 4 && (Le = 2),
            _r === null ? (_r = [o]) : _r.push(o),
            (o = a));
          do {
            switch (o.tag) {
              case 3:
                ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
                var w = Ps(o, h, t);
                es(o, w);
                break e;
              case 1:
                d = h;
                var m = o.type,
                  k = o.stateNode;
                if (
                  (o.flags & 128) === 0 &&
                  (typeof m.getDerivedStateFromError == 'function' ||
                    (k !== null &&
                      typeof k.componentDidCatch == 'function' &&
                      (Gt === null || !Gt.has(k))))
                ) {
                  ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
                  var $ = Ls(o, d, t);
                  es(o, $);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        ac(n);
      } catch (Y) {
        ((t = Y), _e === n && n !== null && (_e = n = n.return));
        continue;
      }
      break;
    } while (!0);
  }
  function uc() {
    var e = Nl.current;
    return ((Nl.current = Cl), e === null ? Cl : e);
  }
  function Au() {
    ((Le === 0 || Le === 3 || Le === 2) && (Le = 4),
      ze === null || ((sn & 268435455) === 0 && (Tl & 268435455) === 0) || Zt(ze, Me));
  }
  function Ml(e, t) {
    var n = ue;
    ue |= 2;
    var r = uc();
    (ze !== e || Me !== t) && ((Dt = null), fn(e, t));
    do
      try {
        Xd();
        break;
      } catch (l) {
        oc(e, l);
      }
    while (!0);
    if ((bo(), (ue = n), (Nl.current = r), _e !== null)) throw Error(i(261));
    return ((ze = null), (Me = 0), Le);
  }
  function Xd() {
    for (; _e !== null;) ic(_e);
  }
  function Jd() {
    for (; _e !== null && !kf();) ic(_e);
  }
  function ic(e) {
    var t = fc(e.alternate, e, tt);
    ((e.memoizedProps = e.pendingProps), t === null ? ac(e) : (_e = t), (zu.current = null));
  }
  function ac(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (((e = t.return), (t.flags & 32768) === 0)) {
        if (((n = Hd(n, t, tt)), n !== null)) {
          _e = n;
          return;
        }
      } else {
        if (((n = Wd(n, t)), n !== null)) {
          ((n.flags &= 32767), (_e = n));
          return;
        }
        if (e !== null) ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
        else {
          ((Le = 6), (_e = null));
          return;
        }
      }
      if (((t = t.sibling), t !== null)) {
        _e = t;
        return;
      }
      _e = t = e;
    } while (t !== null);
    Le === 0 && (Le = 5);
  }
  function dn(e, t, n) {
    var r = ce,
      l = at.transition;
    try {
      ((at.transition = null), (ce = 1), Zd(e, t, n, r));
    } finally {
      ((at.transition = l), (ce = r));
    }
    return null;
  }
  function Zd(e, t, n, r) {
    do $n();
    while (Xt !== null);
    if ((ue & 6) !== 0) throw Error(i(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current)) throw Error(i(177));
    ((e.callbackNode = null), (e.callbackPriority = 0));
    var o = n.lanes | n.childLanes;
    if (
      (zf(e, o),
      e === ze && ((_e = ze = null), (Me = 0)),
      ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
        Il ||
        ((Il = !0),
        dc(Ar, function () {
          return ($n(), null);
        })),
      (o = (n.flags & 15990) !== 0),
      (n.subtreeFlags & 15990) !== 0 || o)
    ) {
      ((o = at.transition), (at.transition = null));
      var a = ce;
      ce = 1;
      var d = ue;
      ((ue |= 4),
        (zu.current = null),
        Qd(e, n),
        qs(n, e),
        yd(Ao),
        (Yr = !!$o),
        (Ao = $o = null),
        (e.current = n),
        Kd(n),
        Ef(),
        (ue = d),
        (ce = a),
        (at.transition = o));
    } else e.current = n;
    if (
      (Il && ((Il = !1), (Xt = e), (Dl = l)),
      (o = e.pendingLanes),
      o === 0 && (Gt = null),
      Rf(n.stateNode),
      Xe(e, xe()),
      t !== null)
    )
      for (r = e.onRecoverableError, n = 0; n < t.length; n++)
        ((l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest }));
    if (zl) throw ((zl = !1), (e = Ou), (Ou = null), e);
    return (
      (Dl & 1) !== 0 && e.tag !== 0 && $n(),
      (o = e.pendingLanes),
      (o & 1) !== 0 ? (e === Fu ? Pr++ : ((Pr = 0), (Fu = e))) : (Pr = 0),
      Vt(),
      null
    );
  }
  function $n() {
    if (Xt !== null) {
      var e = Ji(Dl),
        t = at.transition,
        n = ce;
      try {
        if (((at.transition = null), (ce = 16 > e ? 16 : e), Xt === null)) var r = !1;
        else {
          if (((e = Xt), (Xt = null), (Dl = 0), (ue & 6) !== 0)) throw Error(i(331));
          var l = ue;
          for (ue |= 4, W = e.current; W !== null;) {
            var o = W,
              a = o.child;
            if ((W.flags & 16) !== 0) {
              var d = o.deletions;
              if (d !== null) {
                for (var h = 0; h < d.length; h++) {
                  var x = d[h];
                  for (W = x; W !== null;) {
                    var O = W;
                    switch (O.tag) {
                      case 0:
                      case 11:
                      case 15:
                        xr(8, O, o);
                    }
                    var F = O.child;
                    if (F !== null) ((F.return = O), (W = F));
                    else
                      for (; W !== null;) {
                        O = W;
                        var D = O.sibling,
                          H = O.return;
                        if ((Ys(O), O === x)) {
                          W = null;
                          break;
                        }
                        if (D !== null) {
                          ((D.return = H), (W = D));
                          break;
                        }
                        W = H;
                      }
                  }
                }
                var Q = o.alternate;
                if (Q !== null) {
                  var K = Q.child;
                  if (K !== null) {
                    Q.child = null;
                    do {
                      var Re = K.sibling;
                      ((K.sibling = null), (K = Re));
                    } while (K !== null);
                  }
                }
                W = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && a !== null) ((a.return = o), (W = a));
            else
              e: for (; W !== null;) {
                if (((o = W), (o.flags & 2048) !== 0))
                  switch (o.tag) {
                    case 0:
                    case 11:
                    case 15:
                      xr(9, o, o.return);
                  }
                var w = o.sibling;
                if (w !== null) {
                  ((w.return = o.return), (W = w));
                  break e;
                }
                W = o.return;
              }
          }
          var m = e.current;
          for (W = m; W !== null;) {
            a = W;
            var k = a.child;
            if ((a.subtreeFlags & 2064) !== 0 && k !== null) ((k.return = a), (W = k));
            else
              e: for (a = m; W !== null;) {
                if (((d = W), (d.flags & 2048) !== 0))
                  try {
                    switch (d.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ll(9, d);
                    }
                  } catch (Y) {
                    Ee(d, d.return, Y);
                  }
                if (d === a) {
                  W = null;
                  break e;
                }
                var $ = d.sibling;
                if ($ !== null) {
                  (($.return = d.return), (W = $));
                  break e;
                }
                W = d.return;
              }
          }
          if (((ue = l), Vt(), kt && typeof kt.onPostCommitFiberRoot == 'function'))
            try {
              kt.onPostCommitFiberRoot(Br, e);
            } catch {}
          r = !0;
        }
        return r;
      } finally {
        ((ce = n), (at.transition = t));
      }
    }
    return !1;
  }
  function sc(e, t, n) {
    ((t = Fn(n, t)),
      (t = Ps(e, t, 1)),
      (e = Kt(e, t, 1)),
      (t = Ve()),
      e !== null && (Zn(e, 1, t), Xe(e, t)));
  }
  function Ee(e, t, n) {
    if (e.tag === 3) sc(e, e, n);
    else
      for (; t !== null;) {
        if (t.tag === 3) {
          sc(t, e, n);
          break;
        } else if (t.tag === 1) {
          var r = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == 'function' ||
            (typeof r.componentDidCatch == 'function' && (Gt === null || !Gt.has(r)))
          ) {
            ((e = Fn(n, e)),
              (e = Ls(t, e, 1)),
              (t = Kt(t, e, 1)),
              (e = Ve()),
              t !== null && (Zn(t, 1, e), Xe(t, e)));
            break;
          }
        }
        t = t.return;
      }
  }
  function qd(e, t, n) {
    var r = e.pingCache;
    (r !== null && r.delete(t),
      (t = Ve()),
      (e.pingedLanes |= e.suspendedLanes & n),
      ze === e &&
        (Me & n) === n &&
        (Le === 4 || (Le === 3 && (Me & 130023424) === Me && 500 > xe() - Du)
          ? fn(e, 0)
          : (Iu |= n)),
      Xe(e, t));
  }
  function cc(e, t) {
    t === 0 &&
      ((e.mode & 1) === 0
        ? (t = 1)
        : ((t = Wr), (Wr <<= 1), (Wr & 130023424) === 0 && (Wr = 4194304)));
    var n = Ve();
    ((e = Tt(e, t)), e !== null && (Zn(e, t, n), Xe(e, n)));
  }
  function bd(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), cc(e, n));
  }
  function ep(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode,
          l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(i(314));
    }
    (r !== null && r.delete(t), cc(e, n));
  }
  var fc;
  fc = function (e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps || Qe.current) Ye = !0;
      else {
        if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return ((Ye = !1), Bd(e, t, n));
        Ye = (e.flags & 131072) !== 0;
      }
    else ((Ye = !1), ye && (t.flags & 1048576) !== 0 && Va(t, fl, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 2:
        var r = t.type;
        (_l(e, t), (e = t.pendingProps));
        var l = Pn(t, $e.current);
        (Dn(t, n), (l = cu(null, t, r, e, l, n)));
        var o = fu();
        return (
          (t.flags |= 1),
          typeof l == 'object' &&
          l !== null &&
          typeof l.render == 'function' &&
          l.$$typeof === void 0
            ? ((t.tag = 1),
              (t.memoizedState = null),
              (t.updateQueue = null),
              Ke(r) ? ((o = !0), al(t)) : (o = !1),
              (t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null),
              ru(t),
              (l.updater = xl),
              (t.stateNode = l),
              (l._reactInternals = t),
              yu(t, r, e, n),
              (t = ku(null, t, r, !0, o, n)))
            : ((t.tag = 0), ye && o && Yo(t), We(null, t, l, n), (t = t.child)),
          t
        );
      case 16:
        r = t.elementType;
        e: {
          switch (
            (_l(e, t),
            (e = t.pendingProps),
            (l = r._init),
            (r = l(r._payload)),
            (t.type = r),
            (l = t.tag = np(r)),
            (e = ht(r, e)),
            l)
          ) {
            case 0:
              t = Su(null, t, r, e, n);
              break e;
            case 1:
              t = Us(null, t, r, e, n);
              break e;
            case 11:
              t = Is(null, t, r, e, n);
              break e;
            case 14:
              t = Ds(null, t, r, ht(r.type, e), n);
              break e;
          }
          throw Error(i(306, r, ''));
        }
        return t;
      case 0:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : ht(r, l)),
          Su(e, t, r, l, n)
        );
      case 1:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : ht(r, l)),
          Us(e, t, r, l, n)
        );
      case 3:
        e: {
          if ((js(t), e === null)) throw Error(i(387));
          ((r = t.pendingProps),
            (o = t.memoizedState),
            (l = o.element),
            ba(e, t),
            yl(t, r, null, n));
          var a = t.memoizedState;
          if (((r = a.element), o.isDehydrated))
            if (
              ((o = {
                element: r,
                isDehydrated: !1,
                cache: a.cache,
                pendingSuspenseBoundaries: a.pendingSuspenseBoundaries,
                transitions: a.transitions,
              }),
              (t.updateQueue.baseState = o),
              (t.memoizedState = o),
              t.flags & 256)
            ) {
              ((l = Fn(Error(i(423)), t)), (t = $s(e, t, r, n, l)));
              break e;
            } else if (r !== l) {
              ((l = Fn(Error(i(424)), t)), (t = $s(e, t, r, n, l)));
              break e;
            } else
              for (
                et = Bt(t.stateNode.containerInfo.firstChild),
                  be = t,
                  ye = !0,
                  pt = null,
                  n = Za(t, null, r, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
          else {
            if ((Tn(), r === l)) {
              t = It(e, t, n);
              break e;
            }
            We(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return (
          ns(t),
          e === null && Jo(t),
          (r = t.type),
          (l = t.pendingProps),
          (o = e !== null ? e.memoizedProps : null),
          (a = l.children),
          Bo(r, l) ? (a = null) : o !== null && Bo(r, o) && (t.flags |= 32),
          Ms(e, t),
          We(e, t, a, n),
          t.child
        );
      case 6:
        return (e === null && Jo(t), null);
      case 13:
        return As(e, t, n);
      case 4:
        return (
          lu(t, t.stateNode.containerInfo),
          (r = t.pendingProps),
          e === null ? (t.child = zn(t, null, r, n)) : We(e, t, r, n),
          t.child
        );
      case 11:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : ht(r, l)),
          Is(e, t, r, l, n)
        );
      case 7:
        return (We(e, t, t.pendingProps, n), t.child);
      case 8:
        return (We(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (We(e, t, t.pendingProps.children, n), t.child);
      case 10:
        e: {
          if (
            ((r = t.type._context),
            (l = t.pendingProps),
            (o = t.memoizedProps),
            (a = l.value),
            pe(hl, r._currentValue),
            (r._currentValue = a),
            o !== null)
          )
            if (dt(o.value, a)) {
              if (o.children === l.children && !Qe.current) {
                t = It(e, t, n);
                break e;
              }
            } else
              for (o = t.child, o !== null && (o.return = t); o !== null;) {
                var d = o.dependencies;
                if (d !== null) {
                  a = o.child;
                  for (var h = d.firstContext; h !== null;) {
                    if (h.context === r) {
                      if (o.tag === 1) {
                        ((h = zt(-1, n & -n)), (h.tag = 2));
                        var x = o.updateQueue;
                        if (x !== null) {
                          x = x.shared;
                          var O = x.pending;
                          (O === null ? (h.next = h) : ((h.next = O.next), (O.next = h)),
                            (x.pending = h));
                        }
                      }
                      ((o.lanes |= n),
                        (h = o.alternate),
                        h !== null && (h.lanes |= n),
                        tu(o.return, n, t),
                        (d.lanes |= n));
                      break;
                    }
                    h = h.next;
                  }
                } else if (o.tag === 10) a = o.type === t.type ? null : o.child;
                else if (o.tag === 18) {
                  if (((a = o.return), a === null)) throw Error(i(341));
                  ((a.lanes |= n),
                    (d = a.alternate),
                    d !== null && (d.lanes |= n),
                    tu(a, n, t),
                    (a = o.sibling));
                } else a = o.child;
                if (a !== null) a.return = o;
                else
                  for (a = o; a !== null;) {
                    if (a === t) {
                      a = null;
                      break;
                    }
                    if (((o = a.sibling), o !== null)) {
                      ((o.return = a.return), (a = o));
                      break;
                    }
                    a = a.return;
                  }
                o = a;
              }
          (We(e, t, l.children, n), (t = t.child));
        }
        return t;
      case 9:
        return (
          (l = t.type),
          (r = t.pendingProps.children),
          Dn(t, n),
          (l = ut(l)),
          (r = r(l)),
          (t.flags |= 1),
          We(e, t, r, n),
          t.child
        );
      case 14:
        return ((r = t.type), (l = ht(r, t.pendingProps)), (l = ht(r.type, l)), Ds(e, t, r, l, n));
      case 15:
        return Os(e, t, t.type, t.pendingProps, n);
      case 17:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : ht(r, l)),
          _l(e, t),
          (t.tag = 1),
          Ke(r) ? ((e = !0), al(t)) : (e = !1),
          Dn(t, n),
          Rs(t, r, l),
          yu(t, r, l, n),
          ku(null, t, r, !0, e, n)
        );
      case 19:
        return Hs(e, t, n);
      case 22:
        return Fs(e, t, n);
    }
    throw Error(i(156, t.tag));
  };
  function dc(e, t) {
    return Qi(e, t);
  }
  function tp(e, t, n, r) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = r),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function st(e, t, n, r) {
    return new tp(e, t, n, r);
  }
  function Bu(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function np(e) {
    if (typeof e == 'function') return Bu(e) ? 1 : 0;
    if (e != null) {
      if (((e = e.$$typeof), e === je)) return 11;
      if (e === Ce) return 14;
    }
    return 2;
  }
  function qt(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = st(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = e.flags & 14680064),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      n
    );
  }
  function Ul(e, t, n, r, l, o) {
    var a = 2;
    if (((r = e), typeof e == 'function')) Bu(e) && (a = 1);
    else if (typeof e == 'string') a = 5;
    else
      e: switch (e) {
        case oe:
          return pn(n.children, l, o, t);
        case fe:
          ((a = 8), (l |= 8));
          break;
        case De:
          return ((e = st(12, n, t, l | 2)), (e.elementType = De), (e.lanes = o), e);
        case ke:
          return ((e = st(13, n, t, l)), (e.elementType = ke), (e.lanes = o), e);
        case Oe:
          return ((e = st(19, n, t, l)), (e.elementType = Oe), (e.lanes = o), e);
        case de:
          return jl(n, l, o, t);
        default:
          if (typeof e == 'object' && e !== null)
            switch (e.$$typeof) {
              case Ue:
                a = 10;
                break e;
              case rt:
                a = 9;
                break e;
              case je:
                a = 11;
                break e;
              case Ce:
                a = 14;
                break e;
              case Ne:
                ((a = 16), (r = null));
                break e;
            }
          throw Error(i(130, e == null ? e : typeof e, ''));
      }
    return ((t = st(a, n, t, l)), (t.elementType = e), (t.type = r), (t.lanes = o), t);
  }
  function pn(e, t, n, r) {
    return ((e = st(7, e, r, t)), (e.lanes = n), e);
  }
  function jl(e, t, n, r) {
    return (
      (e = st(22, e, r, t)),
      (e.elementType = de),
      (e.lanes = n),
      (e.stateNode = { isHidden: !1 }),
      e
    );
  }
  function Hu(e, t, n) {
    return ((e = st(6, e, null, t)), (e.lanes = n), e);
  }
  function Wu(e, t, n) {
    return (
      (t = st(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  function rp(e, t, n, r, l) {
    ((this.tag = t),
      (this.containerInfo = e),
      (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = vo(0)),
      (this.expirationTimes = vo(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = vo(0)),
      (this.identifierPrefix = r),
      (this.onRecoverableError = l),
      (this.mutableSourceEagerHydrationData = null));
  }
  function Vu(e, t, n, r, l, o, a, d, h) {
    return (
      (e = new rp(e, t, n, d, h)),
      t === 1 ? ((t = 1), o === !0 && (t |= 8)) : (t = 0),
      (o = st(3, null, null, t)),
      (e.current = o),
      (o.stateNode = e),
      (o.memoizedState = {
        element: r,
        isDehydrated: n,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null,
      }),
      ru(o),
      e
    );
  }
  function lp(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: ee,
      key: r == null ? null : '' + r,
      children: e,
      containerInfo: t,
      implementation: n,
    };
  }
  function pc(e) {
    if (!e) return Wt;
    e = e._reactInternals;
    e: {
      if (en(e) !== e || e.tag !== 1) throw Error(i(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ke(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(i(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ke(n)) return Ba(e, n, t);
    }
    return t;
  }
  function hc(e, t, n, r, l, o, a, d, h) {
    return (
      (e = Vu(n, r, !0, e, l, o, a, d, h)),
      (e.context = pc(null)),
      (n = e.current),
      (r = Ve()),
      (l = Jt(n)),
      (o = zt(r, l)),
      (o.callback = t ?? null),
      Kt(n, o, l),
      (e.current.lanes = l),
      Zn(e, l, r),
      Xe(e, r),
      e
    );
  }
  function $l(e, t, n, r) {
    var l = t.current,
      o = Ve(),
      a = Jt(l);
    return (
      (n = pc(n)),
      t.context === null ? (t.context = n) : (t.pendingContext = n),
      (t = zt(o, a)),
      (t.payload = { element: e }),
      (r = r === void 0 ? null : r),
      r !== null && (t.callback = r),
      (e = Kt(l, t, a)),
      e !== null && (yt(e, l, a, o), vl(e, l, a)),
      a
    );
  }
  function Al(e) {
    if (((e = e.current), !e.child)) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function mc(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Qu(e, t) {
    (mc(e, t), (e = e.alternate) && mc(e, t));
  }
  function op() {
    return null;
  }
  var vc =
    typeof reportError == 'function'
      ? reportError
      : function (e) {
          console.error(e);
        };
  function Ku(e) {
    this._internalRoot = e;
  }
  ((Bl.prototype.render = Ku.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(i(409));
      $l(e, t, null, null);
    }),
    (Bl.prototype.unmount = Ku.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (cn(function () {
            $l(null, e, null, null);
          }),
            (t[_t] = null));
        }
      }));
  function Bl(e) {
    this._internalRoot = e;
  }
  Bl.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = bi();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < jt.length && t !== 0 && t < jt[n].priority; n++);
      (jt.splice(n, 0, e), n === 0 && na(e));
    }
  };
  function Yu(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function Hl(e) {
    return !(
      !e ||
      (e.nodeType !== 1 &&
        e.nodeType !== 9 &&
        e.nodeType !== 11 &&
        (e.nodeType !== 8 || e.nodeValue !== ' react-mount-point-unstable '))
    );
  }
  function yc() {}
  function up(e, t, n, r, l) {
    if (l) {
      if (typeof r == 'function') {
        var o = r;
        r = function () {
          var x = Al(a);
          o.call(x);
        };
      }
      var a = hc(t, r, e, 0, null, !1, !1, '', yc);
      return (
        (e._reactRootContainer = a),
        (e[_t] = a.current),
        fr(e.nodeType === 8 ? e.parentNode : e),
        cn(),
        a
      );
    }
    for (; (l = e.lastChild);) e.removeChild(l);
    if (typeof r == 'function') {
      var d = r;
      r = function () {
        var x = Al(h);
        d.call(x);
      };
    }
    var h = Vu(e, 0, !1, null, null, !1, !1, '', yc);
    return (
      (e._reactRootContainer = h),
      (e[_t] = h.current),
      fr(e.nodeType === 8 ? e.parentNode : e),
      cn(function () {
        $l(t, h, n, r);
      }),
      h
    );
  }
  function Wl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var a = o;
      if (typeof l == 'function') {
        var d = l;
        l = function () {
          var h = Al(a);
          d.call(h);
        };
      }
      $l(t, a, e, l);
    } else a = up(n, t, e, l, r);
    return Al(a);
  }
  ((Zi = function (e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Jn(t.pendingLanes);
          n !== 0 && (yo(t, n | 1), Xe(t, xe()), (ue & 6) === 0 && ((jn = xe() + 500), Vt()));
        }
        break;
      case 13:
        (cn(function () {
          var r = Tt(e, 1);
          if (r !== null) {
            var l = Ve();
            yt(r, e, 1, l);
          }
        }),
          Qu(e, 1));
    }
  }),
    (go = function (e) {
      if (e.tag === 13) {
        var t = Tt(e, 134217728);
        if (t !== null) {
          var n = Ve();
          yt(t, e, 134217728, n);
        }
        Qu(e, 134217728);
      }
    }),
    (qi = function (e) {
      if (e.tag === 13) {
        var t = Jt(e),
          n = Tt(e, t);
        if (n !== null) {
          var r = Ve();
          yt(n, e, t, r);
        }
        Qu(e, t);
      }
    }),
    (bi = function () {
      return ce;
    }),
    (ea = function (e, t) {
      var n = ce;
      try {
        return ((ce = e), t());
      } finally {
        ce = n;
      }
    }),
    (so = function (e, t, n) {
      switch (t) {
        case 'input':
          if ((to(e, n), (t = n.name), n.type === 'radio' && t != null)) {
            for (n = e; n.parentNode;) n = n.parentNode;
            for (
              n = n.querySelectorAll('input[name=' + JSON.stringify('' + t) + '][type="radio"]'),
                t = 0;
              t < n.length;
              t++
            ) {
              var r = n[t];
              if (r !== e && r.form === e.form) {
                var l = ul(r);
                if (!l) throw Error(i(90));
                (xi(r), to(r, l));
              }
            }
          }
          break;
        case 'textarea':
          Ni(e, n);
          break;
        case 'select':
          ((t = n.value), t != null && mn(e, !!n.multiple, t, !1));
      }
    }),
    (ji = ju),
    ($i = cn));
  var ip = { usingClientEntryPoint: !1, Events: [hr, Rn, ul, Mi, Ui, ju] },
    Lr = {
      findFiberByHostInstance: tn,
      bundleType: 0,
      version: '18.3.1',
      rendererPackageName: 'react-dom',
    },
    ap = {
      bundleType: Lr.bundleType,
      version: Lr.version,
      rendererPackageName: Lr.rendererPackageName,
      rendererConfig: Lr.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: b.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (e) {
        return ((e = Wi(e)), e === null ? null : e.stateNode);
      },
      findFiberByHostInstance: Lr.findFiberByHostInstance || op,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: '18.3.1-next-f1338f8080-20240426',
    };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber)
      try {
        ((Br = Vl.inject(ap)), (kt = Vl));
      } catch {}
  }
  return (
    (Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ip),
    (Je.createPortal = function (e, t) {
      var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Yu(t)) throw Error(i(200));
      return lp(e, t, null, n);
    }),
    (Je.createRoot = function (e, t) {
      if (!Yu(e)) throw Error(i(299));
      var n = !1,
        r = '',
        l = vc;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
        (t = Vu(e, 1, !1, null, null, n, !1, r, l)),
        (e[_t] = t.current),
        fr(e.nodeType === 8 ? e.parentNode : e),
        new Ku(t)
      );
    }),
    (Je.findDOMNode = function (e) {
      if (e == null) return null;
      if (e.nodeType === 1) return e;
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == 'function'
          ? Error(i(188))
          : ((e = Object.keys(e).join(',')), Error(i(268, e)));
      return ((e = Wi(t)), (e = e === null ? null : e.stateNode), e);
    }),
    (Je.flushSync = function (e) {
      return cn(e);
    }),
    (Je.hydrate = function (e, t, n) {
      if (!Hl(t)) throw Error(i(200));
      return Wl(null, e, t, !0, n);
    }),
    (Je.hydrateRoot = function (e, t, n) {
      if (!Yu(e)) throw Error(i(405));
      var r = (n != null && n.hydratedSources) || null,
        l = !1,
        o = '',
        a = vc;
      if (
        (n != null &&
          (n.unstable_strictMode === !0 && (l = !0),
          n.identifierPrefix !== void 0 && (o = n.identifierPrefix),
          n.onRecoverableError !== void 0 && (a = n.onRecoverableError)),
        (t = hc(t, null, e, 1, n ?? null, l, !1, o, a)),
        (e[_t] = t.current),
        fr(e),
        r)
      )
        for (e = 0; e < r.length; e++)
          ((n = r[e]),
            (l = n._getVersion),
            (l = l(n._source)),
            t.mutableSourceEagerHydrationData == null
              ? (t.mutableSourceEagerHydrationData = [n, l])
              : t.mutableSourceEagerHydrationData.push(n, l));
      return new Bl(t);
    }),
    (Je.render = function (e, t, n) {
      if (!Hl(t)) throw Error(i(200));
      return Wl(null, e, t, !1, n);
    }),
    (Je.unmountComponentAtNode = function (e) {
      if (!Hl(e)) throw Error(i(40));
      return e._reactRootContainer
        ? (cn(function () {
            Wl(null, null, e, !1, function () {
              ((e._reactRootContainer = null), (e[_t] = null));
            });
          }),
          !0)
        : !1;
    }),
    (Je.unstable_batchedUpdates = ju),
    (Je.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
      if (!Hl(n)) throw Error(i(200));
      if (e == null || e._reactInternals === void 0) throw Error(i(38));
      return Wl(e, t, n, !1, r);
    }),
    (Je.version = '18.3.1-next-f1338f8080-20240426'),
    Je
  );
}
var Rc;
function Vc() {
  if (Rc) return Ju.exports;
  Rc = 1;
  function u() {
    if (!(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    ))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (s) {
        console.error(s);
      }
  }
  return (u(), (Ju.exports = vp()), Ju.exports);
}
var _c;
function yp() {
  if (_c) return Ql;
  _c = 1;
  var u = Vc();
  return ((Ql.createRoot = u.createRoot), (Ql.hydrateRoot = u.hydrateRoot), Ql);
}
var gp = yp();
const gm = di(gp);
/**
 * react-router v7.18.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ var pi = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,
  Qc = /^[\\/]{2}/;
function wp(u, s) {
  return s + u.replace(/\\/g, '/');
}
var Pc = 'popstate';
function Lc(u) {
  return (
    typeof u == 'object' &&
    u != null &&
    'pathname' in u &&
    'search' in u &&
    'hash' in u &&
    'state' in u &&
    'key' in u
  );
}
function Sp(u = {}) {
  function s(c, f) {
    var E;
    let p = (E = f.state) == null ? void 0 : E.masked,
      { pathname: g, search: S, hash: y } = p || c.location;
    return si(
      '',
      { pathname: g, search: S, hash: y },
      (f.state && f.state.usr) || null,
      (f.state && f.state.key) || 'default',
      p
        ? { pathname: c.location.pathname, search: c.location.search, hash: c.location.hash }
        : void 0,
    );
  }
  function i(c, f) {
    return typeof f == 'string' ? f : hn(f);
  }
  return Ep(s, i, null, u);
}
function ge(u, s) {
  if (u === !1 || u === null || typeof u > 'u') throw new Error(s);
}
function ct(u, s) {
  if (!u) {
    typeof console < 'u' && console.warn(s);
    try {
      throw new Error(s);
    } catch {}
  }
}
function kp() {
  return Math.random().toString(36).substring(2, 10);
}
function Nc(u, s) {
  return {
    usr: u.state,
    key: u.key,
    idx: s,
    masked: u.mask ? { pathname: u.pathname, search: u.search, hash: u.hash } : void 0,
  };
}
function si(u, s, i = null, c, f) {
  return {
    pathname: typeof u == 'string' ? u : u.pathname,
    search: '',
    hash: '',
    ...(typeof s == 'string' ? Bn(s) : s),
    state: i,
    key: (s && s.key) || c || kp(),
    mask: f,
  };
}
function hn({ pathname: u = '/', search: s = '', hash: i = '' }) {
  return (
    s && s !== '?' && (u += s.charAt(0) === '?' ? s : '?' + s),
    i && i !== '#' && (u += i.charAt(0) === '#' ? i : '#' + i),
    u
  );
}
function Bn(u) {
  let s = {};
  if (u) {
    let i = u.indexOf('#');
    i >= 0 && ((s.hash = u.substring(i)), (u = u.substring(0, i)));
    let c = u.indexOf('?');
    (c >= 0 && ((s.search = u.substring(c)), (u = u.substring(0, c))), u && (s.pathname = u));
  }
  return s;
}
function Ep(u, s, i, c = {}) {
  let { window: f = document.defaultView, v5Compat: p = !1 } = c,
    g = f.history,
    S = 'POP',
    y = null,
    E = R();
  E == null && ((E = 0), g.replaceState({ ...g.state, idx: E }, ''));
  function R() {
    return (g.state || { idx: null }).idx;
  }
  function C() {
    S = 'POP';
    let N = R(),
      M = N == null ? null : N - E;
    ((E = N), y && y({ action: S, location: T.location, delta: M }));
  }
  function P(N, M) {
    S = 'PUSH';
    let A = Lc(N) ? N : si(T.location, N, M);
    E = R() + 1;
    let V = Nc(A, E),
      b = T.createHref(A.mask || A);
    try {
      g.pushState(V, '', b);
    } catch (ne) {
      if (ne instanceof DOMException && ne.name === 'DataCloneError') throw ne;
      f.location.assign(b);
    }
    p && y && y({ action: S, location: T.location, delta: 1 });
  }
  function j(N, M) {
    S = 'REPLACE';
    let A = Lc(N) ? N : si(T.location, N, M);
    E = R();
    let V = Nc(A, E),
      b = T.createHref(A.mask || A);
    (g.replaceState(V, '', b), p && y && y({ action: S, location: T.location, delta: 0 }));
  }
  function B(N) {
    return Cp(f, N);
  }
  let T = {
    get action() {
      return S;
    },
    get location() {
      return u(f, g);
    },
    listen(N) {
      if (y) throw new Error('A history only accepts one active listener');
      return (
        f.addEventListener(Pc, C),
        (y = N),
        () => {
          (f.removeEventListener(Pc, C), (y = null));
        }
      );
    },
    createHref(N) {
      return s(f, N);
    },
    createURL: B,
    encodeLocation(N) {
      let M = B(N);
      return { pathname: M.pathname, search: M.search, hash: M.hash };
    },
    push: P,
    replace: j,
    go(N) {
      return g.go(N);
    },
  };
  return T;
}
function Cp(u, s, i = !1) {
  let c = 'http://localhost';
  (u && (c = u.location.origin !== 'null' ? u.location.origin : u.location.href),
    ge(c, 'No window.location.(origin|href) available to create URL'));
  let f = typeof s == 'string' ? s : hn(s);
  return ((f = f.replace(/ $/, '%20')), !i && Qc.test(f) && (f = c + f), new URL(f, c));
}
function Kc(u, s, i = '/') {
  return xp(u, s, i, !1);
}
function xp(u, s, i, c, f) {
  let p = typeof s == 'string' ? Bn(s) : s,
    g = Ot(p.pathname || '/', i);
  if (g == null) return null;
  let S = Rp(u),
    y = null,
    E = Mp(g);
  for (let R = 0; y == null && R < S.length; ++R) y = Fp(S[R], E, c);
  return y;
}
function Rp(u) {
  let s = Yc(u);
  return (_p(s), s);
}
function Yc(u, s = [], i = [], c = '', f = !1) {
  let p = (g, S, y = f, E) => {
    let R = {
      relativePath: E === void 0 ? g.path || '' : E,
      caseSensitive: g.caseSensitive === !0,
      childrenIndex: S,
      route: g,
    };
    if (R.relativePath.startsWith('/')) {
      if (!R.relativePath.startsWith(c) && y) return;
      (ge(
        R.relativePath.startsWith(c),
        `Absolute route path "${R.relativePath}" nested under path "${c}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (R.relativePath = R.relativePath.slice(c.length)));
    }
    let C = gt([c, R.relativePath]),
      P = i.concat(R);
    (g.children &&
      g.children.length > 0 &&
      (ge(
        g.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${C}".`,
      ),
      Yc(g.children, s, P, C, y)),
      !(g.path == null && !g.index) &&
        s.push({
          path: C,
          score: Dp(C, g.index),
          routesMeta: P.map((j, B) => {
            let [T, N] = Jc(j.relativePath, j.caseSensitive, B === P.length - 1);
            return { ...j, matcher: T, compiledParams: N };
          }),
        }));
  };
  return (
    u.forEach((g, S) => {
      var y;
      if (g.path === '' || !((y = g.path) != null && y.includes('?'))) p(g, S);
      else for (let E of Gc(g.path)) p(g, S, !0, E);
    }),
    s
  );
}
function Gc(u) {
  let s = u.split('/');
  if (s.length === 0) return [];
  let [i, ...c] = s,
    f = i.endsWith('?'),
    p = i.replace(/\?$/, '');
  if (c.length === 0) return f ? [p, ''] : [p];
  let g = Gc(c.join('/')),
    S = [];
  return (
    S.push(...g.map((y) => (y === '' ? p : [p, y].join('/')))),
    f && S.push(...g),
    S.map((y) => (u.startsWith('/') && y === '' ? '/' : y))
  );
}
function _p(u) {
  u.sort((s, i) =>
    s.score !== i.score
      ? i.score - s.score
      : Op(
          s.routesMeta.map((c) => c.childrenIndex),
          i.routesMeta.map((c) => c.childrenIndex),
        ),
  );
}
var Pp = /^:[\w-]+$/,
  Lp = 3,
  Np = 2,
  Tp = 1,
  zp = 10,
  Ip = -2,
  Tc = (u) => u === '*';
function Dp(u, s) {
  let i = u.split('/'),
    c = i.length;
  return (
    i.some(Tc) && (c += Ip),
    s && (c += Np),
    i.filter((f) => !Tc(f)).reduce((f, p) => f + (Pp.test(p) ? Lp : p === '' ? Tp : zp), c)
  );
}
function Op(u, s) {
  return u.length === s.length && u.slice(0, -1).every((c, f) => c === s[f])
    ? u[u.length - 1] - s[s.length - 1]
    : 0;
}
function Fp(u, s, i = !1) {
  let { routesMeta: c } = u,
    f = {},
    p = '/',
    g = [];
  for (let S = 0; S < c.length; ++S) {
    let y = c[S],
      E = S === c.length - 1,
      R = p === '/' ? s : s.slice(p.length) || '/',
      C = { path: y.relativePath, caseSensitive: y.caseSensitive, end: E },
      P = y.matcher && y.compiledParams ? Xc(C, R, y.matcher, y.compiledParams) : Xl(C, R),
      j = y.route;
    if (
      (!P &&
        E &&
        i &&
        !c[c.length - 1].route.index &&
        (P = Xl({ path: y.relativePath, caseSensitive: y.caseSensitive, end: !1 }, R)),
      !P)
    )
      return null;
    (Object.assign(f, P.params),
      g.push({
        params: f,
        pathname: gt([p, P.pathname]),
        pathnameBase: $p(gt([p, P.pathnameBase])),
        route: j,
      }),
      P.pathnameBase !== '/' && (p = gt([p, P.pathnameBase])));
  }
  return g;
}
function Xl(u, s) {
  typeof u == 'string' && (u = { path: u, caseSensitive: !1, end: !0 });
  let [i, c] = Jc(u.path, u.caseSensitive, u.end);
  return Xc(u, s, i, c);
}
function Xc(u, s, i, c) {
  let f = s.match(i);
  if (!f) return null;
  let p = f[0],
    g = An(p, 1),
    S = f.slice(1);
  return {
    params: c.reduce((E, { paramName: R, isOptional: C }, P) => {
      if (R === '*') {
        let B = S[P] || '';
        g = An(p.slice(0, p.length - B.length), 1);
      }
      const j = S[P];
      return (C && !j ? (E[R] = void 0) : (E[R] = (j || '').replace(/%2F/g, '/')), E);
    }, {}),
    pathname: p,
    pathnameBase: g,
    pattern: u,
  };
}
function Jc(u, s = !1, i = !0) {
  ct(
    u === '*' || !u.endsWith('*') || u.endsWith('/*'),
    `Route path "${u}" will be treated as if it were "${u.replace(/\*$/, '/*')}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${u.replace(/\*$/, '/*')}".`,
  );
  let c = [],
    f =
      '^' +
      u
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(/\/:([\w-]+)(\?)?/g, (g, S, y, E, R) => {
          if ((c.push({ paramName: S, isOptional: y != null }), y)) {
            let C = R.charAt(E + g.length);
            return C && C !== '/' ? '/([^\\/]*)' : '(?:/([^\\/]*))?';
          }
          return '/([^\\/]+)';
        })
        .replace(/\/([\w-]+)\?(\/|$)/g, '(/$1)?$2');
  return (
    u.endsWith('*')
      ? (c.push({ paramName: '*' }), (f += u === '*' || u === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : i
        ? (f += '\\/*$')
        : u !== '' && u !== '/' && (f += '(?:(?=\\/|$))'),
    [new RegExp(f, s ? void 0 : 'i'), c]
  );
}
function Mp(u) {
  try {
    return u
      .split('/')
      .map((s) => decodeURIComponent(s).replace(/\//g, '%2F'))
      .join('/');
  } catch (s) {
    return (
      ct(
        !1,
        `The URL path "${u}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${s}).`,
      ),
      u
    );
  }
}
function Ot(u, s) {
  if (s === '/') return u;
  if (!u.toLowerCase().startsWith(s.toLowerCase())) return null;
  let i = s.endsWith('/') ? s.length - 1 : s.length,
    c = u.charAt(i);
  return c && c !== '/' ? null : u.slice(i) || '/';
}
function Up(u, s = '/') {
  let { pathname: i, search: c = '', hash: f = '' } = typeof u == 'string' ? Bn(u) : u,
    p;
  return (
    i
      ? ((i = Zc(i)),
        i.startsWith('/') || i.startsWith('\\') ? (p = zc(i.substring(1), '/')) : (p = zc(i, s)))
      : (p = s),
    { pathname: p, search: Ap(c), hash: Bp(f) }
  );
}
function zc(u, s) {
  let i = An(s).split('/');
  return (
    u.split('/').forEach((f) => {
      f === '..' ? i.length > 1 && i.pop() : f !== '.' && i.push(f);
    }),
    i.length > 1 ? i.join('/') : '/'
  );
}
function bu(u, s, i, c) {
  return `Cannot include a '${u}' character in a manually specified \`to.${s}\` field [${JSON.stringify(c)}].  Please separate it out to the \`to.${i}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function jp(u) {
  return u.filter((s, i) => i === 0 || (s.route.path && s.route.path.length > 0));
}
function hi(u) {
  let s = jp(u);
  return s.map((i, c) => (c === s.length - 1 ? i.pathname : i.pathnameBase));
}
function Jl(u, s, i, c = !1) {
  let f;
  typeof u == 'string'
    ? (f = Bn(u))
    : ((f = { ...u }),
      ge(!f.pathname || !f.pathname.includes('?'), bu('?', 'pathname', 'search', f)),
      ge(!f.pathname || !f.pathname.includes('#'), bu('#', 'pathname', 'hash', f)),
      ge(!f.search || !f.search.includes('#'), bu('#', 'search', 'hash', f)));
  let p = u === '' || f.pathname === '',
    g = p ? '/' : f.pathname,
    S;
  if (g == null) S = i;
  else {
    let C = s.length - 1;
    if (!c && g.startsWith('..')) {
      let P = g.split('/');
      for (; P[0] === '..';) (P.shift(), (C -= 1));
      f.pathname = P.join('/');
    }
    S = C >= 0 ? s[C] : '/';
  }
  let y = Up(f, S),
    E = g && g !== '/' && g.endsWith('/'),
    R = (p || g === '.') && i.endsWith('/');
  return (!y.pathname.endsWith('/') && (E || R) && (y.pathname += '/'), y);
}
var Zc = (u) => u.replace(/[\\/]{2,}/g, '/'),
  gt = (u) => Zc(u.join('/'));
function An(u, s = 0) {
  let i = u.length;
  for (; i > s && u.charCodeAt(i - 1) === 47;) i--;
  return i === u.length ? u : u.slice(0, i);
}
var $p = (u) => An(u).replace(/^\/*/, '/'),
  Ap = (u) => (!u || u === '?' ? '' : u.startsWith('?') ? u : '?' + u),
  Bp = (u) => (!u || u === '#' ? '' : u.startsWith('#') ? u : '#' + u),
  Hp = class {
    constructor(u, s, i, c = !1) {
      ((this.status = u),
        (this.statusText = s || ''),
        (this.internal = c),
        i instanceof Error ? ((this.data = i.toString()), (this.error = i)) : (this.data = i));
    }
  };
function Wp(u) {
  return (
    u != null &&
    typeof u.status == 'number' &&
    typeof u.statusText == 'string' &&
    typeof u.internal == 'boolean' &&
    'data' in u
  );
}
function Vp(u) {
  let s = u.map((i) => i.route.path).filter(Boolean);
  return gt(s) || '/';
}
var qc =
  typeof window < 'u' && typeof window.document < 'u' && typeof window.document.createElement < 'u';
function bc(u, s) {
  let i = u;
  if (typeof i != 'string' || !pi.test(i)) return { absoluteURL: void 0, isExternal: !1, to: i };
  let c = i,
    f = !1;
  if (qc)
    try {
      let p = new URL(window.location.href),
        g = Qc.test(i) ? new URL(wp(i, p.protocol)) : new URL(i),
        S = Ot(g.pathname, s);
      g.origin === p.origin && S != null ? (i = S + g.search + g.hash) : (f = !0);
    } catch {
      ct(
        !1,
        `<Link to="${i}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: c, isExternal: f, to: i };
}
Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
var Ic = new URL('http://localhost');
function mi(u) {
  if (u.createURL) return u.createURL('/');
  try {
    return new URL(u.createHref('/'), Ic);
  } catch {
    return Ic;
  }
}
function ei(u, s) {
  return (
    u.origin === s.origin &&
    (u.origin !== 'null' || (u.protocol === s.protocol && u.host === s.host))
  );
}
function Qp(u, s) {
  if (u.startsWith('//')) return !0;
  let i = s.protocol.toLowerCase();
  return u.toLowerCase().startsWith(i) ? s.host === '' || u.slice(i.length).startsWith('//') : !1;
}
function vi(u, s, i, c) {
  let f = null;
  try {
    f = u == null ? null : new URL(u, i);
  } catch {}
  let p = new URL(s, i),
    g = f != null && !ei(f, i),
    S = !ei(p, i);
  if (c === 'reject') {
    if (g || S) throw new Error('External navigation is not allowed');
  } else if (S && (f == null || !Qp(u, f) || !ei(f, p)))
    throw new Error('External navigation is not allowed');
}
var ef = ['POST', 'PUT', 'PATCH', 'DELETE'];
new Set(ef);
var Kp = ['GET', ...ef];
new Set(Kp);
var Yp = [
  'about:',
  'blob:',
  'chrome:',
  'chrome-untrusted:',
  'content:',
  'data:',
  'devtools:',
  'file:',
  'filesystem:',
  'javascript:',
];
function Gp(u) {
  try {
    return Yp.includes(new URL(u).protocol);
  } catch {
    return !1;
  }
}
var Hn = L.createContext(null);
Hn.displayName = 'DataRouter';
var Zl = L.createContext(null);
Zl.displayName = 'DataRouterState';
var tf = L.createContext(!1);
function Xp() {
  return L.useContext(tf);
}
var nf = L.createContext({ isTransitioning: !1 });
nf.displayName = 'ViewTransition';
var Jp = L.createContext(new Map());
Jp.displayName = 'Fetchers';
var Zp = L.createContext(null);
Zp.displayName = 'Await';
var nt = L.createContext(null);
nt.displayName = 'Navigation';
var Dr = L.createContext(null);
Dr.displayName = 'Location';
var wt = L.createContext({ outlet: null, matches: [], isDataRoute: !1 });
wt.displayName = 'Route';
var yi = L.createContext(null);
yi.displayName = 'RouteError';
var rf = 'REACT_ROUTER_ERROR',
  qp = 'REDIRECT',
  bp = 'ROUTE_ERROR_RESPONSE';
function eh(u) {
  if (u.startsWith(`${rf}:${qp}:{`))
    try {
      let s = JSON.parse(u.slice(28));
      if (
        typeof s == 'object' &&
        s &&
        typeof s.status == 'number' &&
        typeof s.statusText == 'string' &&
        typeof s.location == 'string' &&
        typeof s.reloadDocument == 'boolean' &&
        typeof s.replace == 'boolean'
      )
        return s;
    } catch {}
}
function th(u) {
  if (u.startsWith(`${rf}:${bp}:{`))
    try {
      let s = JSON.parse(u.slice(40));
      if (
        typeof s == 'object' &&
        s &&
        typeof s.status == 'number' &&
        typeof s.statusText == 'string'
      )
        return new Hp(s.status, s.statusText, s.data);
    } catch {}
}
function nh(u, { relative: s } = {}) {
  ge(Wn(), 'useHref() may be used only in the context of a <Router> component.');
  let { basename: i, navigator: c } = L.useContext(nt),
    { hash: f, pathname: p, search: g } = Or(u, { relative: s }),
    S = p;
  return (
    i !== '/' && (S = p === '/' ? i : gt([i, p])),
    c.createHref({ pathname: S, search: g, hash: f })
  );
}
function Wn() {
  return L.useContext(Dr) != null;
}
function St() {
  return (
    ge(Wn(), 'useLocation() may be used only in the context of a <Router> component.'),
    L.useContext(Dr).location
  );
}
var lf =
  'You should call navigate() in a React.useEffect(), not when your component is first rendered.';
function of(u) {
  L.useContext(nt).static || L.useLayoutEffect(u);
}
function gi() {
  let { isDataRoute: u } = L.useContext(wt);
  return u ? mh() : rh();
}
function rh() {
  ge(Wn(), 'useNavigate() may be used only in the context of a <Router> component.');
  let u = L.useContext(Hn),
    { basename: s, navigator: i } = L.useContext(nt),
    { matches: c } = L.useContext(wt),
    { pathname: f } = St(),
    p = JSON.stringify(hi(c)),
    g = L.useRef(!1);
  return (
    of(() => {
      g.current = !0;
    }),
    L.useCallback(
      (y, E = {}) => {
        if ((ct(g.current, lf), !g.current)) return;
        if (typeof y == 'number') {
          i.go(y);
          return;
        }
        let R = Jl(y, JSON.parse(p), f, E.relative === 'path');
        (u == null && s !== '/' && (R.pathname = R.pathname === '/' ? s : gt([s, R.pathname])),
          vi(typeof y == 'string' ? y : hn(y), i.createHref(R), mi(i), 'reject'),
          (E.replace ? i.replace : i.push)(R, E.state, E));
      },
      [s, i, p, f, u],
    )
  );
}
L.createContext(null);
function wm() {
  let { matches: u } = L.useContext(wt),
    s = u[u.length - 1];
  return (s == null ? void 0 : s.params) ?? {};
}
function Or(u, { relative: s } = {}) {
  let { matches: i } = L.useContext(wt),
    { pathname: c } = St(),
    f = JSON.stringify(hi(i));
  return L.useMemo(() => Jl(u, JSON.parse(f), c, s === 'path'), [u, f, c, s]);
}
function lh(u, s) {
  return uf(u, s);
}
function uf(u, s, i) {
  var N;
  ge(Wn(), 'useRoutes() may be used only in the context of a <Router> component.');
  let { navigator: c } = L.useContext(nt),
    { matches: f } = L.useContext(wt),
    p = f[f.length - 1],
    g = p ? p.params : {},
    S = p ? p.pathname : '/',
    y = p ? p.pathnameBase : '/',
    E = p && p.route;
  {
    let M = (E && E.path) || '';
    sf(
      S,
      !E || M.endsWith('*') || M.endsWith('*?'),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${S}" (under <Route path="${M}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${M}"> to <Route path="${M === '/' ? '*' : `${M}/*`}">.`,
    );
  }
  let R = St(),
    C;
  if (s) {
    let M = typeof s == 'string' ? Bn(s) : s;
    (ge(
      y === '/' || ((N = M.pathname) == null ? void 0 : N.startsWith(y)),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${y}" but pathname "${M.pathname}" was given in the \`location\` prop.`,
    ),
      (C = M));
  } else C = R;
  let P = C.pathname || '/',
    j = P;
  if (y !== '/') {
    let M = y.replace(/^\//, '').split('/');
    j = '/' + P.replace(/^\//, '').split('/').slice(M.length).join('/');
  }
  let B =
    i && i.state.matches.length
      ? i.state.matches.map((M) => Object.assign(M, { route: i.manifest[M.route.id] || M.route }))
      : Kc(u, { pathname: j });
  (ct(E || B != null, `No routes matched location "${C.pathname}${C.search}${C.hash}" `),
    ct(
      B == null ||
        B[B.length - 1].route.element !== void 0 ||
        B[B.length - 1].route.Component !== void 0 ||
        B[B.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${C.pathname}${C.search}${C.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    ));
  let T = sh(
    B &&
      B.map((M) =>
        Object.assign({}, M, {
          params: Object.assign({}, g, M.params),
          pathname: gt([
            y,
            c.encodeLocation
              ? c.encodeLocation(
                  M.pathname.replace(/%/g, '%25').replace(/\?/g, '%3F').replace(/#/g, '%23'),
                ).pathname
              : M.pathname,
          ]),
          pathnameBase:
            M.pathnameBase === '/'
              ? y
              : gt([
                  y,
                  c.encodeLocation
                    ? c.encodeLocation(
                        M.pathnameBase
                          .replace(/%/g, '%25')
                          .replace(/\?/g, '%3F')
                          .replace(/#/g, '%23'),
                      ).pathname
                    : M.pathnameBase,
                ]),
        }),
      ),
    f,
    i,
  );
  return s && T
    ? L.createElement(
        Dr.Provider,
        {
          value: {
            location: {
              pathname: '/',
              search: '',
              hash: '',
              state: null,
              key: 'default',
              mask: void 0,
              ...C,
            },
            navigationType: 'POP',
          },
        },
        T,
      )
    : T;
}
function oh() {
  let u = hh(),
    s = Wp(u) ? `${u.status} ${u.statusText}` : u instanceof Error ? u.message : JSON.stringify(u),
    i = u instanceof Error ? u.stack : null,
    c = 'rgba(200,200,200, 0.5)',
    f = { padding: '0.5rem', backgroundColor: c },
    p = { padding: '2px 4px', backgroundColor: c },
    g = null;
  return (
    console.error('Error handled by React Router default ErrorBoundary:', u),
    (g = L.createElement(
      L.Fragment,
      null,
      L.createElement('p', null, '💿 Hey developer 👋'),
      L.createElement(
        'p',
        null,
        'You can provide a way better UX than this when your app throws errors by providing your own ',
        L.createElement('code', { style: p }, 'ErrorBoundary'),
        ' or',
        ' ',
        L.createElement('code', { style: p }, 'errorElement'),
        ' prop on your route.',
      ),
    )),
    L.createElement(
      L.Fragment,
      null,
      L.createElement('h2', null, 'Unexpected Application Error!'),
      L.createElement('h3', { style: { fontStyle: 'italic' } }, s),
      i ? L.createElement('pre', { style: f }, i) : null,
      g,
    )
  );
}
var uh = L.createElement(oh, null),
  af = class extends L.Component {
    constructor(u) {
      (super(u),
        (this.state = { location: u.location, revalidation: u.revalidation, error: u.error }));
    }
    static getDerivedStateFromError(u) {
      return { error: u };
    }
    static getDerivedStateFromProps(u, s) {
      return s.location !== u.location || (s.revalidation !== 'idle' && u.revalidation === 'idle')
        ? { error: u.error, location: u.location, revalidation: u.revalidation }
        : {
            error: u.error !== void 0 ? u.error : s.error,
            location: s.location,
            revalidation: u.revalidation || s.revalidation,
          };
    }
    componentDidCatch(u, s) {
      this.props.onError
        ? this.props.onError(u, s)
        : console.error('React Router caught the following error during render', u);
    }
    render() {
      let u = this.state.error;
      if (
        this.context &&
        typeof u == 'object' &&
        u &&
        'digest' in u &&
        typeof u.digest == 'string'
      ) {
        const i = th(u.digest);
        i && (u = i);
      }
      let s =
        u !== void 0
          ? L.createElement(
              wt.Provider,
              { value: this.props.routeContext },
              L.createElement(yi.Provider, { value: u, children: this.props.component }),
            )
          : this.props.children;
      return this.context ? L.createElement(ih, { error: u }, s) : s;
    }
  };
af.contextType = tf;
var ti = new WeakMap();
function ih({ children: u, error: s }) {
  let { basename: i, navigator: c } = L.useContext(nt);
  if (typeof s == 'object' && s && 'digest' in s && typeof s.digest == 'string') {
    let f = eh(s.digest);
    if (f) {
      let p = ti.get(s);
      if (p) throw p;
      let g = bc(f.location, i),
        S = g.absoluteURL || g.to;
      if ((vi(f.location, S, mi(c), 'allow-explicit'), Gp(S)))
        throw new Error('Invalid redirect location');
      if (qc && !ti.get(s))
        if (g.isExternal || f.reloadDocument) window.location.href = S;
        else {
          const y = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(g.to, { replace: f.replace }),
          );
          throw (ti.set(s, y), y);
        }
      return L.createElement('meta', { httpEquiv: 'refresh', content: `0;url=${S}` });
    }
  }
  return u;
}
function ah({ routeContext: u, match: s, children: i }) {
  let c = L.useContext(Hn);
  return (
    c &&
      c.static &&
      c.staticContext &&
      (s.route.errorElement || s.route.ErrorBoundary) &&
      (c.staticContext._deepestRenderedBoundaryId = s.route.id),
    L.createElement(wt.Provider, { value: u }, i)
  );
}
function sh(u, s = [], i) {
  let c = i == null ? void 0 : i.state;
  if (u == null) {
    if (!c) return null;
    if (c.errors) u = c.matches;
    else if (s.length === 0 && !c.initialized && c.matches.length > 0) u = c.matches;
    else return null;
  }
  let f = u,
    p = c == null ? void 0 : c.errors;
  if (p != null) {
    let R = f.findIndex((C) => C.route.id && (p == null ? void 0 : p[C.route.id]) !== void 0);
    (ge(
      R >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(p).join(',')}`,
    ),
      (f = f.slice(0, Math.min(f.length, R + 1))));
  }
  let g = !1,
    S = -1;
  if (i && c) {
    g = c.renderFallback;
    for (let R = 0; R < f.length; R++) {
      let C = f[R];
      if (((C.route.HydrateFallback || C.route.hydrateFallbackElement) && (S = R), C.route.id)) {
        let { loaderData: P, errors: j } = c,
          B = C.route.loader && !P.hasOwnProperty(C.route.id) && (!j || j[C.route.id] === void 0);
        if (C.route.lazy || B) {
          (i.isStatic && (g = !0), S >= 0 ? (f = f.slice(0, S + 1)) : (f = [f[0]]));
          break;
        }
      }
    }
  }
  let y = i == null ? void 0 : i.onError,
    E =
      c && y
        ? (R, C) => {
            var P, j;
            y(R, {
              location: c.location,
              params:
                ((j = (P = c.matches) == null ? void 0 : P[0]) == null ? void 0 : j.params) ?? {},
              pattern: Vp(c.matches),
              errorInfo: C,
            });
          }
        : void 0;
  return f.reduceRight((R, C, P) => {
    let j,
      B = !1,
      T = null,
      N = null;
    c &&
      ((j = p && C.route.id ? p[C.route.id] : void 0),
      (T = C.route.errorElement || uh),
      g &&
        (S < 0 && P === 0
          ? (sf(
              'route-fallback',
              !1,
              'No `HydrateFallback` element provided to render during initial hydration',
            ),
            (B = !0),
            (N = null))
          : S === P && ((B = !0), (N = C.route.hydrateFallbackElement || null))));
    let M = s.concat(f.slice(0, P + 1)),
      A = () => {
        let V;
        return (
          j
            ? (V = T)
            : B
              ? (V = N)
              : C.route.Component
                ? (V = L.createElement(C.route.Component, null))
                : C.route.element
                  ? (V = C.route.element)
                  : (V = R),
          L.createElement(ah, {
            match: C,
            routeContext: { outlet: R, matches: M, isDataRoute: c != null },
            children: V,
          })
        );
      };
    return c && (C.route.ErrorBoundary || C.route.errorElement || P === 0)
      ? L.createElement(af, {
          location: c.location,
          revalidation: c.revalidation,
          component: T,
          error: j,
          children: A(),
          routeContext: { outlet: null, matches: M, isDataRoute: !0 },
          onError: E,
        })
      : A();
  }, null);
}
function wi(u) {
  return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function ch(u) {
  let s = L.useContext(Hn);
  return (ge(s, wi(u)), s);
}
function fh(u) {
  let s = L.useContext(Zl);
  return (ge(s, wi(u)), s);
}
function dh(u) {
  let s = L.useContext(wt);
  return (ge(s, wi(u)), s);
}
function Si(u) {
  let s = dh(u),
    i = s.matches[s.matches.length - 1];
  return (ge(i.route.id, `${u} can only be used on routes that contain a unique "id"`), i.route.id);
}
function ph() {
  return Si('useRouteId');
}
function hh() {
  var c;
  let u = L.useContext(yi),
    s = fh('useRouteError'),
    i = Si('useRouteError');
  return u !== void 0 ? u : (c = s.errors) == null ? void 0 : c[i];
}
function mh() {
  let { router: u } = ch('useNavigate'),
    s = Si('useNavigate'),
    i = L.useRef(!1);
  return (
    of(() => {
      i.current = !0;
    }),
    L.useCallback(
      async (f, p = {}) => {
        (ct(i.current, lf),
          i.current &&
            (typeof f == 'number'
              ? await u.navigate(f)
              : await u.navigate(f, { fromRouteId: s, ...p })));
      },
      [u, s],
    )
  );
}
var Dc = {};
function sf(u, s, i) {
  !s && !Dc[u] && ((Dc[u] = !0), ct(!1, i));
}
L.memo(vh);
function vh({ routes: u, manifest: s, future: i, state: c, isStatic: f, onError: p }) {
  return uf(u, void 0, { manifest: s, state: c, isStatic: f, onError: p });
}
function Sm({ to: u, replace: s, state: i, relative: c }) {
  ge(Wn(), '<Navigate> may be used only in the context of a <Router> component.');
  let { static: f, navigator: p } = L.useContext(nt);
  ct(
    !f,
    '<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.',
  );
  let { matches: g } = L.useContext(wt),
    { pathname: S } = St(),
    y = gi(),
    E = Jl(u, hi(g), S, c === 'path');
  vi(typeof u == 'string' ? u : hn(u), p.createHref(E), mi(p), 'reject');
  let R = JSON.stringify(E);
  return (
    L.useEffect(() => {
      y(JSON.parse(R), { replace: s, state: i, relative: c });
    }, [y, R, c, s, i]),
    null
  );
}
function yh(u) {
  ge(
    !1,
    'A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.',
  );
}
function gh({
  basename: u = '/',
  children: s = null,
  location: i,
  navigationType: c = 'POP',
  navigator: f,
  static: p = !1,
  useTransitions: g,
}) {
  ge(
    !Wn(),
    'You cannot render a <Router> inside another <Router>. You should never have more than one in your app.',
  );
  let S = u.replace(/^\/*/, '/'),
    y = L.useMemo(
      () => ({ basename: S, navigator: f, static: p, useTransitions: g, future: {} }),
      [S, f, p, g],
    );
  typeof i == 'string' && (i = Bn(i));
  let {
      pathname: E = '/',
      search: R = '',
      hash: C = '',
      state: P = null,
      key: j = 'default',
      mask: B,
    } = i,
    T = L.useMemo(() => {
      let N = Ot(E, S);
      return N == null
        ? null
        : {
            location: { pathname: N, search: R, hash: C, state: P, key: j, mask: B },
            navigationType: c,
          };
    }, [S, E, R, C, P, j, c, B]);
  return (
    ct(
      T != null,
      `<Router basename="${S}"> is not able to match the URL "${E}${R}${C}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    T == null
      ? null
      : L.createElement(
          nt.Provider,
          { value: y },
          L.createElement(Dr.Provider, { children: s, value: T }),
        )
  );
}
function km({ children: u, location: s }) {
  return lh(ci(u), s);
}
function ci(u, s = []) {
  let i = [];
  return (
    L.Children.forEach(u, (c, f) => {
      if (!L.isValidElement(c)) return;
      let p = [...s, f];
      if (c.type === L.Fragment) {
        i.push.apply(i, ci(c.props.children, p));
        return;
      }
      (ge(
        c.type === yh,
        `[${typeof c.type == 'string' ? c.type : c.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
      ),
        ge(!c.props.index || !c.props.children, 'An index route cannot have child routes.'));
      let g = {
        id: c.props.id || p.join('-'),
        caseSensitive: c.props.caseSensitive,
        element: c.props.element,
        Component: c.props.Component,
        index: c.props.index,
        path: c.props.path,
        middleware: c.props.middleware,
        loader: c.props.loader,
        action: c.props.action,
        hydrateFallbackElement: c.props.hydrateFallbackElement,
        HydrateFallback: c.props.HydrateFallback,
        errorElement: c.props.errorElement,
        ErrorBoundary: c.props.ErrorBoundary,
        hasErrorBoundary:
          c.props.hasErrorBoundary === !0 ||
          c.props.ErrorBoundary != null ||
          c.props.errorElement != null,
        shouldRevalidate: c.props.shouldRevalidate,
        handle: c.props.handle,
        lazy: c.props.lazy,
      };
      (c.props.children && (g.children = ci(c.props.children, p)), i.push(g));
    }),
    i
  );
}
var Yl = 'get',
  Gl = 'application/x-www-form-urlencoded';
function ql(u) {
  return typeof HTMLElement < 'u' && u instanceof HTMLElement;
}
function wh(u) {
  return ql(u) && u.tagName.toLowerCase() === 'button';
}
function Sh(u) {
  return ql(u) && u.tagName.toLowerCase() === 'form';
}
function kh(u) {
  return ql(u) && u.tagName.toLowerCase() === 'input';
}
function Eh(u) {
  return !!(u.metaKey || u.altKey || u.ctrlKey || u.shiftKey);
}
function Ch(u, s) {
  return u.button === 0 && (!s || s === '_self') && !Eh(u);
}
function fi(u = '') {
  return new URLSearchParams(
    typeof u == 'string' || Array.isArray(u) || u instanceof URLSearchParams
      ? u
      : Object.keys(u).reduce((s, i) => {
          let c = u[i];
          return s.concat(Array.isArray(c) ? c.map((f) => [i, f]) : [[i, c]]);
        }, []),
  );
}
function xh(u, s) {
  let i = fi(u);
  return (
    s &&
      s.forEach((c, f) => {
        i.has(f) ||
          s.getAll(f).forEach((p) => {
            i.append(f, p);
          });
      }),
    i
  );
}
var Kl = null;
function Rh() {
  if (Kl === null)
    try {
      (new FormData(document.createElement('form'), 0), (Kl = !1));
    } catch {
      Kl = !0;
    }
  return Kl;
}
var _h = new Set(['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']);
function ni(u) {
  return u != null && !_h.has(u)
    ? (ct(
        !1,
        `"${u}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Gl}"`,
      ),
      null)
    : u;
}
function Ph(u, s) {
  let i, c, f, p, g;
  if (Sh(u)) {
    let S = u.getAttribute('action');
    ((c = S ? Ot(S, s) : null),
      (i = u.getAttribute('method') || Yl),
      (f = ni(u.getAttribute('enctype')) || Gl),
      (p = new FormData(u)));
  } else if (wh(u) || (kh(u) && (u.type === 'submit' || u.type === 'image'))) {
    let S = u.form;
    if (S == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    let y = u.getAttribute('formaction') || S.getAttribute('action');
    if (
      ((c = y ? Ot(y, s) : null),
      (i = u.getAttribute('formmethod') || S.getAttribute('method') || Yl),
      (f = ni(u.getAttribute('formenctype')) || ni(S.getAttribute('enctype')) || Gl),
      (p = new FormData(S, u)),
      !Rh())
    ) {
      let { name: E, type: R, value: C } = u;
      if (R === 'image') {
        let P = E ? `${E}.` : '';
        (p.append(`${P}x`, '0'), p.append(`${P}y`, '0'));
      } else E && p.append(E, C);
    }
  } else {
    if (ql(u))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">',
      );
    ((i = Yl), (c = null), (f = Gl), (g = u));
  }
  return (
    p && f === 'text/plain' && ((g = p), (p = void 0)),
    { action: c, method: i.toLowerCase(), encType: f, formData: p, body: g }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function ki(u, s) {
  if (u === !1 || u === null || typeof u > 'u') throw new Error(s);
}
function cf(u, s, i, c) {
  let f =
    typeof u == 'string'
      ? new URL(u, typeof window > 'u' ? 'server://singlefetch/' : window.location.origin)
      : u;
  return (
    i
      ? f.pathname.endsWith('/')
        ? (f.pathname = `${f.pathname}_.${c}`)
        : (f.pathname = `${f.pathname}.${c}`)
      : f.pathname === '/'
        ? (f.pathname = `_root.${c}`)
        : s && Ot(f.pathname, s) === '/'
          ? (f.pathname = `${An(s)}/_root.${c}`)
          : (f.pathname = `${An(f.pathname)}.${c}`),
    f
  );
}
async function Lh(u, s) {
  if (u.id in s) return s[u.id];
  try {
    let i = await import(u.module);
    return ((s[u.id] = i), i);
  } catch (i) {
    return (
      console.error(`Error loading route module \`${u.module}\`, reloading page...`),
      console.error(i),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function Nh(u) {
  return u == null
    ? !1
    : u.href == null
      ? u.rel === 'preload' && typeof u.imageSrcSet == 'string' && typeof u.imageSizes == 'string'
      : typeof u.rel == 'string' && typeof u.href == 'string';
}
async function Th(u, s, i) {
  let c = await Promise.all(
    u.map(async (f) => {
      let p = s.routes[f.route.id];
      if (p) {
        let g = await Lh(p, i);
        return g.links ? g.links() : [];
      }
      return [];
    }),
  );
  return Oh(
    c
      .flat(1)
      .filter(Nh)
      .filter((f) => f.rel === 'stylesheet' || f.rel === 'preload')
      .map((f) =>
        f.rel === 'stylesheet' ? { ...f, rel: 'prefetch', as: 'style' } : { ...f, rel: 'prefetch' },
      ),
  );
}
function Oc(u, s, i, c, f, p) {
  let g = (y, E) => (i[E] ? y.route.id !== i[E].route.id : !0),
    S = (y, E) => {
      var R;
      return (
        i[E].pathname !== y.pathname ||
        (((R = i[E].route.path) == null ? void 0 : R.endsWith('*')) &&
          i[E].params['*'] !== y.params['*'])
      );
    };
  return p === 'assets'
    ? s.filter((y, E) => g(y, E) || S(y, E))
    : p === 'data'
      ? s.filter((y, E) => {
          var C;
          let R = c.routes[y.route.id];
          if (!R || !R.hasLoader) return !1;
          if (g(y, E) || S(y, E)) return !0;
          if (y.route.shouldRevalidate) {
            let P = y.route.shouldRevalidate({
              currentUrl: new URL(f.pathname + f.search + f.hash, window.origin),
              currentParams: ((C = i[0]) == null ? void 0 : C.params) || {},
              nextUrl: new URL(u, window.origin),
              nextParams: y.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof P == 'boolean') return P;
          }
          return !0;
        })
      : [];
}
function zh(u, s, { includeHydrateFallback: i } = {}) {
  return Ih(
    u
      .map((c) => {
        let f = s.routes[c.route.id];
        if (!f) return [];
        let p = [f.module];
        return (
          f.clientActionModule && (p = p.concat(f.clientActionModule)),
          f.clientLoaderModule && (p = p.concat(f.clientLoaderModule)),
          i && f.hydrateFallbackModule && (p = p.concat(f.hydrateFallbackModule)),
          f.imports && (p = p.concat(f.imports)),
          p
        );
      })
      .flat(1),
  );
}
function Ih(u) {
  return [...new Set(u)];
}
function Dh(u) {
  let s = {},
    i = Object.keys(u).sort();
  for (let c of i) s[c] = u[c];
  return s;
}
function Oh(u, s) {
  let i = new Set();
  return (
    new Set(s),
    u.reduce((c, f) => {
      let p = JSON.stringify(Dh(f));
      return (i.has(p) || (i.add(p), c.push({ key: p, link: f })), c);
    }, [])
  );
}
function Ei() {
  let u = L.useContext(Hn);
  return (ki(u, 'You must render this element inside a <DataRouterContext.Provider> element'), u);
}
function Fh() {
  let u = L.useContext(Zl);
  return (
    ki(u, 'You must render this element inside a <DataRouterStateContext.Provider> element'),
    u
  );
}
var Ci = L.createContext(void 0);
Ci.displayName = 'FrameworkContext';
function bl() {
  let u = L.useContext(Ci);
  return (ki(u, 'You must render this element inside a <HydratedRouter> element'), u);
}
function Mh(u, s) {
  let i = L.useContext(Ci),
    [c, f] = L.useState(!1),
    [p, g] = L.useState(!1),
    { onFocus: S, onBlur: y, onMouseEnter: E, onMouseLeave: R, onTouchStart: C } = s,
    P = L.useRef(null);
  (L.useEffect(() => {
    if ((u === 'render' && g(!0), u === 'viewport')) {
      let T = (M) => {
          M.forEach((A) => {
            g(A.isIntersecting);
          });
        },
        N = new IntersectionObserver(T, { threshold: 0.5 });
      return (
        P.current && N.observe(P.current),
        () => {
          N.disconnect();
        }
      );
    }
  }, [u]),
    L.useEffect(() => {
      if (c) {
        let T = setTimeout(() => {
          g(!0);
        }, 100);
        return () => {
          clearTimeout(T);
        };
      }
    }, [c]));
  let j = () => {
      f(!0);
    },
    B = () => {
      (f(!1), g(!1));
    };
  return i
    ? u !== 'intent'
      ? [p, P, {}]
      : [
          p,
          P,
          {
            onFocus: Tr(S, j),
            onBlur: Tr(y, B),
            onMouseEnter: Tr(E, j),
            onMouseLeave: Tr(R, B),
            onTouchStart: Tr(C, j),
          },
        ]
    : [!1, P, {}];
}
function Tr(u, s) {
  return (i) => {
    (u && u(i), i.defaultPrevented || s(i));
  };
}
function Uh({ page: u, ...s }) {
  let i = Xp(),
    { nonce: c } = bl(),
    { router: f } = Ei(),
    p = L.useMemo(() => Kc(f.routes, u, f.basename), [f.routes, u, f.basename]);
  return p
    ? (s.nonce == null && c && (s = { ...s, nonce: c }),
      i
        ? L.createElement($h, { page: u, matches: p, ...s })
        : L.createElement(Ah, { page: u, matches: p, ...s }))
    : null;
}
function jh(u) {
  let { manifest: s, routeModules: i } = bl(),
    [c, f] = L.useState([]);
  return (
    L.useEffect(() => {
      let p = !1;
      return (
        Th(u, s, i).then((g) => {
          p || f(g);
        }),
        () => {
          p = !0;
        }
      );
    }, [u, s, i]),
    c
  );
}
function $h({ page: u, matches: s, ...i }) {
  let c = St(),
    { future: f } = bl(),
    { basename: p } = Ei(),
    g = L.useMemo(() => {
      if (u === c.pathname + c.search + c.hash) return [];
      let S = cf(u, p, f.v8_trailingSlashAwareDataRequests, 'rsc'),
        y = !1,
        E = [];
      for (let R of s)
        typeof R.route.shouldRevalidate == 'function' ? (y = !0) : E.push(R.route.id);
      return (
        y && E.length > 0 && S.searchParams.set('_routes', E.join(',')),
        [S.pathname + S.search]
      );
    }, [p, f.v8_trailingSlashAwareDataRequests, u, c, s]);
  return L.createElement(
    L.Fragment,
    null,
    g.map((S) => L.createElement('link', { key: S, rel: 'prefetch', as: 'fetch', href: S, ...i })),
  );
}
function Ah({ page: u, matches: s, ...i }) {
  let c = St(),
    { future: f, manifest: p, routeModules: g } = bl(),
    { basename: S } = Ei(),
    { loaderData: y, matches: E } = Fh(),
    R = L.useMemo(() => Oc(u, s, E, p, c, 'data'), [u, s, E, p, c]),
    C = L.useMemo(() => Oc(u, s, E, p, c, 'assets'), [u, s, E, p, c]),
    P = L.useMemo(() => {
      if (u === c.pathname + c.search + c.hash) return [];
      let T = new Set(),
        N = !1;
      if (
        (s.forEach((A) => {
          var b;
          let V = p.routes[A.route.id];
          !V ||
            !V.hasLoader ||
            ((!R.some((ne) => ne.route.id === A.route.id) &&
              A.route.id in y &&
              (b = g[A.route.id]) != null &&
              b.shouldRevalidate) ||
            V.hasClientLoader
              ? (N = !0)
              : T.add(A.route.id));
        }),
        T.size === 0)
      )
        return [];
      let M = cf(u, S, f.v8_trailingSlashAwareDataRequests, 'data');
      return (
        N &&
          T.size > 0 &&
          M.searchParams.set(
            '_routes',
            s
              .filter((A) => T.has(A.route.id))
              .map((A) => A.route.id)
              .join(','),
          ),
        [M.pathname + M.search]
      );
    }, [S, f.v8_trailingSlashAwareDataRequests, y, c, p, R, s, u, g]),
    j = L.useMemo(() => zh(C, p), [C, p]),
    B = jh(C);
  return L.createElement(
    L.Fragment,
    null,
    P.map((T) => L.createElement('link', { key: T, rel: 'prefetch', as: 'fetch', href: T, ...i })),
    j.map((T) => L.createElement('link', { key: T, rel: 'modulepreload', href: T, ...i })),
    B.map(({ key: T, link: N }) =>
      L.createElement('link', {
        key: T,
        nonce: i.nonce,
        ...N,
        crossOrigin: N.crossOrigin ?? i.crossOrigin,
      }),
    ),
  );
}
function Bh(...u) {
  return (s) => {
    u.forEach((i) => {
      typeof i == 'function' ? i(s) : i != null && (i.current = s);
    });
  };
}
var Hh =
  typeof window < 'u' && typeof window.document < 'u' && typeof window.document.createElement < 'u';
try {
  Hh && (window.__reactRouterVersion = '7.18.4');
} catch {}
function Em({ basename: u, children: s, useTransitions: i, window: c }) {
  let f = L.useRef();
  f.current == null && (f.current = Sp({ window: c, v5Compat: !0 }));
  let p = f.current,
    [g, S] = L.useState({ action: p.action, location: p.location }),
    y = L.useCallback(
      (E) => {
        i === !1 ? S(E) : L.startTransition(() => S(E));
      },
      [i],
    );
  return (
    L.useLayoutEffect(() => p.listen(y), [p, y]),
    L.createElement(gh, {
      basename: u,
      children: s,
      location: g.location,
      navigationType: g.action,
      navigator: p,
      useTransitions: i,
    })
  );
}
var ff = L.forwardRef(function (
  {
    onClick: s,
    discover: i = 'render',
    prefetch: c = 'none',
    relative: f,
    reloadDocument: p,
    replace: g,
    mask: S,
    state: y,
    target: E,
    to: R,
    preventScrollReset: C,
    viewTransition: P,
    defaultShouldRevalidate: j,
    ...B
  },
  T,
) {
  let { basename: N, navigator: M, useTransitions: A } = L.useContext(nt),
    V = typeof R == 'string' && pi.test(R),
    b = bc(R, N);
  R = b.to;
  let ne = nh(R, { relative: f }),
    ee = St(),
    oe = null;
  if (S) {
    let Ce = Jl(S, [], ee.mask ? ee.mask.pathname : '/', !0);
    (N !== '/' && (Ce.pathname = Ce.pathname === '/' ? N : gt([N, Ce.pathname])),
      (oe = M.createHref(Ce)));
  }
  let [fe, De, Ue] = Mh(c, B),
    rt = Kh(R, {
      replace: g,
      mask: S,
      state: y,
      target: E,
      preventScrollReset: C,
      relative: f,
      viewTransition: P,
      defaultShouldRevalidate: j,
      useTransitions: A,
    });
  function je(Ce) {
    (s && s(Ce), Ce.defaultPrevented || rt(Ce));
  }
  let ke = !(b.isExternal || p),
    Oe = L.createElement('a', {
      ...B,
      ...Ue,
      href: (ke ? oe : void 0) || b.absoluteURL || ne,
      onClick: ke ? je : s,
      ref: Bh(T, De),
      target: E,
      'data-discover': !V && i === 'render' ? 'true' : void 0,
    });
  return fe && !V ? L.createElement(L.Fragment, null, Oe, L.createElement(Uh, { page: ne })) : Oe;
});
ff.displayName = 'Link';
var Wh = L.forwardRef(function (
  {
    'aria-current': s = 'page',
    caseSensitive: i = !1,
    className: c = '',
    end: f = !1,
    style: p,
    to: g,
    viewTransition: S,
    children: y,
    ...E
  },
  R,
) {
  let C = Or(g, { relative: E.relative }),
    P = St(),
    j = L.useContext(Zl),
    { navigator: B, basename: T } = L.useContext(nt),
    N = j != null && Zh(C) && S === !0,
    M = B.encodeLocation ? B.encodeLocation(C).pathname : C.pathname,
    A = P.pathname,
    V = j && j.navigation && j.navigation.location ? j.navigation.location.pathname : null;
  (i || ((A = A.toLowerCase()), (V = V ? V.toLowerCase() : null), (M = M.toLowerCase())),
    V && T && (V = Ot(V, T) || V));
  const b = M !== '/' && M.endsWith('/') ? M.length - 1 : M.length;
  let ne = A === M || (!f && A.startsWith(M) && A.charAt(b) === '/'),
    ee = V != null && (V === M || (!f && V.startsWith(M) && V.charAt(M.length) === '/')),
    oe = { isActive: ne, isPending: ee, isTransitioning: N },
    fe = ne ? s : void 0,
    De;
  typeof c == 'function'
    ? (De = c(oe))
    : (De = [c, ne ? 'active' : null, ee ? 'pending' : null, N ? 'transitioning' : null]
        .filter(Boolean)
        .join(' '));
  let Ue = typeof p == 'function' ? p(oe) : p;
  return L.createElement(
    ff,
    { ...E, 'aria-current': fe, className: De, ref: R, style: Ue, to: g, viewTransition: S },
    typeof y == 'function' ? y(oe) : y,
  );
});
Wh.displayName = 'NavLink';
var Vh = L.forwardRef(
  (
    {
      discover: u = 'render',
      fetcherKey: s,
      navigate: i,
      reloadDocument: c,
      replace: f,
      state: p,
      method: g = Yl,
      action: S,
      onSubmit: y,
      relative: E,
      preventScrollReset: R,
      viewTransition: C,
      defaultShouldRevalidate: P,
      ...j
    },
    B,
  ) => {
    let { useTransitions: T } = L.useContext(nt),
      N = Xh(),
      M = Jh(S, { relative: E }),
      A = g.toLowerCase() === 'get' ? 'get' : 'post',
      V = typeof S == 'string' && pi.test(S),
      b = (ne) => {
        if ((y && y(ne), ne.defaultPrevented)) return;
        ne.preventDefault();
        let ee = ne.nativeEvent.submitter,
          oe = (ee == null ? void 0 : ee.getAttribute('formmethod')) || g,
          fe = () =>
            N(ee || ne.currentTarget, {
              fetcherKey: s,
              method: oe,
              navigate: i,
              replace: f,
              state: p,
              relative: E,
              preventScrollReset: R,
              viewTransition: C,
              defaultShouldRevalidate: P,
            });
        T && i !== !1 ? L.startTransition(() => fe()) : fe();
      };
    return L.createElement('form', {
      ref: B,
      method: A,
      action: M,
      onSubmit: c ? y : b,
      ...j,
      'data-discover': !V && u === 'render' ? 'true' : void 0,
    });
  },
);
Vh.displayName = 'Form';
function Qh(u) {
  return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function df(u) {
  let s = L.useContext(Hn);
  return (ge(s, Qh(u)), s);
}
function Kh(
  u,
  {
    target: s,
    replace: i,
    mask: c,
    state: f,
    preventScrollReset: p,
    relative: g,
    viewTransition: S,
    defaultShouldRevalidate: y,
    useTransitions: E,
  } = {},
) {
  let R = gi(),
    C = St(),
    P = Or(u, { relative: g });
  return L.useCallback(
    (j) => {
      if (Ch(j, s)) {
        j.preventDefault();
        let B = i !== void 0 ? i : hn(C) === hn(P),
          T = () =>
            R(u, {
              replace: B,
              mask: c,
              state: f,
              preventScrollReset: p,
              relative: g,
              viewTransition: S,
              defaultShouldRevalidate: y,
            });
        E ? L.startTransition(() => T()) : T();
      }
    },
    [C, R, P, i, c, f, s, u, p, g, S, y, E],
  );
}
function Cm(u) {
  ct(
    typeof URLSearchParams < 'u',
    'You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.',
  );
  let s = L.useRef(fi(u)),
    i = L.useRef(!1),
    c = St(),
    f = L.useMemo(() => xh(c.search, i.current ? null : s.current), [c.search]),
    p = gi(),
    g = L.useCallback(
      (S, y) => {
        const E = fi(typeof S == 'function' ? S(new URLSearchParams(f)) : S);
        ((i.current = !0), p('?' + E, y));
      },
      [p, f],
    );
  return [f, g];
}
var Yh = 0,
  Gh = () => `__${String(++Yh)}__`;
function Xh() {
  let { router: u } = df('useSubmit'),
    { basename: s } = L.useContext(nt),
    i = ph(),
    c = u.fetch,
    f = u.navigate;
  return L.useCallback(
    async (p, g = {}) => {
      let { action: S, method: y, encType: E, formData: R, body: C } = Ph(p, s);
      if (g.navigate === !1) {
        let P = g.fetcherKey || Gh();
        await c(P, i, g.action || S, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: R,
          body: C,
          formMethod: g.method || y,
          formEncType: g.encType || E,
          flushSync: g.flushSync,
        });
      } else
        await f(g.action || S, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: R,
          body: C,
          formMethod: g.method || y,
          formEncType: g.encType || E,
          replace: g.replace,
          state: g.state,
          fromRouteId: i,
          flushSync: g.flushSync,
          viewTransition: g.viewTransition,
        });
    },
    [c, f, s, i],
  );
}
function Jh(u, { relative: s } = {}) {
  let { basename: i } = L.useContext(nt),
    c = L.useContext(wt);
  ge(c, 'useFormAction must be used inside a RouteContext');
  let [f] = c.matches.slice(-1),
    p = { ...Or(u || '.', { relative: s }) },
    g = St();
  if (u == null) {
    p.search = g.search;
    let S = new URLSearchParams(p.search),
      y = S.getAll('index');
    if (y.some((R) => R === '')) {
      (S.delete('index'), y.filter((C) => C).forEach((C) => S.append('index', C)));
      let R = S.toString();
      p.search = R ? `?${R}` : '';
    }
  }
  return (
    (!u || u === '.') &&
      f.route.index &&
      (p.search = p.search ? p.search.replace(/^\?/, '?index&') : '?index'),
    i !== '/' && (p.pathname = p.pathname === '/' ? i : gt([i, p.pathname])),
    hn(p)
  );
}
function Zh(u, { relative: s } = {}) {
  let i = L.useContext(nf);
  ge(
    i != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: c } = df('useViewTransitionState'),
    f = Or(u, { relative: s });
  if (!i.isTransitioning) return !1;
  let p = Ot(i.currentLocation.pathname, c) || i.currentLocation.pathname,
    g = Ot(i.nextLocation.pathname, c) || i.nextLocation.pathname;
  return Xl(f.pathname, g) != null || Xl(f.pathname, p) != null;
}
var xm = Vc();
const qh = {},
  Fc = (u) => {
    let s;
    const i = new Set(),
      c = (R, C) => {
        const P = typeof R == 'function' ? R(s) : R;
        if (!Object.is(P, s)) {
          const j = s;
          ((s = (C ?? (typeof P != 'object' || P === null)) ? P : Object.assign({}, s, P)),
            i.forEach((B) => B(s, j)));
        }
      },
      f = () => s,
      y = {
        setState: c,
        getState: f,
        getInitialState: () => E,
        subscribe: (R) => (i.add(R), () => i.delete(R)),
        destroy: () => {
          ((qh ? 'production' : void 0) !== 'production' &&
            console.warn(
              '[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected.',
            ),
            i.clear());
        },
      },
      E = (s = u(c, f, y));
    return y;
  },
  bh = (u) => (u ? Fc(u) : Fc);
var ri = { exports: {} },
  li = {},
  oi = { exports: {} },
  ui = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Mc;
function em() {
  if (Mc) return ui;
  Mc = 1;
  var u = Ir();
  function s(C, P) {
    return (C === P && (C !== 0 || 1 / C === 1 / P)) || (C !== C && P !== P);
  }
  var i = typeof Object.is == 'function' ? Object.is : s,
    c = u.useState,
    f = u.useEffect,
    p = u.useLayoutEffect,
    g = u.useDebugValue;
  function S(C, P) {
    var j = P(),
      B = c({ inst: { value: j, getSnapshot: P } }),
      T = B[0].inst,
      N = B[1];
    return (
      p(
        function () {
          ((T.value = j), (T.getSnapshot = P), y(T) && N({ inst: T }));
        },
        [C, j, P],
      ),
      f(
        function () {
          return (
            y(T) && N({ inst: T }),
            C(function () {
              y(T) && N({ inst: T });
            })
          );
        },
        [C],
      ),
      g(j),
      j
    );
  }
  function y(C) {
    var P = C.getSnapshot;
    C = C.value;
    try {
      var j = P();
      return !i(C, j);
    } catch {
      return !0;
    }
  }
  function E(C, P) {
    return P();
  }
  var R =
    typeof window > 'u' ||
    typeof window.document > 'u' ||
    typeof window.document.createElement > 'u'
      ? E
      : S;
  return (
    (ui.useSyncExternalStore = u.useSyncExternalStore !== void 0 ? u.useSyncExternalStore : R),
    ui
  );
}
var Uc;
function tm() {
  return (Uc || ((Uc = 1), (oi.exports = em())), oi.exports);
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var jc;
function nm() {
  if (jc) return li;
  jc = 1;
  var u = Ir(),
    s = tm();
  function i(E, R) {
    return (E === R && (E !== 0 || 1 / E === 1 / R)) || (E !== E && R !== R);
  }
  var c = typeof Object.is == 'function' ? Object.is : i,
    f = s.useSyncExternalStore,
    p = u.useRef,
    g = u.useEffect,
    S = u.useMemo,
    y = u.useDebugValue;
  return (
    (li.useSyncExternalStoreWithSelector = function (E, R, C, P, j) {
      var B = p(null);
      if (B.current === null) {
        var T = { hasValue: !1, value: null };
        B.current = T;
      } else T = B.current;
      B = S(
        function () {
          function M(ee) {
            if (!A) {
              if (((A = !0), (V = ee), (ee = P(ee)), j !== void 0 && T.hasValue)) {
                var oe = T.value;
                if (j(oe, ee)) return (b = oe);
              }
              return (b = ee);
            }
            if (((oe = b), c(V, ee))) return oe;
            var fe = P(ee);
            return j !== void 0 && j(oe, fe) ? ((V = ee), oe) : ((V = ee), (b = fe));
          }
          var A = !1,
            V,
            b,
            ne = C === void 0 ? null : C;
          return [
            function () {
              return M(R());
            },
            ne === null
              ? void 0
              : function () {
                  return M(ne());
                },
          ];
        },
        [R, C, P, j],
      );
      var N = f(E, B[0], B[1]);
      return (
        g(
          function () {
            ((T.hasValue = !0), (T.value = N));
          },
          [N],
        ),
        y(N),
        N
      );
    }),
    li
  );
}
var $c;
function rm() {
  return ($c || (($c = 1), (ri.exports = nm())), ri.exports);
}
var lm = rm();
const om = di(lm),
  pf = {},
  { useDebugValue: um } = pp,
  { useSyncExternalStoreWithSelector: im } = om;
let Ac = !1;
const am = (u) => u;
function sm(u, s = am, i) {
  (pf ? 'production' : void 0) !== 'production' &&
    i &&
    !Ac &&
    (console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937",
    ),
    (Ac = !0));
  const c = im(u.subscribe, u.getState, u.getServerState || u.getInitialState, s, i);
  return (um(c), c);
}
const Bc = (u) => {
    (pf ? 'production' : void 0) !== 'production' &&
      typeof u != 'function' &&
      console.warn(
        "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.",
      );
    const s = typeof u == 'function' ? bh(u) : u,
      i = (c, f) => sm(s, c, f);
    return (Object.assign(i, s), i);
  },
  Rm = (u) => (u ? Bc(u) : Bc),
  cm = {};
function fm(u, s) {
  let i;
  try {
    i = u();
  } catch {
    return;
  }
  return {
    getItem: (f) => {
      var p;
      const g = (y) => (y === null ? null : JSON.parse(y, void 0)),
        S = (p = i.getItem(f)) != null ? p : null;
      return S instanceof Promise ? S.then(g) : g(S);
    },
    setItem: (f, p) => i.setItem(f, JSON.stringify(p, void 0)),
    removeItem: (f) => i.removeItem(f),
  };
}
const zr = (u) => (s) => {
    try {
      const i = u(s);
      return i instanceof Promise
        ? i
        : {
            then(c) {
              return zr(c)(i);
            },
            catch(c) {
              return this;
            },
          };
    } catch (i) {
      return {
        then(c) {
          return this;
        },
        catch(c) {
          return zr(c)(i);
        },
      };
    }
  },
  dm = (u, s) => (i, c, f) => {
    let p = {
        getStorage: () => localStorage,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
        partialize: (N) => N,
        version: 0,
        merge: (N, M) => ({ ...M, ...N }),
        ...s,
      },
      g = !1;
    const S = new Set(),
      y = new Set();
    let E;
    try {
      E = p.getStorage();
    } catch {}
    if (!E)
      return u(
        (...N) => {
          (console.warn(
            `[zustand persist middleware] Unable to update item '${p.name}', the given storage is currently unavailable.`,
          ),
            i(...N));
        },
        c,
        f,
      );
    const R = zr(p.serialize),
      C = () => {
        const N = p.partialize({ ...c() });
        let M;
        const A = R({ state: N, version: p.version })
          .then((V) => E.setItem(p.name, V))
          .catch((V) => {
            M = V;
          });
        if (M) throw M;
        return A;
      },
      P = f.setState;
    f.setState = (N, M) => {
      (P(N, M), C());
    };
    const j = u(
      (...N) => {
        (i(...N), C());
      },
      c,
      f,
    );
    let B;
    const T = () => {
      var N;
      if (!E) return;
      ((g = !1), S.forEach((A) => A(c())));
      const M = ((N = p.onRehydrateStorage) == null ? void 0 : N.call(p, c())) || void 0;
      return zr(E.getItem.bind(E))(p.name)
        .then((A) => {
          if (A) return p.deserialize(A);
        })
        .then((A) => {
          if (A)
            if (typeof A.version == 'number' && A.version !== p.version) {
              if (p.migrate) return p.migrate(A.state, A.version);
              console.error(
                "State loaded from storage couldn't be migrated since no migrate function was provided",
              );
            } else return A.state;
        })
        .then((A) => {
          var V;
          return ((B = p.merge(A, (V = c()) != null ? V : j)), i(B, !0), C());
        })
        .then(() => {
          (M == null || M(B, void 0), (g = !0), y.forEach((A) => A(B)));
        })
        .catch((A) => {
          M == null || M(void 0, A);
        });
    };
    return (
      (f.persist = {
        setOptions: (N) => {
          ((p = { ...p, ...N }), N.getStorage && (E = N.getStorage()));
        },
        clearStorage: () => {
          E == null || E.removeItem(p.name);
        },
        getOptions: () => p,
        rehydrate: () => T(),
        hasHydrated: () => g,
        onHydrate: (N) => (
          S.add(N),
          () => {
            S.delete(N);
          }
        ),
        onFinishHydration: (N) => (
          y.add(N),
          () => {
            y.delete(N);
          }
        ),
      }),
      T(),
      B || j
    );
  },
  pm = (u, s) => (i, c, f) => {
    let p = {
        storage: fm(() => localStorage),
        partialize: (T) => T,
        version: 0,
        merge: (T, N) => ({ ...N, ...T }),
        ...s,
      },
      g = !1;
    const S = new Set(),
      y = new Set();
    let E = p.storage;
    if (!E)
      return u(
        (...T) => {
          (console.warn(
            `[zustand persist middleware] Unable to update item '${p.name}', the given storage is currently unavailable.`,
          ),
            i(...T));
        },
        c,
        f,
      );
    const R = () => {
        const T = p.partialize({ ...c() });
        return E.setItem(p.name, { state: T, version: p.version });
      },
      C = f.setState;
    f.setState = (T, N) => {
      (C(T, N), R());
    };
    const P = u(
      (...T) => {
        (i(...T), R());
      },
      c,
      f,
    );
    f.getInitialState = () => P;
    let j;
    const B = () => {
      var T, N;
      if (!E) return;
      ((g = !1),
        S.forEach((A) => {
          var V;
          return A((V = c()) != null ? V : P);
        }));
      const M =
        ((N = p.onRehydrateStorage) == null ? void 0 : N.call(p, (T = c()) != null ? T : P)) ||
        void 0;
      return zr(E.getItem.bind(E))(p.name)
        .then((A) => {
          if (A)
            if (typeof A.version == 'number' && A.version !== p.version) {
              if (p.migrate) return [!0, p.migrate(A.state, A.version)];
              console.error(
                "State loaded from storage couldn't be migrated since no migrate function was provided",
              );
            } else return [!1, A.state];
          return [!1, void 0];
        })
        .then((A) => {
          var V;
          const [b, ne] = A;
          if (((j = p.merge(ne, (V = c()) != null ? V : P)), i(j, !0), b)) return R();
        })
        .then(() => {
          (M == null || M(j, void 0), (j = c()), (g = !0), y.forEach((A) => A(j)));
        })
        .catch((A) => {
          M == null || M(void 0, A);
        });
    };
    return (
      (f.persist = {
        setOptions: (T) => {
          ((p = { ...p, ...T }), T.storage && (E = T.storage));
        },
        clearStorage: () => {
          E == null || E.removeItem(p.name);
        },
        getOptions: () => p,
        rehydrate: () => B(),
        hasHydrated: () => g,
        onHydrate: (T) => (
          S.add(T),
          () => {
            S.delete(T);
          }
        ),
        onFinishHydration: (T) => (
          y.add(T),
          () => {
            y.delete(T);
          }
        ),
      }),
      p.skipHydration || B(),
      j || P
    );
  },
  hm = (u, s) =>
    'getStorage' in s || 'serialize' in s || 'deserialize' in s
      ? ((cm ? 'production' : void 0) !== 'production' &&
          console.warn(
            '[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead.',
          ),
        dm(u, s))
      : pm(u, s),
  _m = hm;
var ii = { exports: {} },
  ai = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Hc;
function mm() {
  return (
    Hc ||
      ((Hc = 1),
      (function (u) {
        function s(_, U) {
          var I = _.length;
          _.push(U);
          e: for (; 0 < I;) {
            var v = (I - 1) >>> 1,
              z = _[v];
            if (0 < f(z, U)) ((_[v] = U), (_[I] = z), (I = v));
            else break e;
          }
        }
        function i(_) {
          return _.length === 0 ? null : _[0];
        }
        function c(_) {
          if (_.length === 0) return null;
          var U = _[0],
            I = _.pop();
          if (I !== U) {
            _[0] = I;
            e: for (var v = 0, z = _.length, q = z >>> 1; v < q;) {
              var Z = 2 * (v + 1) - 1,
                le = _[Z],
                te = Z + 1,
                ae = _[te];
              if (0 > f(le, I))
                te < z && 0 > f(ae, le)
                  ? ((_[v] = ae), (_[te] = I), (v = te))
                  : ((_[v] = le), (_[Z] = I), (v = Z));
              else if (te < z && 0 > f(ae, I)) ((_[v] = ae), (_[te] = I), (v = te));
              else break e;
            }
          }
          return U;
        }
        function f(_, U) {
          var I = _.sortIndex - U.sortIndex;
          return I !== 0 ? I : _.id - U.id;
        }
        if (typeof performance == 'object' && typeof performance.now == 'function') {
          var p = performance;
          u.unstable_now = function () {
            return p.now();
          };
        } else {
          var g = Date,
            S = g.now();
          u.unstable_now = function () {
            return g.now() - S;
          };
        }
        var y = [],
          E = [],
          R = 1,
          C = null,
          P = 3,
          j = !1,
          B = !1,
          T = !1,
          N = typeof setTimeout == 'function' ? setTimeout : null,
          M = typeof clearTimeout == 'function' ? clearTimeout : null,
          A = typeof setImmediate < 'u' ? setImmediate : null;
        typeof navigator < 'u' &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function V(_) {
          for (var U = i(E); U !== null;) {
            if (U.callback === null) c(E);
            else if (U.startTime <= _) (c(E), (U.sortIndex = U.expirationTime), s(y, U));
            else break;
            U = i(E);
          }
        }
        function b(_) {
          if (((T = !1), V(_), !B))
            if (i(y) !== null) ((B = !0), Ne(ne));
            else {
              var U = i(E);
              U !== null && de(b, U.startTime - _);
            }
        }
        function ne(_, U) {
          ((B = !1), T && ((T = !1), M(fe), (fe = -1)), (j = !0));
          var I = P;
          try {
            for (V(U), C = i(y); C !== null && (!(C.expirationTime > U) || (_ && !rt()));) {
              var v = C.callback;
              if (typeof v == 'function') {
                ((C.callback = null), (P = C.priorityLevel));
                var z = v(C.expirationTime <= U);
                ((U = u.unstable_now()),
                  typeof z == 'function' ? (C.callback = z) : C === i(y) && c(y),
                  V(U));
              } else c(y);
              C = i(y);
            }
            if (C !== null) var q = !0;
            else {
              var Z = i(E);
              (Z !== null && de(b, Z.startTime - U), (q = !1));
            }
            return q;
          } finally {
            ((C = null), (P = I), (j = !1));
          }
        }
        var ee = !1,
          oe = null,
          fe = -1,
          De = 5,
          Ue = -1;
        function rt() {
          return !(u.unstable_now() - Ue < De);
        }
        function je() {
          if (oe !== null) {
            var _ = u.unstable_now();
            Ue = _;
            var U = !0;
            try {
              U = oe(!0, _);
            } finally {
              U ? ke() : ((ee = !1), (oe = null));
            }
          } else ee = !1;
        }
        var ke;
        if (typeof A == 'function')
          ke = function () {
            A(je);
          };
        else if (typeof MessageChannel < 'u') {
          var Oe = new MessageChannel(),
            Ce = Oe.port2;
          ((Oe.port1.onmessage = je),
            (ke = function () {
              Ce.postMessage(null);
            }));
        } else
          ke = function () {
            N(je, 0);
          };
        function Ne(_) {
          ((oe = _), ee || ((ee = !0), ke()));
        }
        function de(_, U) {
          fe = N(function () {
            _(u.unstable_now());
          }, U);
        }
        ((u.unstable_IdlePriority = 5),
          (u.unstable_ImmediatePriority = 1),
          (u.unstable_LowPriority = 4),
          (u.unstable_NormalPriority = 3),
          (u.unstable_Profiling = null),
          (u.unstable_UserBlockingPriority = 2),
          (u.unstable_cancelCallback = function (_) {
            _.callback = null;
          }),
          (u.unstable_continueExecution = function () {
            B || j || ((B = !0), Ne(ne));
          }),
          (u.unstable_forceFrameRate = function (_) {
            0 > _ || 125 < _
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (De = 0 < _ ? Math.floor(1e3 / _) : 5);
          }),
          (u.unstable_getCurrentPriorityLevel = function () {
            return P;
          }),
          (u.unstable_getFirstCallbackNode = function () {
            return i(y);
          }),
          (u.unstable_next = function (_) {
            switch (P) {
              case 1:
              case 2:
              case 3:
                var U = 3;
                break;
              default:
                U = P;
            }
            var I = P;
            P = U;
            try {
              return _();
            } finally {
              P = I;
            }
          }),
          (u.unstable_pauseExecution = function () {}),
          (u.unstable_requestPaint = function () {}),
          (u.unstable_runWithPriority = function (_, U) {
            switch (_) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                _ = 3;
            }
            var I = P;
            P = _;
            try {
              return U();
            } finally {
              P = I;
            }
          }),
          (u.unstable_scheduleCallback = function (_, U, I) {
            var v = u.unstable_now();
            switch (
              (typeof I == 'object' && I !== null
                ? ((I = I.delay), (I = typeof I == 'number' && 0 < I ? v + I : v))
                : (I = v),
              _)
            ) {
              case 1:
                var z = -1;
                break;
              case 2:
                z = 250;
                break;
              case 5:
                z = 1073741823;
                break;
              case 4:
                z = 1e4;
                break;
              default:
                z = 5e3;
            }
            return (
              (z = I + z),
              (_ = {
                id: R++,
                callback: U,
                priorityLevel: _,
                startTime: I,
                expirationTime: z,
                sortIndex: -1,
              }),
              I > v
                ? ((_.sortIndex = I),
                  s(E, _),
                  i(y) === null && _ === i(E) && (T ? (M(fe), (fe = -1)) : (T = !0), de(b, I - v)))
                : ((_.sortIndex = z), s(y, _), B || j || ((B = !0), Ne(ne))),
              _
            );
          }),
          (u.unstable_shouldYield = rt),
          (u.unstable_wrapCallback = function (_) {
            var U = P;
            return function () {
              var I = P;
              P = U;
              try {
                return _.apply(this, arguments);
              } finally {
                P = I;
              }
            };
          }));
      })(ai)),
    ai
  );
}
var Wc;
function vm() {
  return (Wc || ((Wc = 1), (ii.exports = mm())), ii.exports);
}
var Pm = vm();
export {
  Em as B,
  ff as L,
  Sm as N,
  pp as R,
  Ir as a,
  vm as b,
  gp as c,
  Rm as d,
  km as e,
  yh as f,
  di as g,
  wm as h,
  Cm as i,
  ym as j,
  gi as k,
  gm as l,
  xm as m,
  _m as p,
  L as r,
  Pm as s,
  St as u,
};
