import { buildConfigSetter, env } from '@aimkaf/core';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
export const KAFContextComponent = createContext({
  router: null
});
export function UseRouter() {
  const KAFContext = useContext(KAFContextComponent);
  return KAFContext.router;
}
export const reactComponentsConfig = {
  hydrate: undefined,
  render: undefined,
  renderToString: undefined
};
export const setReactComponentsConfig = buildConfigSetter(reactComponentsConfig);
export function useEventCallback(fn, dependencies) {
  const ref = useRef((...args) => {
    env.console.log(new Error('Cannot call an event handler while rendering.'));
  });
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);
  return useCallback((...args) => {
    const fun = ref.current;
    return fun(...args);
  }, [ref]);
}