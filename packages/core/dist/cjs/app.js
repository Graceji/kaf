"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.initApp = initApp;
exports.forkStore = forkStore;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _basic = require("./basic");

var _inject = require("./inject");

var _store = require("./store");

function initApp(router, baseStore, middlewares, appViewName, preloadComponents) {
  if (preloadComponents === void 0) {
    preloadComponents = [];
  }

  _basic.MetaData.currentRouter = router;
  var store = (0, _store.enhanceStore)(baseStore, router, middlewares);
  router.startup(store);
  var AppModuleName = _basic.coreConfig.AppModuleName,
      RouteModuleName = _basic.coreConfig.RouteModuleName;
  var moduleGetter = _basic.MetaData.moduleGetter;
  var appModule = (0, _inject.getModule)(AppModuleName);
  var routeModule = (0, _inject.getModule)(RouteModuleName);
  var AppView = appViewName ? (0, _inject.getComponet)(AppModuleName, appViewName) : {
    __elux_component__: 'view'
  };
  var preloadModules = Object.keys(router.routeState.params).concat(Object.keys(baseStore.getState())).reduce(function (data, moduleName) {
    if (moduleGetter[moduleName] && moduleName !== AppModuleName && moduleName !== RouteModuleName) {
      data[moduleName] = true;
    }

    return data;
  }, {});
  var setup = Promise.all([(0, _inject.getModuleList)(Object.keys(preloadModules)), (0, _inject.getComponentList)(preloadComponents), routeModule.model(store), appModule.model(store)]);
  return {
    store: store,
    AppView: AppView,
    setup: setup
  };
}

var ForkStoreId = 0;

function forkStore(originalStore) {
  var _originalStore$builde = originalStore.builder,
      storeCreator = _originalStore$builde.storeCreator,
      storeOptions = _originalStore$builde.storeOptions,
      middlewares = originalStore.options.middlewares,
      router = originalStore.router;
  var moduleGetter = _basic.MetaData.moduleGetter;
  var baseStore = storeCreator((0, _extends2.default)({}, storeOptions, {
    initState: undefined
  }), ++ForkStoreId);
  var store = (0, _store.enhanceStore)(baseStore, router, middlewares);
  var AppModuleName = _basic.coreConfig.AppModuleName,
      RouteModuleName = _basic.coreConfig.RouteModuleName;
  var appModule = (0, _inject.getModule)(AppModuleName);
  var routeModule = (0, _inject.getModule)(RouteModuleName);
  var preloadModules = Object.keys(router.routeState.params).filter(function (moduleName) {
    return moduleGetter[moduleName] && moduleName !== AppModuleName;
  });
  (0, _inject.getModuleList)(preloadModules);
  routeModule.model(store);
  appModule.model(store);
  return store;
}