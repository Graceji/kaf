import { NativeRequest } from '@elux/core';
import { AppConfig } from '@elux/app';
export { DocumentHead, Switch, Else, Link } from '@elux/vue-components';
export type { DocumentHeadProps, SwitchProps, ElseProps, LinkProps } from '@elux/vue-components';
export * from '@elux/app';
export declare function createApp(appConfig: AppConfig): import("vue").App<Element> & {
    render(options?: import("@elux/core").RenderOptions | undefined): Promise<void>;
};
export declare function createSSR(appConfig: AppConfig, nativeRequest: NativeRequest): import("vue").App<Element> & {
    render(options?: import("@elux/core").RenderOptions | undefined): Promise<string>;
};
//# sourceMappingURL=index.d.ts.map