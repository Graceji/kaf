import {env, IAppRender} from '@kaf/core';
import {KAFContextComponent, reactComponentsConfig} from './base';
import {RouterComponent} from './Router';

const AppRender: IAppRender = {
  toDocument(id, KAFContext, fromSSR, app): void {
    const renderFun = fromSSR ? reactComponentsConfig.hydrate : reactComponentsConfig.render;
    const panel = env.document!.getElementById(id);
    renderFun!(
      <KAFContextComponent.Provider value={KAFContext}>
        <RouterComponent />
      </KAFContextComponent.Provider>,
      panel
    );
  },
  toString(id, KAFContext, app): Promise<string> {
    const html = reactComponentsConfig.renderToString!(
      <KAFContextComponent.Provider value={KAFContext}>
        <RouterComponent />
      </KAFContextComponent.Provider>
    );
    return Promise.resolve(html);
  },
  toProvider(KAFContext, app): KAF.Component<{children: any}> {
    return (props) => <KAFContextComponent.Provider value={KAFContext}>{props.children}</KAFContextComponent.Provider>;
  },
};

export default AppRender;
