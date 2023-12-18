import {
  coreConfig,
  env,
  ILoadComponent,
  injectComponent,
  isPromise,
} from "@kaf/core";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const LoadComponentOnError: KAF.Component<{ message: string }> = ({
  message,
}: {
  message: string;
}) => <div className="g-component-error">{message}</div>;
export const LoadComponentOnLoading: KAF.Component = () => (
  <div className="g-component-loading">loading...</div>
);

export const LoadComponent: ILoadComponent<any> = (
  moduleName,
  componentName,
  options = {}
) => {
  const OnLoading = options.onLoading || coreConfig.LoadComponentOnLoading!;
  const OnError = options.onError || coreConfig.LoadComponentOnError!;

  const Component = forwardRef((props, ref) => {
    const activeRef = useRef(true);
    const viewRef = useRef<KAF.Component<any> | string>(OnLoading);
    const curStore = coreConfig.UseStore!();
    const [, setView] = useState<KAF.Component<any> | string>(viewRef.current);

    const update = useCallback((view: KAF.Component<any> | string) => {
      if (activeRef.current) {
        viewRef.current = view;
      }
      setView(view);
    }, []);

    useMemo(() => {
      let SyncView: KAF.Component<any> | string = OnLoading;
      try {
        const result = injectComponent(
          moduleName as string,
          componentName as string,
          curStore
        );
        if (isPromise(result)) {
          if (env.isServer) {
            throw "can not use async component in SSR";
          }
          result.then(
            (view: any) => {
              update(view || "not found!");
            },
            (e) => {
              env.console.error(e);
              update(e.message || `${e}` || "error");
            }
          );
        } else {
          SyncView = result as any;
        }
      } catch (e: any) {
        env.console.error(e);
        SyncView = e.message || `${e}` || "error";
      }
      update(SyncView);
    }, [curStore, update]);

    useEffect(() => {
      return () => {
        activeRef.current = false;
      };
    }, []);

    const View = viewRef.current;
    if (typeof View === "string") {
      return <OnError message={View} />;
    } else if (View === OnLoading) {
      return <OnLoading />;
    } else {
      return <View ref={ref} {...props} />;
    }
  });

  Component.displayName = "KAFComponentLoader";

  return Component;
};
