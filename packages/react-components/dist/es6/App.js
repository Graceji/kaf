import { env } from '@aimkaf/core';
import { KAFContextComponent, reactComponentsConfig } from './base';
import { RouterComponent } from './Router';
import { jsx as _jsx } from "react/jsx-runtime";
const AppRender = {
  toDocument(id, KAFContext, fromSSR, app) {
    const renderFun = fromSSR ? reactComponentsConfig.hydrate : reactComponentsConfig.render;
    const panel = env.document.getElementById(id);
    renderFun == null ? void 0 : renderFun(() => _jsx(KAFContextComponent.Provider, {
      value: KAFContext,
      children: _jsx(RouterComponent, {})
    }), panel);
  },

  toString(id, KAFContext, app) {
    const html = reactComponentsConfig.renderToString(_jsx(KAFContextComponent.Provider, {
      value: KAFContext,
      children: _jsx(RouterComponent, {})
    }));
    return Promise.resolve(html);
  },

  toProvider(KAFContext, app) {
    return props => _jsx(KAFContextComponent.Provider, {
      value: KAFContext,
      children: props.children
    });
  }

};
export default AppRender;