import { env, IAppRender } from "@kaf/core";
import { KAFContextComponent, reactComponentsConfig } from "./base";
import { RouterComponent } from "./Router";

const AppRender: IAppRender = {
  toDocument(id, kafContext, fromSSR, app): void {
    const renderFun = fromSSR
      ? reactComponentsConfig.hydrate
      : reactComponentsConfig.render;
    const panel = env.document!.getElementById(id);
    renderFun!(
      <KAFContextComponent.Provider value={kafContext}>
        <RouterComponent />
      </KAFContextComponent.Provider>,
      panel
    );
  },
  toString(id, kafContext, app): Promise<string> {
    const html = reactComponentsConfig.renderToString!(
      <KAFContextComponent.Provider value={kafContext}>
        <RouterComponent />
      </KAFContextComponent.Provider>
    );
    return Promise.resolve(html);
  },
  toProvider(kafContext, app): KAF.Component<{ children: any }> {
    return (props) => (
      <KAFContextComponent.Provider value={kafContext}>
        {props.children}
      </KAFContextComponent.Provider>
    );
  },
};

export default AppRender;
