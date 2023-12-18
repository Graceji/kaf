import { hydrate, render } from "react-dom";

import { AppConfig } from "@kaf/app";
import {
  buildApp,
  buildSSR,
  env,
  RenderOptions,
  RouterInitOptions,
} from "@kaf/core";
import { setReactComponentsConfig } from "@kaf/react-components";
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderToString } from "@kaf/react-web/server";
import { createClientRouter, createServerRouter } from "@kaf/route-browser";

export { DocumentHead, Else, Link, Switch } from "@kaf/react-components";
export type {
  DocumentHeadProps,
  ElseProps,
  LinkProps,
  SwitchProps,
} from "@kaf/react-components";

export {
  connectRedux,
  connectStore,
  createSelectorHook,
  shallowEqual,
  useSelector,
} from "@kaf/react-redux";
export type {
  GetProps,
  InferableComponentEnhancerWithProps,
} from "@kaf/react-redux";

export * from "@kaf/app";

setReactComponentsConfig({
  hydrate,
  render,
  renderToString,
});

/**
 * @public
 */
export type KAFApp = {
  render(options?: RenderOptions): Promise<void>;
};

let cientSingleton: KAFApp = undefined as any;

/**
 * 创建应用(CSR)
 *
 * @remarks
 * 应用唯一的创建入口，用于客户端渲染(CSR)。服务端渲染(SSR)请使用{@link createSSR}
 *
 * @param appConfig - 应用配置
 *
 * @returns
 * 返回包含`render`方法的实例，参见{@link RenderOptions}
 *
 * @example
 * ```js
 * createApp(config)
 * .render()
 * .then(() => {
 *   const initLoading = document.getElementById('root-loading');
 *   if (initLoading) {
 *     initLoading.parentNode!.removeChild(initLoading);
 *   }
 * });
 * ```
 *
 * @public
 */
export function createApp(appConfig: AppConfig): KAFApp {
  if (cientSingleton) {
    return cientSingleton;
  }
  const router = createClientRouter();
  cientSingleton = {
    render() {
      return Promise.resolve();
    },
  };
  const { pathname, search, hash } = env.location!;
  return buildApp({}, router, { url: [pathname, search, hash].join("") });
}

/**
 * 创建应用(SSR)
 *
 * @remarks
 * 应用唯一的创建入口，用于服务端渲染(SSR)。客户端渲染(CSR)请使用{@link createApp}
 *
 * @param appConfig - 应用配置
 * @param routerOptions - 原生请求
 *
 * @returns
 * 返回包含`render`方法的下一步实例，参见{@link RenderOptions}
 *
 * @example
 * ```js
 * export default function server(request: {url: string}, response: any): Promise<string> {
 *   return createSSR(moduleGetter, request.url, {request, response}).render();
 * }
 * ```
 * @public
 */
export function createSSR(
  appConfig: AppConfig,
  routerOptions: RouterInitOptions
): {
  render(options?: RenderOptions | undefined): Promise<string>;
} {
  const router = createServerRouter();
  return buildSSR({}, router, routerOptions);
}
