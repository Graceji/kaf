import { AppConfig } from '@elux/app';
import { RenderOptions, RouterInitOptions } from '@elux/core';
import { App } from 'vue';
export { DocumentHead, Else, Link, Switch, connectStore } from '@elux/vue-components';
export type { DocumentHeadProps, ElseProps, LinkProps, SwitchProps } from '@elux/vue-components';
export * from '@elux/app';
/**
 * @public
 */
export declare type EluxApp = App & {
    render(options?: RenderOptions): Promise<void>;
};
/**
 * 创建应用(CSR)
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
export declare function createApp(appConfig: AppConfig): EluxApp;
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
export declare function createSSR(appConfig: AppConfig, routerOptions: RouterInitOptions): App & {
    render(options?: RenderOptions | undefined): Promise<string>;
};
//# sourceMappingURL=index.d.ts.map