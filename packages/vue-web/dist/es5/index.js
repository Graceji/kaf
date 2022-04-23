import { createApp as createCSRApp, createSSRApp } from 'vue';
import { buildApp, buildSSR } from '@elux/core';
import { createClientRouter, createServerRouter } from '@elux/route-browser';
import { RouterComponent, setVueComponentsConfig } from '@elux/vue-components';
import { renderToString } from '@elux/vue-web/server';
export { DocumentHead, Else, Link, Switch } from '@elux/vue-components';
export * from '@elux/app';
setVueComponentsConfig({
  renderToString: renderToString
});
var cientSingleton = undefined;
export function createApp(appConfig) {
  if (cientSingleton) {
    return cientSingleton;
  }

  var router = createClientRouter();
  var app = createCSRApp(RouterComponent);
  cientSingleton = Object.assign(app, {
    render: function render() {
      return Promise.resolve();
    }
  });
  return buildApp(app, router);
}
export function createSSR(appConfig, nativeRequest) {
  var router = createServerRouter(nativeRequest);
  var app = createSSRApp(RouterComponent);
  return buildSSR(app, router);
}