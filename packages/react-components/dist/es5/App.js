import { env } from '@aimkaf/core';
import { KAFContextComponent, reactComponentsConfig } from './base';
import { RouterComponent } from './Router';
import { jsx as _jsx } from "react/jsx-runtime";
var AppRender = {
  toDocument: function toDocument(id, KAFContext, fromSSR, app) {
    var renderFun = fromSSR ? reactComponentsConfig.hydrate : reactComponentsConfig.render;
    var panel = env.document.getElementById(id);
    renderFun(_jsx(KAFContextComponent.Provider, {
      value: KAFContext,
      children: _jsx(RouterComponent, {})
    }), panel);
  },
  toString: function toString(id, KAFContext, app) {
    var html = reactComponentsConfig.renderToString(_jsx(KAFContextComponent.Provider, {
      value: KAFContext,
      children: _jsx(RouterComponent, {})
    }));
    return Promise.resolve(html);
  },
  toProvider: function toProvider(KAFContext, app) {
    return function (props) {
      return _jsx(KAFContextComponent.Provider, {
        value: KAFContext,
        children: props.children
      });
    };
  }
};
export default AppRender;