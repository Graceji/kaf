import { coreConfig } from '@elux/core';
import { locationToUrl, urlToNativeUrl } from '@elux/route';
import { useCallback, useMemo } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
export const Link = ({
  onClick: _onClick,
  disabled,
  to = '',
  action = 'push',
  classname = '',
  cname = '',
  target = 'page',
  payload,
  ...props
}) => {
  cname = cname || classname;
  const {
    back,
    url,
    href
  } = useMemo(() => {
    let back;
    let url;
    let href;

    if (action === 'back') {
      back = to || 1;
    } else {
      url = cname ? locationToUrl({
        url: to.toString(),
        classname: cname
      }) : to.toString();
      href = urlToNativeUrl(url);
    }

    return {
      back,
      url,
      href
    };
  }, [action, cname, to]);
  const router = coreConfig.UseRouter();
  const onClick = useCallback(event => {
    event.preventDefault();

    if (!disabled) {
      _onClick && _onClick(event);
      router[action](back || {
        url
      }, target, payload);
    }
  }, [disabled, _onClick, router, action, back, url, target, payload]);
  props['onClick'] = onClick;
  props['action'] = action;
  props['target'] = target;
  props['to'] = (back || url) + '';
  props['href'] = href;
  href && (props['href'] = href);
  cname && (props['cname'] = cname);
  disabled && (props['disabled'] = true);

  if (coreConfig.Platform === 'taro') {
    return _jsx("span", { ...props
    });
  } else {
    return _jsx("a", { ...props
    });
  }
};
Link.displayName = 'EluxLink';