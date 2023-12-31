import {buildConfigSetter, env, IRouter, KAFContext} from '@aimkaf/core';
import {createContext, useCallback, useContext, useEffect, useRef} from 'react';

export const KAFContextComponent = createContext<KAFContext>({router: null as any});

export function UseRouter(): IRouter {
  const KAFContext = useContext(KAFContextComponent);
  return KAFContext.router;
}

export const reactComponentsConfig: {
  hydrate?: (component: any, container: any) => void;
  render?: (component: any, container: any) => void;
  renderToString?: (component: any) => string;
} = {
  hydrate: undefined,
  render: undefined,
  renderToString: undefined,
};

export const setReactComponentsConfig = buildConfigSetter(reactComponentsConfig);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useEventCallback<A extends any[]>(fn: (...args: A) => void, dependencies: any[]) {
  const ref = useRef((...args: A) => {
    env.console.log(new Error('Cannot call an event handler while rendering.'));
  });

  useEffect(() => {
    ref.current = fn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, ...dependencies]);

  return useCallback(
    (...args: A) => {
      const fun = ref.current;
      return fun(...args);
    },
    [ref]
  );
}
