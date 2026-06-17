// Required for React 18/19 — tells React that act() is supported in this environment.
// Without this, any test that calls act() (directly or via renderToStaticMarkup,
// ReactDOM.createRoot, or React hooks) emits a stderr warning in Vitest 3.2+.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

// Node.js 22+ adds an experimental globalThis.localStorage that vitest does not
// override with jsdom's version (absent from vitest's KEYS allowlist). Redirect it
// to the jsdom window so tests can use localStorage/sessionStorage normally.
type JsdomGlobal = typeof globalThis & { jsdom?: { window: Window & typeof globalThis } };
const _jsdom = (globalThis as JsdomGlobal).jsdom;
if (_jsdom) {
  Object.defineProperty(globalThis, 'localStorage', {
    get: () => _jsdom.window.localStorage,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'sessionStorage', {
    get: () => _jsdom.window.sessionStorage,
    configurable: true,
  });
}
