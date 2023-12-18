import { coreConfig, env, IStore, Location } from "@kaf/core";
import { FC, memo, useEffect, useRef, useState } from "react";
import { EWindow } from "./EWindow";

const Component: FC = () => {
  const router = coreConfig.UseRouter!();
  const [data, setData] = useState<{
    className: string;
    pages: {
      location: Location;
      store: IStore;
    }[];
  }>({ className: "kaf-app", pages: router.getCurrentPages().reverse() });
  const { className, pages } = data;
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return router.addListener(({ action, windowChanged }) => {
      const pages = router.getCurrentPages().reverse();
      return new Promise<void>((completeCallback) => {
        if (windowChanged) {
          if (action === "push") {
            setData({
              className:
                "kaf-app kaf-animation kaf-change kaf-push " + Date.now(),
              pages,
            });
            env.setTimeout(() => {
              containerRef.current!.className = "kaf-app kaf-animation";
            }, 100);
            env.setTimeout(() => {
              containerRef.current!.className = "kaf-app";
              completeCallback();
            }, 400);
          } else if (action === "back") {
            setData({
              className: "kaf-app " + Date.now(),
              pages: [...pages, pagesRef.current[pagesRef.current.length - 1]],
            });
            env.setTimeout(() => {
              containerRef.current!.className =
                "kaf-app kaf-animation kaf-change kaf-back";
            }, 100);
            env.setTimeout(() => {
              setData({ className: "kaf-app " + Date.now(), pages });
              completeCallback();
            }, 400);
          } else if (action === "relaunch") {
            setData({ className: "kaf-app ", pages });
            env.setTimeout(completeCallback, 50);
          }
        } else {
          setData({ className: "kaf-app", pages });
          env.setTimeout(completeCallback, 50);
        }
      });
    });
  }, [router]);
  return (
    <div ref={containerRef} className={className}>
      {pages.map((item, index) => {
        const {
          store,
          location: { url, classname },
        } = item;
        const props = {
          className: `kaf-window${classname ? " " + classname : ""}`,
          key: store.uid,
          uid: store.uid,
          sid: store.sid,
          url,
          style: { zIndex: index + 1 },
        };
        return classname.startsWith("_") ? (
          <article {...props}>
            <EWindow store={store}></EWindow>
          </article>
        ) : (
          <div {...props}>
            <EWindow store={store}></EWindow>
          </div>
        );
      })}
    </div>
  );
};

Component.displayName = "KAFRouter";

export const RouterComponent = memo(Component);
