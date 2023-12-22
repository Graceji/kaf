import { Dispatch, KAFComponent } from '@aimkaf/core';
import { ComponentClass, ComponentType, FunctionComponent } from 'react';
import type { ConnectOptions } from 'react-redux/es/components/connect';
/**
 * 用于{@link connectStore }
 *
 * @public
 */
export declare type GetProps<C> = C extends FunctionComponent<infer P> ? P : C extends ComponentClass<infer P> ? P : never;
/**
 * 用于{@link connectStore }
 *
 * @public
 */
export declare type InferableComponentEnhancerWithProps<TInjectedProps> = <C>(component: C) => KAFComponent & ComponentType<Omit<GetProps<C>, keyof TInjectedProps>>;
/**
 * 连接store与react组件
 *
 * @remarks
 * 参见{@link https://react-redux.js.org/api/connect | react-redux/connect }
 *
 * @param mapStateToProps - state与props之间的映射与转换
 * @param options - 连接参数设置
 *
 * @public
 */
export declare function connectStore<S = {}, D = {}, W = {}>(mapStateToProps?: (state: any, owner: W) => S, options?: ConnectOptions<any, S, W>): InferableComponentEnhancerWithProps<S & D & {
    dispatch: Dispatch;
}>;
/**
 * 为{@link connectStore }别名
 *
 * @deprecated 请使用 connectStore
 *
 * @public
 */
export declare const connectRedux: typeof connectStore;
export { batch, connect, createSelectorHook, shallowEqual, useSelector } from 'react-redux';
//# sourceMappingURL=index.d.ts.map