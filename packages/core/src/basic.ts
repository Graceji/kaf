/**
 * 模块状态
 *
 * @public
 */
export type ModuleState = { [key: string]: any };

/*** @public */
export type ActionCreator = (...args: any[]) => Action;

/** @public */
export type ModelAsCreators = { [actionName: string]: ActionCreator };

/**
 * 定义Action
 *
 * @public
 */
export interface Action {
  /**
   * type通常由ModuleName.ActionName组成
   */
  type: string;
  /**
   * 同时有多个handler时，可以特别指明处理顺序，通常无需设置
   */
  priority?: string[];
  /**
   * action载体
   */
  payload?: any[];
}

/**
 * 派发Action
 *
 * @public
 */
export type Dispatch = (action: Action) => void | Promise<void>;

/**
 * 全局状态
 *
 * @remarks
 * 由多个 {@link ModuleState} 按moduleName组合起来的全局状态
 *
 * @public
 */
export type StoreState = { [moduleName: string]: ModuleState | undefined };

/**
 * 获取全局状态
 *
 * @param moduleName - 如果指明moduleName则返回该模块的ModuleState，否则返回全局StoreState
 *
 * @public
 */
export interface GetState<TStoreState extends StoreState = StoreState> {
  (): TStoreState;
  <N extends string>(moduleName: N): TStoreState[N];
}

/**
 * Store实例
 *
 * @public
 */
export interface IStore<TStoreState extends StoreState = StoreState> {
  /**
   * ForkID
   */
  uid: number;
  /**
   * 实例ID
   */
  sid: number;
  /**
   * 当前是否是激活状态
   *
   * @remarks
   * 同一时刻只会有一个store被激活
   */
  active: boolean;
  /**
   * 所属router
   *
   * @remarks
   * router和store是一对多的关系
   */
  //   router: IRouter<TStoreState>;
  /**
   * 派发action
   */
  dispatch: Dispatch;
  /**
   * 获取store的状态
   *
   * @remarks
   * storeState由多个moduleState组成，更新时必须等所有moduleState全部更新完成后，后会才一次性commit到store中
   */
  getState: GetState<TStoreState>;
  /**
   * 当前的Store状态
   */
  state: TStoreState;
  /**
   * 获取暂时未提交到store的状态
   *
   * @remarks
   * storeState由多个moduleState组成，更新时必须等所有moduleState全部更新完成后，后会才一次性commit到store中
   */
  getUncommittedState(): TStoreState;
  /**
   * 在该store中挂载指定的model
   *
   * @remarks
   * 该方法会触发model.onMount(env)钩子
   */
  mount(
    moduleName: keyof TStoreState,
    env: "init" | "route" | "update"
  ): void | Promise<void>;
  /**
   * 销毁（框架会自动调用）
   */
  destroy(): void;
}

/**
 * KAFComponent定义
 *
 * @remarks
 * KAFComponent通过 {@link exportComponent} 导出，可使用 {@link ILoadComponent} 加载
 *
 * @public
 */
export interface KAFComponent {
  __kaf_component__: "view" | "component";
}

/**
 * 异步EluxComponent定义
 *
 * @remarks
 * KAFComponent通过 {@link exportComponent} 导出，可使用 {@link ILoadComponent} 加载
 *
 * @public
 */
export type AsyncKAFComponent = () => Promise<{
  default: KAFComponent;
}>;

/**
 * Model的构造类
 *
 * @public
 */
export interface CommonModelClass<H = CommonModel> {
  new (moduleName: string, store: IStore): H;
}

/**
 * Module的基础定义
 *
 * @public
 */
export interface CommonModule<TModuleName extends string = string> {
  moduleName: TModuleName;
  ModelClass: CommonModelClass;
  components: { [componentName: string]: KAFComponent };
  state: ModuleState;
  actions: ModelAsCreators;
  data?: any;
}

/**
 * Model的基础定义
 *
 * @public
 */
export interface CommonModel {
  /**
   * 模块名称
   */
  readonly moduleName: string;
  /**
   * 模块状态
   */
  readonly state: ModuleState;
  /**
   * model被挂载到store时触发，在一个store中一个model只会被挂载一次
   */
  onMount(env: "init" | "route" | "update"): void | Promise<void>;
  /**
   * 当前page被激活时触发
   */
  onActive(): void;
  /**
   * 当前page被变为历史快照时触发
   */
  onInactive(): void;
}

export function isEluxComponent(data: any): data is KAFComponent {
  return data["__kaf_component__"];
}
