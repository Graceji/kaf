import { getModuleApiMap, setCoreConfig } from '@aimkaf/core';
export { BaseModel, deepMerge, effect, effectLogger, EmptyModel, env, errorAction, ErrorCodes, exportComponent, exportModule, exportView, getApi, getTplInSSR, injectModule, isServer, isMutable, locationToNativeLocation, locationToUrl, modelHotReplacement, moduleExists, nativeLocationToLocation, nativeUrlToUrl, reducer, setLoading, urlToLocation, urlToNativeUrl } from '@aimkaf/core';
var appConfig = Symbol();
export function setConfig(conf) {
  setCoreConfig(conf);

  if (conf.DisableNativeRouter) {
    setCoreConfig({
      NotifyNativeRouter: {
        window: false,
        page: false
      }
    });
  }

  return appConfig;
}
export function patchActions(typeName, json) {
  if (json) {
    getModuleApiMap(JSON.parse(json));
  }
}