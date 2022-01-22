import {Component, createSSRApp, createApp as createVue, reactive, App} from 'vue';
import {RootModuleFacade, setCoreConfig, defineModuleGetter} from '@elux/core';
import {setVueComponentsConfig, loadComponent, LoadComponentOptions, useRouter, useStore} from '@elux/vue-components';
import {renderToString, renderToDocument, Router} from '@elux/vue-components/stage';
import {createBaseApp, createBaseSSR, setAppConfig, setUserConfig, CreateApp, CreateSSR, UserConfig, GetBaseAPP} from '@elux/app';
import {createRouter, createBrowserHistory, createServerHistory} from '@elux/route-browser';

export {DocumentHead, Switch, Else, Link, loadComponent} from '@elux/vue-components';
export * from '@elux/app';

setCoreConfig({MutableData: true});
setAppConfig({loadComponent, useRouter, useStore});

export type GetApp<A extends RootModuleFacade, R extends string = 'route', NT = unknown> = GetBaseAPP<A, LoadComponentOptions, R, NT>;

export function setConfig(conf: UserConfig & {LoadComponentOnError?: Component<{message: string}>; LoadComponentOnLoading?: Component<{}>}): void {
  setVueComponentsConfig(conf);
  setUserConfig(conf);
}

export const createApp: CreateApp<App> = (moduleGetter, storeMiddlewares, storeLogger) => {
  defineModuleGetter(moduleGetter);
  const app = createVue(Router);
  const history = createBrowserHistory();
  const router = createRouter(history, {});
  return createBaseApp(app, router, renderToDocument, reactive, storeMiddlewares, storeLogger);
};
export const createSSR: CreateSSR<App> = (moduleGetter, url, nativeData, storeMiddlewares, storeLogger) => {
  defineModuleGetter(moduleGetter);
  const app = createSSRApp(Router);
  const history = createServerHistory(url);
  const router = createRouter(history, nativeData);
  return createBaseSSR(app, router, renderToString, reactive, storeMiddlewares, storeLogger);
};
