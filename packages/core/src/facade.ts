import type {
  AsyncKAFComponent,
  CommonModel,
  CommonModelClass,
  KAFComponent,
} from "./basic";
import { exportModuleFacade } from "./module";

/*** @public */
export type HandlerToAction<T> = T extends (...args: infer P) => any
  ? (...args: P) => {
      type: string;
    }
  : never;

/*** @public */
export type PickModelActions<T> = Pick<
  { [K in keyof T]: HandlerToAction<T[K]> },
  {
    [K in keyof T]: T[K] extends Function
      ? Exclude<K, "onActive" | "onInactive" | "onMount">
      : never;
  }[keyof T]
>;

/*** @public */
export type GetPromiseComponent<T> = T extends () => Promise<{
  default: infer R;
}>
  ? R
  : T;

/*** @public */
export type ReturnComponents<
  CS extends Record<string, KAFComponent | AsyncKAFComponent>
> = {
  [K in keyof CS]: GetPromiseComponent<CS[K]>;
};

/**
 * 向外封装并导出Module
 *
 * @param moduleName - 模块名称，不能重复
 * @param ModelClass - Model构造类
 * @param components - 导出的组件或视图，参见 {@link exportView}
 * @param data - 导出其它任何数据
 *
 * @returns
 * 返回实现 {@link CommonModule} 接口的微模块
 *
 * @example
 * ```js
 * import UserModel from './model';
 * import MainView from './views/Main';
 *
 * exportModule('user', UserModel, {main: MainView, list: ()=>import('./views/List')})
 * ```
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function exportModule<
  TModuleName extends string,
  TModel extends CommonModel,
  TComponents extends {
    [componentName: string]: KAFComponent | AsyncKAFComponent;
  },
  D
>(
  moduleName: TModuleName,
  ModelClass: CommonModelClass<TModel>,
  components: TComponents,
  data?: D
) {
  return exportModuleFacade(moduleName, ModelClass, components, data) as {
    moduleName: TModuleName;
    ModelClass: CommonModelClass;
    state: TModel["state"];
    //state: GetPromiseReturn<ReturnType<TModel['onInit']>>;
    actions: PickModelActions<TModel>;
    components: ReturnComponents<TComponents>;
    data: D;
  };
}
