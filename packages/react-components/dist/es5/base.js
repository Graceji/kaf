import { buildConfigSetter, env } from '@aimkaf/core';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
export var KAFContextComponent = createContext({
  router: null
});
export function UseRouter() {
  var KAFContext = useContext(KAFContextComponent);
  return KAFContext.router;
}
export var reactComponentsConfig = {
  hydrate: undefined,
  render: undefined,
  renderToString: undefined
};
export var setReactComponentsConfig = buildConfigSetter(reactComponentsConfig);
export function useEventCallback(fn, dependencies) {
  var ref = useRef(function () {
    env.console.log(new Error('Cannot call an event handler while rendering.'));
  });
  useEffect(function () {
    ref.current = fn;
  }, [fn].concat(dependencies));
  return useCallback(function () {
    var fun = ref.current;
    return fun.apply(void 0, arguments);
  }, [ref]);
}