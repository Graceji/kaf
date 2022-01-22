import { IStore, LoadComponent, ModuleGetter, IStoreMiddleware, IStoreLogger, RootModuleFacade, RootModuleAPI, RootModuleActions, ICoreRouter, State } from '@elux/core';
import { IEluxRouter, RouteState } from '@elux/route';
export { ActionTypes, LoadingState, env, effect, errorAction, reducer, action, mutation, setLoading, logger, isServer, serverSide, clientSide, deepClone, deepMerge, deepMergeState, exportModule, isProcessedError, setProcessedError, exportView, exportComponent, modelHotReplacement, EmptyModuleHandlers, TaskCounter, SingleDispatcher, CoreModuleHandlers as BaseModuleHandlers, errorProcessed, } from '@elux/core';
export { RouteActionTypes, location, createRouteModule, safeJsonParse } from '@elux/route';
export type { RootModuleFacade as Facade, Dispatch, IStore, EluxComponent, LoadComponent, ICoreRouter, ModuleGetter, IStoreMiddleware, IStoreLogger, IFlux, RootModuleAPI, RootModuleActions, GetState, State, ICoreRouteState, IModuleHandlersClass, PickActions, ModuleFacade, GetPromiseModule, ReturnComponents, CommonModule, IModuleHandlers, GetPromiseComponent, ActionsThis, Action, HandlerThis, PickHandler, } from '@elux/core';
export type { LocationState, PagenameMap, NativeLocationMap, HistoryAction, EluxLocation, NativeLocation, StateLocation, RouteState, DeepPartial, IEluxRouter, RootParams, ILocationTransform, IHistoryRecord, } from '@elux/route';
/**
 * @internal
 */
export declare type ComputedStore<T> = {
    [K in keyof T]-?: () => T[K];
};
/**
 * @internal
 */
export declare const appConfig: {
    loadComponent: LoadComponent;
    useRouter: () => ICoreRouter;
    useStore: () => IStore;
};
/**
 * @internal
 */
export declare const setAppConfig: (config: Partial<{
    loadComponent: LoadComponent;
    useRouter: () => ICoreRouter;
    useStore: () => IStore;
}>) => void;
/**
 * @internal
 */
export interface UserConfig {
    maxHistory?: number;
    maxLocationCache?: number;
    NSP?: string;
    MSP?: string;
    DepthTimeOnLoading?: number;
    indexUrl?: string;
    notfoundPagename: string;
    paramsKey: string;
    AppModuleName?: string;
    RouteModuleName?: string;
    disableNativeRouter?: boolean;
}
/**
 * @internal
 */
export declare function setUserConfig(conf: UserConfig): void;
/**
 * @internal
 */
export interface RenderOptions {
    viewName?: string;
    id?: string;
    ssrKey?: string;
}
/**
 * @internal
 */
export interface ContextWrap {
}
/**
 * @internal
 */
export declare type AttachMP<App> = (app: App, moduleGetter: ModuleGetter, storeMiddlewares?: IStoreMiddleware[], storeLogger?: IStoreLogger) => App & {
    render(): {
        store: IStore;
        context: ContextWrap;
    };
};
/**
 * @internal
 */
export declare type CreateMP = (moduleGetter: ModuleGetter, storeMiddlewares?: IStoreMiddleware[], storeLogger?: IStoreLogger) => {
    render(): {
        store: IStore;
        context: ContextWrap;
    };
};
/**
 * @internal
 */
export declare type CreateApp<INS = {}> = (moduleGetter: ModuleGetter, storeMiddlewares?: IStoreMiddleware[], storeLogger?: IStoreLogger) => INS & {
    render({ id, ssrKey, viewName }?: RenderOptions): Promise<void>;
};
/**
 * @internal
 */
export declare type CreateSSR<INS = {}> = (moduleGetter: ModuleGetter, url: string, nativeData: any, storeMiddlewares?: IStoreMiddleware[], storeLogger?: IStoreLogger) => INS & {
    render({ id, ssrKey, viewName }?: RenderOptions): Promise<string>;
};
/**
 * @internal
 */
export interface EluxContext {
    deps?: Record<string, boolean>;
    documentHead: string;
    router?: IEluxRouter<any, string>;
}
/**
 * @internal
 */
export declare function createBaseMP<INS = {}, S extends State = any>(ins: INS, router: IEluxRouter, render: (eluxContext: EluxContext, ins: INS) => any, storeInitState: (data: S) => S, storeMiddlewares?: IStoreMiddleware[], storeLogger?: IStoreLogger): INS & {
    render(): {
        store: IStore;
        context: ContextWrap;
    };
};
/**
 * @internal
 */
export declare function createBaseApp<INS = {}, S extends State = any>(ins: INS, router: IEluxRouter, render: (id: string, component: any, eluxContext: EluxContext, fromSSR: boolean, ins: INS, store: IStore) => void, storeInitState: (data: S) => S, storeMiddlewares?: IStoreMiddleware[], storeLogger?: IStoreLogger): INS & {
    render({ id, ssrKey, viewName }?: RenderOptions): Promise<void>;
};
/**
 * @internal
 */
export declare function createBaseSSR<INS = {}, S extends State = any>(ins: INS, router: IEluxRouter, render: (id: string, component: any, eluxContext: EluxContext, ins: INS, store: IStore) => Promise<string>, storeInitState: (data: S) => S, storeMiddlewares?: IStoreMiddleware[], storeLogger?: IStoreLogger): INS & {
    render({ id, ssrKey, viewName }?: RenderOptions): Promise<string>;
};
/**
 * @internal
 */
export declare function patchActions(typeName: string, json?: string): void;
/**
 * @internal
 */
export declare type GetBaseAPP<A extends RootModuleFacade, LoadComponentOptions, R extends string = 'route', NT = unknown> = {
    State: {
        [M in keyof A]: A[M]['state'];
    };
    RouteParams: {
        [M in keyof A]?: A[M]['params'];
    };
    RouteState: RouteState<{
        [M in keyof A]?: A[M]['params'];
    }>;
    Router: IEluxRouter<{
        [M in keyof A]: A[M]['params'];
    }, Extract<keyof A[R]['components'], string>, NT>;
    GetActions<N extends keyof A>(...args: N[]): {
        [K in N]: A[K]['actions'];
    };
    LoadComponent: LoadComponent<A, LoadComponentOptions>;
    Modules: RootModuleAPI<A>;
    Actions: RootModuleActions<A>;
    Pagename: keyof A[R]['components'];
    Pagenames: {
        [K in keyof A[R]['components']]: K;
    };
};
/**
 * @internal
 */
export declare function getApp<T extends {
    State: any;
    GetActions: any;
    LoadComponent: any;
    Modules: any;
    Pagenames: any;
    Router: any;
}>(demoteForProductionOnly?: boolean, injectActions?: Record<string, string[]>): Pick<T, 'GetActions' | 'LoadComponent' | 'Modules' | 'Pagenames'> & {
    GetRouter: () => T['Router'];
    useRouter: () => T['Router'];
    useStore: () => IStore<T['State']>;
};
//# sourceMappingURL=index.d.ts.map