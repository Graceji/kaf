import { coreConfig, env } from '@aimkaf/core';
import { memo, useEffect, useRef, useState } from 'react';
import { EWindow } from './EWindow';
import { jsx as _jsx } from "react/jsx-runtime";

const Component = () => {
  const router = coreConfig.UseRouter();
  const [data, setData] = useState({
    className: 'kaf-app',
    pages: router.getCurrentPages().reverse()
  });
  const {
    className,
    pages
  } = data;
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const containerRef = useRef(null);
  useEffect(() => {
    return router.addListener(({
      action,
      windowChanged
    }) => {
      const pages = router.getCurrentPages().reverse();
      return new Promise(completeCallback => {
        if (windowChanged) {
          if (action === 'push') {
            setData({
              className: 'kaf-app kaf-animation kaf-change kaf-push ' + Date.now(),
              pages
            });
            env.setTimeout(() => {
              containerRef.current.className = 'kaf-app kaf-animation';
            }, 100);
            env.setTimeout(() => {
              containerRef.current.className = 'kaf-app';
              completeCallback();
            }, 400);
          } else if (action === 'back') {
            setData({
              className: 'kaf-app ' + Date.now(),
              pages: [...pages, pagesRef.current[pagesRef.current.length - 1]]
            });
            env.setTimeout(() => {
              containerRef.current.className = 'kaf-app kaf-animation kaf-change kaf-back';
            }, 100);
            env.setTimeout(() => {
              setData({
                className: 'kaf-app ' + Date.now(),
                pages
              });
              completeCallback();
            }, 400);
          } else if (action === 'relaunch') {
            setData({
              className: 'kaf-app ',
              pages
            });
            env.setTimeout(completeCallback, 50);
          }
        } else {
          setData({
            className: 'kaf-app',
            pages
          });
          env.setTimeout(completeCallback, 50);
        }
      });
    });
  }, [router]);
  return _jsx("div", {
    ref: containerRef,
    className: className,
    children: pages.map((item, index) => {
      const {
        store,
        location: {
          url,
          classname
        }
      } = item;
      const props = {
        className: `kaf-window${classname ? ' ' + classname : ''}`,
        key: store.uid,
        uid: store.uid,
        sid: store.sid,
        url,
        style: {
          zIndex: index + 1
        }
      };
      return classname.startsWith('_') ? _jsx("article", { ...props,
        children: _jsx(EWindow, {
          store: store
        })
      }) : _jsx("div", { ...props,
        children: _jsx(EWindow, {
          store: store
        })
      });
    })
  });
};

Component.displayName = 'KAFRouter';
export const RouterComponent = memo(Component);