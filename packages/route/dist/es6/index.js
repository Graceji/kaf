import { coreConfig, CoreRouter, deepClone, env, errorAction, setLoading, Store } from '@elux/core';
import { afterChangeAction, beforeChangeAction, ErrorCodes, locationToNativeLocation, locationToUrl, mergeDefaultClassname, nativeUrlToUrl, routeConfig, testChangeAction, urlToLocation, urlToNativeUrl } from './basic';
import { PageStack, RouteRecord, WindowStack } from './history';
export { ErrorCodes, locationToNativeLocation, locationToUrl, nativeLocationToLocation, nativeUrlToUrl, routeConfig, setRouteConfig, urlToLocation, urlToNativeUrl } from './basic';
export class BaseNativeRouter {
  constructor() {
    this.router = void 0;
    this.routeKey = '';
    this.curTask = void 0;
    this.router = new Router(this);
  }

  onSuccess() {
    if (this.curTask) {
      const {
        resolve,
        timeout
      } = this.curTask;
      this.curTask = undefined;
      env.clearTimeout(timeout);
      this.routeKey = '';
      resolve();
    }
  }

  testExecute(method, location, backIndex) {
    const testMethod = '_' + method;
    this[testMethod] && this[testMethod](locationToNativeLocation(location), backIndex);
  }

  execute(method, location, key, backIndex) {
    const nativeLocation = locationToNativeLocation(location);
    const result = this[method](nativeLocation, key, backIndex);

    if (result) {
      this.routeKey = key;
      return new Promise(resolve => {
        const timeout = env.setTimeout(() => {
          env.console.error('Native router timeout: ' + nativeLocation.url);
          this.onSuccess();
        }, 2000);
        this.curTask = {
          resolve,
          timeout
        };
      });
    }
  }

}
let clientDocumentHeadTimer = 0;
export class Router extends CoreRouter {
  constructor(nativeRouter) {
    super();
    this.curTask = void 0;
    this.taskList = [];
    this.windowStack = void 0;
    this.documentHead = '';

    this.onTaskComplete = () => {
      const task = this.taskList.shift();

      if (task) {
        this.curTask = task;
        const onTaskComplete = this.onTaskComplete;
        env.setTimeout(() => task[0]().finally(onTaskComplete).then(task[1], task[2]), 0);
      } else {
        this.curTask = undefined;
      }
    };

    this.nativeRouter = nativeRouter;
  }

  addTask(execute) {
    return new Promise((resolve, reject) => {
      const task = [() => setLoading(execute(), this.getActivePage().store), resolve, reject];

      if (this.curTask) {
        this.taskList.push(task);
      } else {
        this.curTask = task;
        task[0]().finally(this.onTaskComplete).then(task[1], task[2]);
      }
    });
  }

  getDocumentHead() {
    return this.documentHead;
  }

  setDocumentHead(html) {
    this.documentHead = html;

    if (!env.isServer && !clientDocumentHeadTimer) {
      clientDocumentHeadTimer = env.setTimeout(() => {
        clientDocumentHeadTimer = 0;
        const arr = this.documentHead.match(/<title>(.*?)<\/title>/) || [];

        if (arr[1]) {
          coreConfig.SetPageTitle(arr[1]);
        }
      }, 0);
    }
  }

  savePageTitle() {
    const arr = this.documentHead.match(/<title>(.*?)<\/title>/) || [];
    const title = arr[1] || '';
    this.windowStack.getCurrentItem().getCurrentItem().title = title;
  }

  nativeInitiated() {
    return !this.nativeRouter.routeKey;
  }

  getHistoryLength(target) {
    return target === 'window' ? this.windowStack.getLength() - 1 : this.windowStack.getCurrentItem().getLength() - 1;
  }

  getHistory(target) {
    return target === 'window' ? this.windowStack.getRecords().slice(1) : this.windowStack.getCurrentItem().getItems().slice(1);
  }

  findRecordByKey(recordKey) {
    const {
      record: {
        key,
        location,
        title
      },
      overflow,
      index
    } = this.windowStack.findRecordByKey(recordKey);
    return {
      overflow,
      index,
      record: {
        key,
        location,
        title
      }
    };
  }

  findRecordByStep(delta, rootOnly) {
    const {
      record: {
        key,
        location,
        title
      },
      overflow,
      index
    } = this.windowStack.testBack(delta, !!rootOnly);
    return {
      overflow,
      index,
      record: {
        key,
        location,
        title
      }
    };
  }

  getActivePage() {
    return this.windowStack.getCurrentWindowPage();
  }

  getCurrentPages() {
    return this.windowStack.getCurrentPages();
  }

  async mountStore(prevStore, newStore, historyStore) {
    const prevState = prevStore.getState();
    this.runtime = {
      timestamp: Date.now(),
      prevState: coreConfig.MutableData ? deepClone(prevState) : prevState,
      completed: false
    };

    if (newStore === historyStore) {
      this.runtime.completed = true;
      return;
    }

    try {
      await newStore.mount(coreConfig.StageModuleName, 'route');
    } catch (err) {
      env.console.error(err);
    }

    this.runtime.completed = true;
  }

  redirectOnServer(url) {
    if (env.isServer) {
      const nativeUrl = urlToNativeUrl(url);
      const err = {
        code: ErrorCodes.ROUTE_REDIRECT,
        message: 'Route change in server is not allowed.',
        detail: nativeUrl
      };
      throw err;
    }
  }

  init(routerInitOptions, prevState) {
    this.init = () => Promise.resolve();

    this.initOptions = routerInitOptions;
    this.location = urlToLocation(nativeUrlToUrl(routerInitOptions.url), undefined);
    this.action = 'init';
    this.windowStack = new WindowStack(this.location, new Store(0, 0, this));
    this.routeKey = this.findRecordByStep(0).record.key;
    this.runtime = {
      timestamp: Date.now(),
      prevState,
      completed: false
    };
    const task = [this._init.bind(this), () => undefined, () => undefined];
    this.curTask = task;
    return task[0]().finally(this.onTaskComplete);
  }

  async _init() {
    const {
      action,
      location,
      routeKey
    } = this;
    await this.nativeRouter.execute(action, location, routeKey);
    const store = this.getActivePage().store;

    try {
      await store.mount(coreConfig.StageModuleName, 'init');
      await store.dispatch(testChangeAction(this.location, this.action));
    } catch (err) {
      if (err.code === ErrorCodes.ROUTE_RETURN || err.code === ErrorCodes.ROUTE_REDIRECT) {
        this.taskList = [];
        throw err;
      }

      env.console.error(err);
    }

    this.runtime.completed = true;
    this.dispatch({
      location,
      action,
      prevStore: store,
      newStore: store,
      windowChanged: true
    });
  }

  computeUrl(partialLocation, action, target) {
    const curClassname = this.location.classname;
    let defClassname = curClassname;

    if (action === 'relaunch') {
      defClassname = target === 'window' ? '' : curClassname;
    }

    const url = locationToUrl(partialLocation);
    return mergeDefaultClassname(url, defClassname);
  }

  relaunch(partialLocation, target, refresh = false, _nativeCaller = false) {
    return this.addTask(this._relaunch.bind(this, partialLocation, target, refresh, _nativeCaller));
  }

  async _relaunch(partialLocation, target, refresh, _nativeCaller) {
    const action = 'relaunch';
    const url = this.computeUrl(partialLocation, action, target);
    this.redirectOnServer(url);
    const location = urlToLocation(url, partialLocation.state);
    const NotifyNativeRouter = routeConfig.NotifyNativeRouter[target];

    if (!_nativeCaller && NotifyNativeRouter) {
      this.nativeRouter.testExecute(action, location);
    }

    const prevStore = this.getActivePage().store;

    try {
      await prevStore.dispatch(testChangeAction(location, action));
    } catch (err) {
      if (!_nativeCaller) {
        throw err;
      }
    }

    await prevStore.dispatch(beforeChangeAction(location, action));
    this.savePageTitle();
    this.location = location;
    this.action = action;
    const newStore = prevStore.clone(refresh);
    const pageStack = this.windowStack.getCurrentItem();
    const newRecord = new RouteRecord(location, pageStack);
    this.routeKey = newRecord.key;

    if (target === 'window') {
      pageStack.relaunch(newRecord);
      this.windowStack.relaunch(pageStack);
    } else {
      pageStack.relaunch(newRecord);
    }

    pageStack.replaceStore(newStore);
    await this.mountStore(prevStore, newStore);

    if (!_nativeCaller && NotifyNativeRouter) {
      await this.nativeRouter.execute(action, location, newRecord.key);
    }

    await this.dispatch({
      location,
      action,
      prevStore,
      newStore,
      windowChanged: target === 'window'
    });
    newStore.dispatch(afterChangeAction(location, action));
  }

  replace(partialLocation, target, refresh = false, _nativeCaller = false) {
    return this.addTask(this._replace.bind(this, partialLocation, target, refresh, _nativeCaller));
  }

  async _replace(partialLocation, target, refresh, _nativeCaller) {
    const action = 'replace';
    const url = this.computeUrl(partialLocation, action, target);
    this.redirectOnServer(url);
    const location = urlToLocation(url, partialLocation.state);
    const NotifyNativeRouter = routeConfig.NotifyNativeRouter[target];

    if (!_nativeCaller && NotifyNativeRouter) {
      this.nativeRouter.testExecute(action, location);
    }

    const prevStore = this.getActivePage().store;

    try {
      await prevStore.dispatch(testChangeAction(location, action));
    } catch (err) {
      if (!_nativeCaller) {
        throw err;
      }
    }

    await prevStore.dispatch(beforeChangeAction(location, action));
    this.savePageTitle();
    this.location = location;
    this.action = action;
    const newStore = prevStore.clone(refresh);
    const pageStack = this.windowStack.getCurrentItem();
    const newRecord = new RouteRecord(location, pageStack);
    this.routeKey = newRecord.key;

    if (target === 'window') {
      pageStack.relaunch(newRecord);
    } else {
      pageStack.replace(newRecord);
    }

    pageStack.replaceStore(newStore);
    await this.mountStore(prevStore, newStore);

    if (!_nativeCaller && NotifyNativeRouter) {
      await this.nativeRouter.execute(action, location, newRecord.key);
    }

    await this.dispatch({
      location,
      action,
      prevStore,
      newStore,
      windowChanged: target === 'window'
    });
    newStore.dispatch(afterChangeAction(location, action));
  }

  push(partialLocation, target, refresh = false, _nativeCaller = false) {
    return this.addTask(this._push.bind(this, partialLocation, target, refresh, _nativeCaller));
  }

  async _push(partialLocation, target, refresh, _nativeCaller) {
    const action = 'push';
    const url = this.computeUrl(partialLocation, action, target);
    this.redirectOnServer(url);
    const location = urlToLocation(url, partialLocation.state);
    const NotifyNativeRouter = routeConfig.NotifyNativeRouter[target];

    if (!_nativeCaller && NotifyNativeRouter) {
      this.nativeRouter.testExecute(action, location);
    }

    const prevStore = this.getActivePage().store;

    try {
      await prevStore.dispatch(testChangeAction(location, action));
    } catch (err) {
      if (!_nativeCaller) {
        throw err;
      }
    }

    await prevStore.dispatch(beforeChangeAction(location, action));
    this.savePageTitle();
    this.location = location;
    this.action = action;
    const newStore = prevStore.clone(target === 'window' || refresh);
    const pageStack = this.windowStack.getCurrentItem();
    let newRecord;

    if (target === 'window') {
      const newPageStack = new PageStack(this.windowStack, location, newStore);
      newRecord = newPageStack.getCurrentItem();
      this.routeKey = newRecord.key;
      this.windowStack.push(newPageStack);
      await this.mountStore(prevStore, newStore);
    } else {
      newRecord = new RouteRecord(location, pageStack);
      this.routeKey = newRecord.key;
      pageStack.push(newRecord);
      pageStack.replaceStore(newStore);
      await this.mountStore(prevStore, newStore);
    }

    if (!_nativeCaller && NotifyNativeRouter) {
      await this.nativeRouter.execute(action, location, newRecord.key);
    }

    await this.dispatch({
      location,
      action,
      prevStore,
      newStore,
      windowChanged: target === 'window'
    });
    newStore.dispatch(afterChangeAction(location, action));
  }

  back(stepOrKeyOrCallback, target, refresh = false, overflowRedirect = '', _nativeCaller = false) {
    if (!stepOrKeyOrCallback) {
      return this.replace(this.location, 'page', refresh);
    }

    return this.addTask(this._back.bind(this, stepOrKeyOrCallback, target, refresh, overflowRedirect, _nativeCaller));
  }

  async _back(stepOrKeyOrCallback, target, refresh, overflowRedirect, _nativeCaller) {
    const action = 'back';
    this.redirectOnServer(overflowRedirect || '/');
    let stepOrKey = '';

    if (typeof stepOrKeyOrCallback === 'function') {
      const items = this.getHistory(target);
      const i = items.findIndex(stepOrKeyOrCallback);

      if (i > -1) {
        stepOrKey = items[i].key;
      }
    } else {
      stepOrKey = stepOrKeyOrCallback;
    }

    if (!stepOrKey) {
      return this.backError(stepOrKey, overflowRedirect);
    }

    const {
      record,
      overflow,
      index
    } = this.windowStack.testBack(stepOrKey, target === 'window');

    if (overflow) {
      return this.backError(stepOrKey, overflowRedirect);
    }

    if (!index[0] && !index[1]) {
      return;
    }

    const prevStore = this.getActivePage().store;
    const location = record.location;
    const title = record.title;
    const NotifyNativeRouter = [];

    if (index[0]) {
      NotifyNativeRouter[0] = routeConfig.NotifyNativeRouter.window;
    }

    if (index[1]) {
      NotifyNativeRouter[1] = routeConfig.NotifyNativeRouter.page;
    }

    if (!_nativeCaller && NotifyNativeRouter.length) {
      this.nativeRouter.testExecute(action, location, index);
    }

    try {
      await prevStore.dispatch(testChangeAction(location, action));
    } catch (err) {
      if (!_nativeCaller) {
        throw err;
      }
    }

    await prevStore.dispatch(beforeChangeAction(location, action));
    this.savePageTitle();
    this.location = location;
    this.action = action;
    this.routeKey = record.key;

    if (index[0]) {
      this.windowStack.back(index[0]);
    }

    if (index[1]) {
      this.windowStack.getCurrentItem().back(index[1]);
    }

    const pageStack = this.windowStack.getCurrentItem();
    const historyStore = pageStack.store;
    let newStore = historyStore;

    if (index[1] !== 0) {
      newStore = prevStore.clone(refresh);
      pageStack.replaceStore(newStore);
    }

    await this.mountStore(prevStore, newStore);

    if (!_nativeCaller && NotifyNativeRouter.length) {
      await this.nativeRouter.execute(action, location, record.key, index);
    }

    this.setDocumentHead(`<title>${title}</title>`);
    await this.dispatch({
      location,
      action,
      prevStore,
      newStore,
      windowChanged: !!index[0]
    });
    newStore.dispatch(afterChangeAction(location, action));
  }

  backError(stepOrKey, redirect) {
    const prevStore = this.getActivePage().store;
    const backOverflow = {
      code: ErrorCodes.ROUTE_BACK_OVERFLOW,
      message: 'Overflowed on route backward.',
      detail: {
        stepOrKey,
        redirect
      }
    };
    return prevStore.dispatch(errorAction(backOverflow));
  }

}