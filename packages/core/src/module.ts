import type {
  AsyncKAFComponent,
  CommonModelClass,
  KAFComponent,
  CommonModule,
} from "./basic";
import { isEluxComponent } from "./basic";
import env from "./env";

export function exportModuleFacade(
  moduleName: string,
  ModelClass: CommonModelClass,
  components: { [componentName: string]: KAFComponent | AsyncKAFComponent },
  data?: any
): CommonModule {
  Object.keys(components).forEach((key) => {
    const component = components[key];
    if (
      !isEluxComponent(component) &&
      (typeof component !== "function" ||
        component.length > 0 ||
        !/(import|require)\s*\(/.test(component.toString()))
    ) {
      env.console.warn(
        `The exported component must implement interface EluxComponent: ${moduleName}.${key}`
      );
    }
  });

  return {
    moduleName,
    ModelClass,
    components: components as { [componentName: string]: KAFComponent },
    data,
    state: {},
    actions: {},
  };
}
