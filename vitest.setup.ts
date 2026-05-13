// Required for React 18/19 — tells React that act() is supported in this environment.
// Without this, any test that calls act() (directly or via renderToStaticMarkup,
// ReactDOM.createRoot, or React hooks) emits a stderr warning in Vitest 3.2+.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
