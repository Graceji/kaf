import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _extends from "@babel/runtime/helpers/esm/extends";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { isPromise, deepMerge, routeChangeAction, coreConfig, exportModule, deepClone, MultipleDispatcher, RouteModuleHandlers, env, reinitApp } from '@elux/core';
import { routeConfig, setRouteConfig } from './basic';
import { RootStack, HistoryStack, HistoryRecord } from './history';
import { eluxLocationToEluxUrl, createLocationTransform } from './transform';
export { setRouteConfig, routeConfig, routeMeta } from './basic';
export { createLocationTransform, nativeUrlToNativeLocation, nativeLocationToNativeUrl } from './transform';
export var BaseNativeRouter = function () {
  function BaseNativeRouter() {
    _defineProperty(this, "curTask", void 0);

    _defineProperty(this, "eluxRouter", void 0);
  }

  var _proto = BaseNativeRouter.prototype;

  _proto.onChange = function onChange(key) {
    if (this.curTask) {
      this.curTask.resolve(this.curTask.nativeData);
      this.curTask = undefined;
      return false;
    }

    return key !== this.eluxRouter.routeState.key;
  };

  _proto.startup = function startup(router) {
    this.eluxRouter = router;
  };

  _proto.execute = function execute(method, getNativeData) {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var task = {
        resolve: resolve,
        reject: reject,
        nativeData: undefined
      };
      _this.curTask = task;

      var result = _this[method].apply(_this, [function () {
        var nativeData = getNativeData();
        task.nativeData = nativeData;
        return nativeData;
      }].concat(args));

      if (!result) {
        resolve(undefined);
        _this.curTask = undefined;
      } else if (isPromise(result)) {
        result.catch(function (e) {
          reject(e);
          _this.curTask = undefined;
        });
      }
    });
  };

  return BaseNativeRouter;
}();
export var BaseEluxRouter = function (_MultipleDispatcher) {
  _inheritsLoose(BaseEluxRouter, _MultipleDispatcher);

  function BaseEluxRouter(nativeUrl, nativeRouter, locationTransform, nativeData) {
    var _this2;

    _this2 = _MultipleDispatcher.call(this) || this;

    _defineProperty(_assertThisInitialized(_this2), "_curTask", void 0);

    _defineProperty(_assertThisInitialized(_this2), "_taskList", []);

    _defineProperty(_assertThisInitialized(_this2), "_nativeData", void 0);

    _defineProperty(_assertThisInitialized(_this2), "_internalUrl", void 0);

    _defineProperty(_assertThisInitialized(_this2), "routeState", void 0);

    _defineProperty(_assertThisInitialized(_this2), "name", routeConfig.RouteModuleName);

    _defineProperty(_assertThisInitialized(_this2), "initialize", void 0);

    _defineProperty(_assertThisInitialized(_this2), "injectedModules", {});

    _defineProperty(_assertThisInitialized(_this2), "rootStack", new RootStack());

    _defineProperty(_assertThisInitialized(_this2), "latestState", {});

    _defineProperty(_assertThisInitialized(_this2), "_taskComplete", function () {
      var task = _this2._taskList.shift();

      if (task) {
        _this2.executeTask(task);
      } else {
        _this2._curTask = undefined;
      }
    });

    _this2.nativeRouter = nativeRouter;
    _this2.locationTransform = locationTransform;
    _this2.nativeData = nativeData;
    nativeRouter.startup(_assertThisInitialized(_this2));
    var nativeLocation = locationTransform.nativeUrlToNativeLocation(nativeUrl);
    var locationStateOrPromise = locationTransform.partialLocationStateToLocationState(locationTransform.nativeLocationToPartialLocationState(nativeLocation));

    var callback = function callback(locationState) {
      var routeState = _extends({}, locationState, {
        action: 'RELAUNCH',
        key: ''
      });

      _this2.routeState = routeState;
      _this2._internalUrl = eluxLocationToEluxUrl({
        pathname: routeState.pagename,
        params: routeState.params
      });

      if (!routeConfig.indexUrl) {
        setRouteConfig({
          indexUrl: _this2._internalUrl
        });
      }

      return routeState;
    };

    if (isPromise(locationStateOrPromise)) {
      _this2.initialize = locationStateOrPromise.then(callback);
    } else {
      _this2.initialize = Promise.resolve(callback(locationStateOrPromise));
    }

    return _this2;
  }

  var _proto2 = BaseEluxRouter.prototype;

  _proto2.startup = function startup(store) {
    var historyStack = new HistoryStack(this.rootStack, store);
    var historyRecord = new HistoryRecord(this.routeState, historyStack);
    historyStack.startup(historyRecord);
    this.rootStack.startup(historyStack);
    this.routeState.key = historyRecord.key;
  };

  _proto2.getCurrentPages = function getCurrentPages() {
    return this.rootStack.getCurrentPages();
  };

  _proto2.getCurrentStore = function getCurrentStore() {
    return this.rootStack.getCurrentItem().store;
  };

  _proto2.getStoreList = function getStoreList() {
    return this.rootStack.getItems().map(function (_ref) {
      var store = _ref.store;
      return store;
    });
  };

  _proto2.getInternalUrl = function getInternalUrl() {
    return this._internalUrl;
  };

  _proto2.getNativeLocation = function getNativeLocation() {
    if (!this._nativeData) {
      this._nativeData = this.partialLocationStateToNativeData(this.routeState);
    }

    return this._nativeData.nativeLocation;
  };

  _proto2.getNativeUrl = function getNativeUrl() {
    if (!this._nativeData) {
      this._nativeData = this.partialLocationStateToNativeData(this.routeState);
    }

    return this._nativeData.nativeUrl;
  };

  _proto2.getHistoryLength = function getHistoryLength(root) {
    return root ? this.rootStack.getLength() : this.rootStack.getCurrentItem().getLength();
  };

  _proto2.findRecordByKey = function findRecordByKey(key) {
    return this.rootStack.findRecordByKey(key);
  };

  _proto2.findRecordByStep = function findRecordByStep(delta, rootOnly) {
    return this.rootStack.testBack(delta, rootOnly);
  };

  _proto2.partialLocationStateToNativeData = function partialLocationStateToNativeData(partialLocationState) {
    var nativeLocation = this.locationTransform.partialLocationStateToNativeLocation(partialLocationState);
    var nativeUrl = this.locationTransform.nativeLocationToNativeUrl(nativeLocation);
    return {
      nativeUrl: nativeUrl,
      nativeLocation: nativeLocation
    };
  };

  _proto2.preAdditions = function preAdditions(eluxUrlOrPayload) {
    var partialLocationState;

    if (typeof eluxUrlOrPayload === 'string') {
      var eluxLocation = this.locationTransform.eluxUrlToEluxLocation(eluxUrlOrPayload);
      partialLocationState = this.locationTransform.eluxLocationToPartialLocationState(eluxLocation);
    } else {
      var extendParams = eluxUrlOrPayload.extendParams,
          pagename = eluxUrlOrPayload.pagename;

      var _data = _extends({}, eluxUrlOrPayload);

      if (extendParams === 'current') {
        _data.extendParams = this.routeState.params;
        _data.pagename = pagename || this.routeState.pagename;
      }

      partialLocationState = this.locationTransform.payloadToPartialLocationState(_data);
    }

    return this.locationTransform.partialLocationStateToLocationState(partialLocationState);
  };

  _proto2.relaunch = function relaunch(eluxUrlOrPayload, root, nonblocking, nativeCaller) {
    if (root === void 0) {
      root = false;
    }

    if (nativeCaller === void 0) {
      nativeCaller = false;
    }

    return this.addTask(this._relaunch.bind(this, eluxUrlOrPayload, root, nativeCaller), nonblocking);
  };

  _proto2._relaunch = function () {
    var _relaunch2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(eluxUrlOrPayload, root, nativeCaller) {
      var _this3 = this;

      var location, key, routeState, nativeData, notifyNativeRouter, cloneState;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.preAdditions(eluxUrlOrPayload);

            case 2:
              location = _context.sent;
              key = '';
              routeState = _extends({}, location, {
                action: 'RELAUNCH',
                key: key
              });
              _context.next = 7;
              return this.getCurrentStore().dispatch(testRouteChangeAction(routeState));

            case 7:
              _context.next = 9;
              return this.getCurrentStore().dispatch(beforeRouteChangeAction(routeState));

            case 9:
              if (root) {
                key = this.rootStack.relaunch(routeState).key;
              } else {
                key = this.rootStack.getCurrentItem().relaunch(routeState).key;
              }

              routeState.key = key;
              notifyNativeRouter = routeConfig.notifyNativeRouter[root ? 'root' : 'internal'];

              if (!(!nativeCaller && notifyNativeRouter)) {
                _context.next = 16;
                break;
              }

              _context.next = 15;
              return this.nativeRouter.execute('relaunch', function () {
                return _this3.partialLocationStateToNativeData(routeState);
              }, key);

            case 15:
              nativeData = _context.sent;

            case 16:
              this._nativeData = nativeData;
              this.routeState = routeState;
              this._internalUrl = eluxLocationToEluxUrl({
                pathname: routeState.pagename,
                params: routeState.params
              });
              cloneState = deepClone(routeState);
              this.getCurrentStore().dispatch(routeChangeAction(cloneState));
              _context.next = 23;
              return this.dispatch('change', {
                routeState: cloneState,
                root: root
              });

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function _relaunch(_x, _x2, _x3) {
      return _relaunch2.apply(this, arguments);
    }

    return _relaunch;
  }();

  _proto2.push = function push(eluxUrlOrPayload, root, nonblocking, nativeCaller) {
    if (root === void 0) {
      root = false;
    }

    if (nativeCaller === void 0) {
      nativeCaller = false;
    }

    return this.addTask(this._push.bind(this, eluxUrlOrPayload, root, nativeCaller), nonblocking);
  };

  _proto2._push = function () {
    var _push2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(eluxUrlOrPayload, root, nativeCaller) {
      var _this4 = this;

      var location, key, routeState, nativeData, notifyNativeRouter, cloneState;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.preAdditions(eluxUrlOrPayload);

            case 2:
              location = _context2.sent;
              key = '';
              routeState = _extends({}, location, {
                action: 'PUSH',
                key: key
              });
              _context2.next = 7;
              return this.getCurrentStore().dispatch(testRouteChangeAction(routeState));

            case 7:
              _context2.next = 9;
              return this.getCurrentStore().dispatch(beforeRouteChangeAction(routeState));

            case 9:
              if (root) {
                key = this.rootStack.push(routeState).key;
              } else {
                key = this.rootStack.getCurrentItem().push(routeState).key;
              }

              routeState.key = key;
              notifyNativeRouter = routeConfig.notifyNativeRouter[root ? 'root' : 'internal'];

              if (!(!nativeCaller && notifyNativeRouter)) {
                _context2.next = 16;
                break;
              }

              _context2.next = 15;
              return this.nativeRouter.execute('push', function () {
                return _this4.partialLocationStateToNativeData(routeState);
              }, key);

            case 15:
              nativeData = _context2.sent;

            case 16:
              this._nativeData = nativeData;
              this.routeState = routeState;
              this._internalUrl = eluxLocationToEluxUrl({
                pathname: routeState.pagename,
                params: routeState.params
              });
              cloneState = deepClone(routeState);

              if (!root) {
                _context2.next = 25;
                break;
              }

              _context2.next = 23;
              return reinitApp(this.getCurrentStore());

            case 23:
              _context2.next = 26;
              break;

            case 25:
              this.getCurrentStore().dispatch(routeChangeAction(cloneState));

            case 26:
              _context2.next = 28;
              return this.dispatch('change', {
                routeState: cloneState,
                root: root
              });

            case 28:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function _push(_x4, _x5, _x6) {
      return _push2.apply(this, arguments);
    }

    return _push;
  }();

  _proto2.replace = function replace(eluxUrlOrPayload, root, nonblocking, nativeCaller) {
    if (root === void 0) {
      root = false;
    }

    if (nativeCaller === void 0) {
      nativeCaller = false;
    }

    return this.addTask(this._replace.bind(this, eluxUrlOrPayload, root, nativeCaller), nonblocking);
  };

  _proto2._replace = function () {
    var _replace2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(eluxUrlOrPayload, root, nativeCaller) {
      var _this5 = this;

      var location, key, routeState, nativeData, notifyNativeRouter, cloneState;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.preAdditions(eluxUrlOrPayload);

            case 2:
              location = _context3.sent;
              key = '';
              routeState = _extends({}, location, {
                action: 'REPLACE',
                key: key
              });
              _context3.next = 7;
              return this.getCurrentStore().dispatch(testRouteChangeAction(routeState));

            case 7:
              _context3.next = 9;
              return this.getCurrentStore().dispatch(beforeRouteChangeAction(routeState));

            case 9:
              if (root) {
                key = this.rootStack.replace(routeState).key;
              } else {
                key = this.rootStack.getCurrentItem().replace(routeState).key;
              }

              routeState.key = key;
              notifyNativeRouter = routeConfig.notifyNativeRouter[root ? 'root' : 'internal'];

              if (!(!nativeCaller && notifyNativeRouter)) {
                _context3.next = 16;
                break;
              }

              _context3.next = 15;
              return this.nativeRouter.execute('replace', function () {
                return _this5.partialLocationStateToNativeData(routeState);
              }, key);

            case 15:
              nativeData = _context3.sent;

            case 16:
              this._nativeData = nativeData;
              this.routeState = routeState;
              this._internalUrl = eluxLocationToEluxUrl({
                pathname: routeState.pagename,
                params: routeState.params
              });
              cloneState = deepClone(routeState);
              this.getCurrentStore().dispatch(routeChangeAction(cloneState));
              _context3.next = 23;
              return this.dispatch('change', {
                routeState: cloneState,
                root: root
              });

            case 23:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function _replace(_x7, _x8, _x9) {
      return _replace2.apply(this, arguments);
    }

    return _replace;
  }();

  _proto2.back = function back(n, root, options, nonblocking, nativeCaller) {
    if (n === void 0) {
      n = 1;
    }

    if (root === void 0) {
      root = false;
    }

    if (nativeCaller === void 0) {
      nativeCaller = false;
    }

    return this.addTask(this._back.bind(this, n, root, options || {}, nativeCaller), nonblocking);
  };

  _proto2._back = function () {
    var _back2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(n, root, options, nativeCaller) {
      var _this6 = this;

      var _this$rootStack$testB, record, overflow, steps, url, key, pagename, params, routeState, nativeData, notifyNativeRouter, cloneState;

      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (n === void 0) {
                n = 1;
              }

              if (!(n < 1)) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt("return");

            case 3:
              _this$rootStack$testB = this.rootStack.testBack(n, root), record = _this$rootStack$testB.record, overflow = _this$rootStack$testB.overflow, steps = _this$rootStack$testB.steps;

              if (!overflow) {
                _context4.next = 8;
                break;
              }

              url = options.overflowRedirect || routeConfig.indexUrl;
              env.setTimeout(function () {
                return _this6.relaunch(url, root);
              }, 0);
              return _context4.abrupt("return");

            case 8:
              key = record.key;
              pagename = record.pagename;
              params = deepMerge({}, record.params, options.payload);
              routeState = {
                key: key,
                pagename: pagename,
                params: params,
                action: 'BACK'
              };
              _context4.next = 14;
              return this.getCurrentStore().dispatch(testRouteChangeAction(routeState));

            case 14:
              _context4.next = 16;
              return this.getCurrentStore().dispatch(beforeRouteChangeAction(routeState));

            case 16:
              if (steps[0]) {
                root = true;
                this.rootStack.back(steps[0]);
              }

              if (steps[1]) {
                this.rootStack.getCurrentItem().back(steps[1]);
              }

              notifyNativeRouter = routeConfig.notifyNativeRouter[root ? 'root' : 'internal'];

              if (!(!nativeCaller && notifyNativeRouter)) {
                _context4.next = 23;
                break;
              }

              _context4.next = 22;
              return this.nativeRouter.execute('back', function () {
                return _this6.partialLocationStateToNativeData(routeState);
              }, n, key);

            case 22:
              nativeData = _context4.sent;

            case 23:
              this._nativeData = nativeData;
              this.routeState = routeState;
              this._internalUrl = eluxLocationToEluxUrl({
                pathname: routeState.pagename,
                params: routeState.params
              });
              cloneState = deepClone(routeState);
              this.getCurrentStore().dispatch(routeChangeAction(cloneState));
              _context4.next = 30;
              return this.dispatch('change', {
                routeState: routeState,
                root: root
              });

            case 30:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function _back(_x10, _x11, _x12, _x13) {
      return _back2.apply(this, arguments);
    }

    return _back;
  }();

  _proto2.executeTask = function executeTask(task) {
    this._curTask = task;
    task().finally(this._taskComplete);
  };

  _proto2.addTask = function addTask(execute, nonblocking) {
    var _this7 = this;

    if (env.isServer) {
      return;
    }

    if (this._curTask && !nonblocking) {
      return;
    }

    return new Promise(function (resolve, reject) {
      var task = function task() {
        return execute().then(resolve, reject);
      };

      if (_this7._curTask) {
        _this7._taskList.push(task);
      } else {
        _this7.executeTask(task);
      }
    });
  };

  _proto2.destroy = function destroy() {
    this.nativeRouter.destroy();
  };

  return BaseEluxRouter;
}(MultipleDispatcher);
export var RouteActionTypes = {
  TestRouteChange: "" + routeConfig.RouteModuleName + coreConfig.NSP + "TestRouteChange",
  BeforeRouteChange: "" + routeConfig.RouteModuleName + coreConfig.NSP + "BeforeRouteChange"
};
export function beforeRouteChangeAction(routeState) {
  return {
    type: RouteActionTypes.BeforeRouteChange,
    payload: [routeState]
  };
}
export function testRouteChangeAction(routeState) {
  return {
    type: RouteActionTypes.TestRouteChange,
    payload: [routeState]
  };
}
var defaultNativeLocationMap = {
  in: function _in(nativeLocation) {
    return nativeLocation;
  },
  out: function out(nativeLocation) {
    return nativeLocation;
  }
};
export function createRouteModule(moduleName, pagenameMap, nativeLocationMap, notfoundPagename, paramsKey) {
  if (nativeLocationMap === void 0) {
    nativeLocationMap = defaultNativeLocationMap;
  }

  if (notfoundPagename === void 0) {
    notfoundPagename = '/404';
  }

  if (paramsKey === void 0) {
    paramsKey = '_';
  }

  var locationTransform = createLocationTransform(pagenameMap, nativeLocationMap, notfoundPagename, paramsKey);
  var routeModule = exportModule(moduleName, RouteModuleHandlers, {}, {});
  return _extends({}, routeModule, {
    locationTransform: locationTransform
  });
}