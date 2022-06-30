import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { coreConfig, CoreRouter, deepClone, env, setLoading, setProcessedError, Store } from '@elux/core';
import { afterChangeAction, beforeChangeAction, ErrorCodes, locationToNativeLocation, locationToUrl, nativeUrlToUrl, routeConfig, testChangeAction, urlToLocation, urlToNativeUrl } from './basic';
import { PageStack, RouteRecord, WindowStack } from './history';
export { ErrorCodes, locationToNativeLocation, locationToUrl, nativeLocationToLocation, nativeUrlToUrl, routeConfig, setRouteConfig, urlToLocation, urlToNativeUrl } from './basic';
export var BaseNativeRouter = function () {
  function BaseNativeRouter() {
    this.router = void 0;
    this.routeKey = '';
    this.curTask = void 0;
    this.router = new Router(this);
  }

  var _proto = BaseNativeRouter.prototype;

  _proto.onSuccess = function onSuccess() {
    if (this.curTask) {
      var _this$curTask = this.curTask,
          resolve = _this$curTask.resolve,
          timeout = _this$curTask.timeout;
      this.curTask = undefined;
      env.clearTimeout(timeout);
      this.routeKey = '';
      resolve();
    }
  };

  _proto.testExecute = function testExecute(method, location, backIndex) {
    var testMethod = '_' + method;
    this[testMethod] && this[testMethod](locationToNativeLocation(location), backIndex);
  };

  _proto.execute = function execute(method, location, key, backIndex) {
    var _this = this;

    var nativeLocation = locationToNativeLocation(location);
    var result = this[method](nativeLocation, key, backIndex);

    if (result) {
      this.routeKey = key;
      return new Promise(function (resolve) {
        var timeout = env.setTimeout(function () {
          env.console.error('Native router timeout: ' + nativeLocation.url);

          _this.onSuccess();
        }, 2000);
        _this.curTask = {
          resolve: resolve,
          timeout: timeout
        };
      });
    }
  };

  return BaseNativeRouter;
}();
var clientDocumentHeadTimer = 0;
export var Router = function (_CoreRouter) {
  _inheritsLoose(Router, _CoreRouter);

  function Router(nativeRouter) {
    var _this2;

    _this2 = _CoreRouter.call(this) || this;
    _this2.curTask = void 0;
    _this2.taskList = [];
    _this2.windowStack = void 0;
    _this2.documentHead = '';

    _this2.onTaskComplete = function () {
      var task = _this2.taskList.shift();

      if (task) {
        _this2.curTask = task;
        var onTaskComplete = _this2.onTaskComplete;
        env.setTimeout(function () {
          return task[0]().finally(onTaskComplete).then(task[1], task[2]);
        }, 0);
      } else {
        _this2.curTask = undefined;
      }
    };

    _this2.nativeRouter = nativeRouter;
    return _this2;
  }

  var _proto2 = Router.prototype;

  _proto2.addTask = function addTask(execute) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      var task = [function () {
        return setLoading(execute(), _this3.getActivePage().store);
      }, resolve, reject];

      if (_this3.curTask) {
        _this3.taskList.push(task);
      } else {
        _this3.curTask = task;
        task[0]().finally(_this3.onTaskComplete).then(task[1], task[2]);
      }
    });
  };

  _proto2.getDocumentHead = function getDocumentHead() {
    return this.documentHead;
  };

  _proto2.setDocumentHead = function setDocumentHead(html) {
    var _this4 = this;

    this.documentHead = html;

    if (!env.isServer && !clientDocumentHeadTimer) {
      clientDocumentHeadTimer = env.setTimeout(function () {
        clientDocumentHeadTimer = 0;
        var arr = _this4.documentHead.match(/<title>(.*?)<\/title>/) || [];

        if (arr[1]) {
          coreConfig.SetPageTitle(arr[1]);
        }
      }, 0);
    }
  };

  _proto2.savePageTitle = function savePageTitle() {
    var arr = this.documentHead.match(/<title>(.*?)<\/title>/) || [];
    var title = arr[1] || '';
    this.windowStack.getCurrentItem().getCurrentItem().title = title;
  };

  _proto2.nativeInitiated = function nativeInitiated() {
    return !this.nativeRouter.routeKey;
  };

  _proto2.getHistoryLength = function getHistoryLength(target) {
    if (target === void 0) {
      target = 'page';
    }

    return target === 'window' ? this.windowStack.getLength() - 1 : this.windowStack.getCurrentItem().getLength() - 1;
  };

  _proto2.getHistory = function getHistory(target) {
    if (target === void 0) {
      target = 'page';
    }

    return target === 'window' ? this.windowStack.getRecords().slice(1) : this.windowStack.getCurrentItem().getItems().slice(1);
  };

  _proto2.findRecordByKey = function findRecordByKey(recordKey) {
    var _this$windowStack$fin = this.windowStack.findRecordByKey(recordKey),
        _this$windowStack$fin2 = _this$windowStack$fin.record,
        key = _this$windowStack$fin2.key,
        location = _this$windowStack$fin2.location,
        title = _this$windowStack$fin2.title,
        overflow = _this$windowStack$fin.overflow,
        index = _this$windowStack$fin.index;

    return {
      overflow: overflow,
      index: index,
      record: {
        key: key,
        location: location,
        title: title
      }
    };
  };

  _proto2.findRecordByStep = function findRecordByStep(delta, rootOnly) {
    var _this$windowStack$tes = this.windowStack.testBack(delta, !!rootOnly),
        _this$windowStack$tes2 = _this$windowStack$tes.record,
        key = _this$windowStack$tes2.key,
        location = _this$windowStack$tes2.location,
        title = _this$windowStack$tes2.title,
        overflow = _this$windowStack$tes.overflow,
        index = _this$windowStack$tes.index;

    return {
      overflow: overflow,
      index: index,
      record: {
        key: key,
        location: location,
        title: title
      }
    };
  };

  _proto2.getActivePage = function getActivePage() {
    return this.windowStack.getCurrentWindowPage();
  };

  _proto2.getCurrentPages = function getCurrentPages() {
    return this.windowStack.getCurrentPages();
  };

  _proto2.mountStore = function () {
    var _mountStore = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(payload, prevStore, newStore, historyStore) {
      var prevState;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              prevState = prevStore.getState();
              this.runtime = {
                timestamp: Date.now(),
                payload: payload,
                prevState: coreConfig.MutableData ? deepClone(prevState) : prevState,
                completed: false
              };

              if (!(newStore === historyStore)) {
                _context.next = 5;
                break;
              }

              this.runtime.completed = true;
              return _context.abrupt("return");

            case 5:
              _context.prev = 5;
              _context.next = 8;
              return newStore.mount(coreConfig.StageModuleName, 'route');

            case 8:
              _context.next = 13;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](5);
              env.console.error(_context.t0);

            case 13:
              this.runtime.completed = true;

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[5, 10]]);
    }));

    function mountStore(_x, _x2, _x3, _x4) {
      return _mountStore.apply(this, arguments);
    }

    return mountStore;
  }();

  _proto2.redirectOnServer = function redirectOnServer(partialLocation) {
    if (env.isServer) {
      var url = locationToUrl(partialLocation);
      var nativeUrl = urlToNativeUrl(url);
      var err = {
        code: ErrorCodes.ROUTE_REDIRECT,
        message: 'Route change in server is not allowed.',
        detail: nativeUrl
      };
      throw err;
    }
  };

  _proto2.init = function init(routerInitOptions, prevState) {
    this.init = function () {
      return Promise.resolve();
    };

    this.initOptions = routerInitOptions;
    this.location = urlToLocation(nativeUrlToUrl(routerInitOptions.url));
    this.action = 'init';
    this.windowStack = new WindowStack(this.location, new Store(0, 0, this));
    this.routeKey = this.findRecordByStep(0).record.key;
    this.runtime = {
      timestamp: Date.now(),
      payload: null,
      prevState: prevState,
      completed: false
    };
    var task = [this._init.bind(this), function () {
      return undefined;
    }, function () {
      return undefined;
    }];
    this.curTask = task;
    return task[0]().finally(this.onTaskComplete);
  };

  _proto2._init = function () {
    var _init2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2() {
      var action, location, routeKey, store;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              action = this.action, location = this.location, routeKey = this.routeKey;
              _context2.next = 3;
              return this.nativeRouter.execute(action, location, routeKey);

            case 3:
              store = this.getActivePage().store;
              _context2.prev = 4;
              _context2.next = 7;
              return store.mount(coreConfig.StageModuleName, 'init');

            case 7:
              _context2.next = 9;
              return store.dispatch(testChangeAction(this.location, this.action));

            case 9:
              _context2.next = 17;
              break;

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](4);

              if (!(_context2.t0.code === ErrorCodes.ROUTE_RETURN || _context2.t0.code === ErrorCodes.ROUTE_REDIRECT)) {
                _context2.next = 16;
                break;
              }

              this.taskList = [];
              throw _context2.t0;

            case 16:
              env.console.error(_context2.t0);

            case 17:
              this.runtime.completed = true;
              this.dispatch({
                location: location,
                action: action,
                prevStore: store,
                newStore: store,
                windowChanged: true
              });

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[4, 11]]);
    }));

    function _init() {
      return _init2.apply(this, arguments);
    }

    return _init;
  }();

  _proto2.relaunch = function relaunch(partialLocation, target, payload, _nativeCaller) {
    if (target === void 0) {
      target = 'page';
    }

    if (payload === void 0) {
      payload = null;
    }

    if (_nativeCaller === void 0) {
      _nativeCaller = false;
    }

    this.redirectOnServer(partialLocation);
    return this.addTask(this._relaunch.bind(this, partialLocation, target, payload, _nativeCaller));
  };

  _proto2._relaunch = function () {
    var _relaunch2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(partialLocation, target, payload, _nativeCaller) {
      var action, location, NotifyNativeRouter, prevStore, newStore, pageStack, newRecord;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              action = 'relaunch';
              location = urlToLocation(locationToUrl(partialLocation));
              NotifyNativeRouter = routeConfig.NotifyNativeRouter[target];

              if (!_nativeCaller && NotifyNativeRouter) {
                this.nativeRouter.testExecute(action, location);
              }

              prevStore = this.getActivePage().store;
              _context3.prev = 5;
              _context3.next = 8;
              return prevStore.dispatch(testChangeAction(location, action));

            case 8:
              _context3.next = 14;
              break;

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](5);

              if (_nativeCaller) {
                _context3.next = 14;
                break;
              }

              throw _context3.t0;

            case 14:
              _context3.next = 16;
              return prevStore.dispatch(beforeChangeAction(location, action));

            case 16:
              this.savePageTitle();
              this.location = location;
              this.action = action;
              newStore = prevStore.clone();
              pageStack = this.windowStack.getCurrentItem();
              newRecord = new RouteRecord(location, pageStack);
              this.routeKey = newRecord.key;

              if (target === 'window') {
                pageStack.relaunch(newRecord);
                this.windowStack.relaunch(pageStack);
              } else {
                pageStack.relaunch(newRecord);
              }

              pageStack.replaceStore(newStore);
              _context3.next = 27;
              return this.mountStore(payload, prevStore, newStore);

            case 27:
              if (!(!_nativeCaller && NotifyNativeRouter)) {
                _context3.next = 30;
                break;
              }

              _context3.next = 30;
              return this.nativeRouter.execute(action, location, newRecord.key);

            case 30:
              _context3.next = 32;
              return this.dispatch({
                location: location,
                action: action,
                prevStore: prevStore,
                newStore: newStore,
                windowChanged: target === 'window'
              });

            case 32:
              newStore.dispatch(afterChangeAction(location, action));

            case 33:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[5, 10]]);
    }));

    function _relaunch(_x5, _x6, _x7, _x8) {
      return _relaunch2.apply(this, arguments);
    }

    return _relaunch;
  }();

  _proto2.replace = function replace(partialLocation, target, payload, _nativeCaller) {
    if (target === void 0) {
      target = 'page';
    }

    if (payload === void 0) {
      payload = null;
    }

    if (_nativeCaller === void 0) {
      _nativeCaller = false;
    }

    this.redirectOnServer(partialLocation);
    return this.addTask(this._replace.bind(this, partialLocation, target, payload, _nativeCaller));
  };

  _proto2._replace = function () {
    var _replace2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(partialLocation, target, payload, _nativeCaller) {
      var action, location, NotifyNativeRouter, prevStore, newStore, pageStack, newRecord;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              action = 'replace';
              location = urlToLocation(locationToUrl(partialLocation));
              NotifyNativeRouter = routeConfig.NotifyNativeRouter[target];

              if (!_nativeCaller && NotifyNativeRouter) {
                this.nativeRouter.testExecute(action, location);
              }

              prevStore = this.getActivePage().store;
              _context4.prev = 5;
              _context4.next = 8;
              return prevStore.dispatch(testChangeAction(location, action));

            case 8:
              _context4.next = 14;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](5);

              if (_nativeCaller) {
                _context4.next = 14;
                break;
              }

              throw _context4.t0;

            case 14:
              _context4.next = 16;
              return prevStore.dispatch(beforeChangeAction(location, action));

            case 16:
              this.savePageTitle();
              this.location = location;
              this.action = action;
              newStore = prevStore.clone();
              pageStack = this.windowStack.getCurrentItem();
              newRecord = new RouteRecord(location, pageStack);
              this.routeKey = newRecord.key;

              if (target === 'window') {
                pageStack.relaunch(newRecord);
              } else {
                pageStack.replace(newRecord);
              }

              pageStack.replaceStore(newStore);
              _context4.next = 27;
              return this.mountStore(payload, prevStore, newStore);

            case 27:
              if (!(!_nativeCaller && NotifyNativeRouter)) {
                _context4.next = 30;
                break;
              }

              _context4.next = 30;
              return this.nativeRouter.execute(action, location, newRecord.key);

            case 30:
              _context4.next = 32;
              return this.dispatch({
                location: location,
                action: action,
                prevStore: prevStore,
                newStore: newStore,
                windowChanged: target === 'window'
              });

            case 32:
              newStore.dispatch(afterChangeAction(location, action));

            case 33:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[5, 10]]);
    }));

    function _replace(_x9, _x10, _x11, _x12) {
      return _replace2.apply(this, arguments);
    }

    return _replace;
  }();

  _proto2.push = function push(partialLocation, target, payload, _nativeCaller) {
    if (target === void 0) {
      target = 'page';
    }

    if (payload === void 0) {
      payload = null;
    }

    if (_nativeCaller === void 0) {
      _nativeCaller = false;
    }

    this.redirectOnServer(partialLocation);
    return this.addTask(this._push.bind(this, partialLocation, target, payload, _nativeCaller));
  };

  _proto2._push = function () {
    var _push2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(partialLocation, target, payload, _nativeCaller) {
      var action, location, NotifyNativeRouter, prevStore, newStore, pageStack, newRecord, newPageStack;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              action = 'push';
              location = urlToLocation(locationToUrl(partialLocation));
              NotifyNativeRouter = routeConfig.NotifyNativeRouter[target];

              if (!_nativeCaller && NotifyNativeRouter) {
                this.nativeRouter.testExecute(action, location);
              }

              prevStore = this.getActivePage().store;
              _context5.prev = 5;
              _context5.next = 8;
              return prevStore.dispatch(testChangeAction(location, action));

            case 8:
              _context5.next = 14;
              break;

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](5);

              if (_nativeCaller) {
                _context5.next = 14;
                break;
              }

              throw _context5.t0;

            case 14:
              _context5.next = 16;
              return prevStore.dispatch(beforeChangeAction(location, action));

            case 16:
              this.savePageTitle();
              this.location = location;
              this.action = action;
              newStore = prevStore.clone(target === 'window');
              pageStack = this.windowStack.getCurrentItem();

              if (!(target === 'window')) {
                _context5.next = 30;
                break;
              }

              newPageStack = new PageStack(this.windowStack, location, newStore);
              newRecord = newPageStack.getCurrentItem();
              this.routeKey = newRecord.key;
              this.windowStack.push(newPageStack);
              _context5.next = 28;
              return this.mountStore(payload, prevStore, newStore);

            case 28:
              _context5.next = 36;
              break;

            case 30:
              newRecord = new RouteRecord(location, pageStack);
              this.routeKey = newRecord.key;
              pageStack.push(newRecord);
              pageStack.replaceStore(newStore);
              _context5.next = 36;
              return this.mountStore(payload, prevStore, newStore);

            case 36:
              if (!(!_nativeCaller && NotifyNativeRouter)) {
                _context5.next = 39;
                break;
              }

              _context5.next = 39;
              return this.nativeRouter.execute(action, location, newRecord.key);

            case 39:
              _context5.next = 41;
              return this.dispatch({
                location: location,
                action: action,
                prevStore: prevStore,
                newStore: newStore,
                windowChanged: target === 'window'
              });

            case 41:
              newStore.dispatch(afterChangeAction(location, action));

            case 42:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[5, 10]]);
    }));

    function _push(_x13, _x14, _x15, _x16) {
      return _push2.apply(this, arguments);
    }

    return _push;
  }();

  _proto2.back = function back(stepOrKeyOrCallback, target, payload, overflowRedirect, _nativeCaller) {
    if (stepOrKeyOrCallback === void 0) {
      stepOrKeyOrCallback = 1;
    }

    if (target === void 0) {
      target = 'page';
    }

    if (payload === void 0) {
      payload = null;
    }

    if (overflowRedirect === void 0) {
      overflowRedirect = '';
    }

    if (_nativeCaller === void 0) {
      _nativeCaller = false;
    }

    if (!stepOrKeyOrCallback) {
      return Promise.resolve();
    }

    if (overflowRedirect !== null) {
      this.redirectOnServer({
        url: overflowRedirect || routeConfig.HomeUrl
      });
    }

    var stepOrKey;

    if (typeof stepOrKeyOrCallback === 'function') {
      var items = this.getHistory(target);
      var i = items.findIndex(stepOrKeyOrCallback);
      stepOrKey = i > -1 ? items[i].key : '';
    } else {
      stepOrKey = stepOrKeyOrCallback;
    }

    return this.addTask(this._back.bind(this, stepOrKey, target, payload, overflowRedirect, _nativeCaller));
  };

  _proto2._back = function () {
    var _back2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee6(stepOrKey, target, payload, overflowRedirect, _nativeCaller) {
      var action, _this$windowStack$tes3, record, overflow, index, url, err, location, title, NotifyNativeRouter, prevStore, pageStack, historyStore, newStore;

      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              action = 'back';
              _this$windowStack$tes3 = this.windowStack.testBack(stepOrKey, target === 'window'), record = _this$windowStack$tes3.record, overflow = _this$windowStack$tes3.overflow, index = _this$windowStack$tes3.index;

              if (!(overflow || !index[0] && !index[1])) {
                _context6.next = 6;
                break;
              }

              if (overflowRedirect !== null) {
                url = overflowRedirect || routeConfig.HomeUrl;
                this.relaunch({
                  url: url
                }, 'window');
              }

              err = {
                code: ErrorCodes.ROUTE_BACK_OVERFLOW,
                message: 'Overflowed on route backward.',
                detail: stepOrKey
              };
              throw setProcessedError(err, true);

            case 6:
              location = record.location;
              title = record.title;
              NotifyNativeRouter = [];

              if (index[0]) {
                NotifyNativeRouter[0] = routeConfig.NotifyNativeRouter.window;
              }

              if (index[1]) {
                NotifyNativeRouter[1] = routeConfig.NotifyNativeRouter.page;
              }

              if (!_nativeCaller && NotifyNativeRouter.length) {
                this.nativeRouter.testExecute(action, location, index);
              }

              prevStore = this.getActivePage().store;
              _context6.prev = 13;
              _context6.next = 16;
              return prevStore.dispatch(testChangeAction(location, action));

            case 16:
              _context6.next = 22;
              break;

            case 18:
              _context6.prev = 18;
              _context6.t0 = _context6["catch"](13);

              if (_nativeCaller) {
                _context6.next = 22;
                break;
              }

              throw _context6.t0;

            case 22:
              _context6.next = 24;
              return prevStore.dispatch(beforeChangeAction(location, action));

            case 24:
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

              pageStack = this.windowStack.getCurrentItem();
              historyStore = pageStack.store;
              newStore = historyStore;

              if (index[1] !== 0) {
                newStore = prevStore.clone();
                pageStack.replaceStore(newStore);
              }

              _context6.next = 36;
              return this.mountStore(payload, prevStore, newStore);

            case 36:
              if (!(!_nativeCaller && NotifyNativeRouter.length)) {
                _context6.next = 39;
                break;
              }

              _context6.next = 39;
              return this.nativeRouter.execute(action, location, record.key, index);

            case 39:
              this.setDocumentHead("<title>" + title + "</title>");
              _context6.next = 42;
              return this.dispatch({
                location: location,
                action: action,
                prevStore: prevStore,
                newStore: newStore,
                windowChanged: !!index[0]
              });

            case 42:
              newStore.dispatch(afterChangeAction(location, action));

            case 43:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[13, 18]]);
    }));

    function _back(_x17, _x18, _x19, _x20, _x21) {
      return _back2.apply(this, arguments);
    }

    return _back;
  }();

  return Router;
}(CoreRouter);