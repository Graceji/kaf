import { AppConfig } from '@aimkaf/app';
import { RenderOptions, RouterInitOptions } from '@aimkaf/core';
export { DocumentHead, Else, Link, Switch } from '@aimkaf/react-components';
export type { DocumentHeadProps, ElseProps, LinkProps, SwitchProps } from '@aimkaf/react-components';
export { connectRedux, connectStore, createSelectorHook, shallowEqual, useSelector } from '@aimkaf/react-redux';
export type { GetProps, InferableComponentEnhancerWithProps } from '@aimkaf/react-redux';
export * from '@aimkaf/app';
/**
 * @public
 */
export declare type KAFApp = {
    render(options?: RenderOptions): Promise<void>;
};
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
export declare function createApp(appConfig: AppConfig): KAFApp;
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
export declare function createSSR(appConfig: AppConfig, routerOptions: RouterInitOptions): {
    render(options?: RenderOptions | undefined): Promise<string>;
};
//# sourceMappingURL=index.d.ts.map