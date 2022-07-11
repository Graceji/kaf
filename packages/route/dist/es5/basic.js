import _extends from "@babel/runtime/helpers/esm/extends";
import { buildConfigSetter, coreConfig } from '@elux/core';
export var ErrorCodes = {
  ROUTE_RETURN: 'ELIX.ROUTE_RETURN',
  ROUTE_REDIRECT: 'ELIX.ROUTE_REDIRECT',
  ROUTE_BACK_OVERFLOW: 'ELUX.ROUTE_BACK_OVERFLOW'
};
export function nativeUrlToUrl(nativeUrl) {
  var _nativeUrl$split = nativeUrl.split(/[?#]/),
      _nativeUrl$split$ = _nativeUrl$split[0],
      path = _nativeUrl$split$ === void 0 ? '' : _nativeUrl$split$,
      _nativeUrl$split$2 = _nativeUrl$split[1],
      search = _nativeUrl$split$2 === void 0 ? '' : _nativeUrl$split$2,
      _nativeUrl$split$3 = _nativeUrl$split[2],
      hash = _nativeUrl$split$3 === void 0 ? '' : _nativeUrl$split$3;

  var pathname = routeConfig.NativePathnameMapping.in('/' + path.replace(/^\/|\/$/g, ''));
  return "" + pathname + (search ? "?" + search : '') + (hash ? "#" + hash : '');
}
export function urlToNativeUrl(eluxUrl) {
  var _eluxUrl$split = eluxUrl.split(/[?#]/),
      _eluxUrl$split$ = _eluxUrl$split[0],
      path = _eluxUrl$split$ === void 0 ? '' : _eluxUrl$split$,
      _eluxUrl$split$2 = _eluxUrl$split[1],
      search = _eluxUrl$split$2 === void 0 ? '' : _eluxUrl$split$2,
      _eluxUrl$split$3 = _eluxUrl$split[2],
      hash = _eluxUrl$split$3 === void 0 ? '' : _eluxUrl$split$3;

  var pathname = routeConfig.NativePathnameMapping.out('/' + path.replace(/^\/|\/$/g, ''));
  return "" + pathname + (search ? "?" + search : '') + (hash ? "#" + hash : '');
}
export function urlToLocation(url, state) {
  var _url$split = url.split(/[?#]/),
      _url$split$ = _url$split[0],
      path = _url$split$ === void 0 ? '' : _url$split$,
      _url$split$2 = _url$split[1],
      query = _url$split$2 === void 0 ? '' : _url$split$2,
      _url$split$3 = _url$split[2],
      hash = _url$split$3 === void 0 ? '' : _url$split$3;

  var arr = ("?" + query).match(/[?&]__c=([^&]*)/) || ['', ''];
  var classname = arr[1];
  var search = ("?" + query).replace(/[?&]__c=[^&]*/g, '').substr(1);
  var pathname = '/' + path.replace(/^\/|\/$/g, '');
  var parse = routeConfig.QueryString.parse;
  var searchQuery = parse(search);
  var hashQuery = parse(hash);

  if (classname) {
    search = search ? search + "&__c=" + classname : "__c=" + classname;
  }

  return {
    url: "" + pathname + (search ? "?" + search : '') + (hash ? "#" + hash : ''),
    pathname: pathname,
    search: search,
    hash: hash,
    classname: classname,
    searchQuery: searchQuery,
    hashQuery: hashQuery,
    state: state
  };
}
export function mergeDefaultClassname(url, defClassname) {
  if (!defClassname) {
    return url;
  }

  var _url$split2 = url.split(/[?#]/),
      _url$split2$ = _url$split2[0],
      path = _url$split2$ === void 0 ? '' : _url$split2$,
      _url$split2$2 = _url$split2[1],
      query = _url$split2$2 === void 0 ? '' : _url$split2$2,
      _url$split2$3 = _url$split2[2],
      hash = _url$split2$3 === void 0 ? '' : _url$split2$3;

  if (/[?&]__c=/.test("?" + query)) {
    return url;
  }

  var search = query ? query + "&__c=" + defClassname : "__c=" + defClassname;
  return "" + path + (search ? "?" + search : '') + (hash ? "#" + hash : '');
}
export function locationToUrl(_ref) {
  var url = _ref.url,
      pathname = _ref.pathname,
      search = _ref.search,
      hash = _ref.hash,
      classname = _ref.classname,
      searchQuery = _ref.searchQuery,
      hashQuery = _ref.hashQuery;

  if (url) {
    var _url$split3 = url.split(/[?#]/);

    pathname = _url$split3[0];
    search = _url$split3[1];
    hash = _url$split3[2];
  }

  pathname = '/' + (pathname || '').replace(/^\/|\/$/g, '');
  var stringify = routeConfig.QueryString.stringify;
  search = search ? search.replace('?', '') : searchQuery ? stringify(searchQuery) : '';
  hash = hash ? hash.replace('#', '') : hashQuery ? stringify(hashQuery) : '';

  if (typeof classname === 'string') {
    search = ("?" + search).replace(/[?&]__c=[^&]*/g, '').substr(1);

    if (classname) {
      search = search ? search + "&__c=" + classname : "__c=" + classname;
    }
  }

  url = "" + pathname + (search ? "?" + search : '') + (hash ? "#" + hash : '');
  return url;
}
export function locationToNativeLocation(location) {
  var pathname = routeConfig.NativePathnameMapping.out(location.pathname);
  var url = location.url.replace(location.pathname, pathname);
  return _extends({}, location, {
    pathname: pathname,
    url: url
  });
}
export function nativeLocationToLocation(location) {
  var pathname = routeConfig.NativePathnameMapping.in(location.pathname);
  var url = location.url.replace(location.pathname, pathname);
  return _extends({}, location, {
    pathname: pathname,
    url: url
  });
}
export function testChangeAction(location, routeAction) {
  return {
    type: "" + coreConfig.StageModuleName + coreConfig.NSP + "_testRouteChange",
    payload: [location, routeAction]
  };
}
export function beforeChangeAction(location, routeAction) {
  return {
    type: "" + coreConfig.StageModuleName + coreConfig.NSP + "_beforeRouteChange",
    payload: [location, routeAction]
  };
}
export function afterChangeAction(location, routeAction) {
  return {
    type: "" + coreConfig.StageModuleName + coreConfig.NSP + "_afterRouteChange",
    payload: [location, routeAction]
  };
}
export var routeConfig = {
  NotifyNativeRouter: {
    window: true,
    page: false
  },
  QueryString: {
    parse: function parse(str) {
      return {};
    },
    stringify: function stringify() {
      return '';
    }
  },
  NativePathnameMapping: {
    in: function _in(pathname) {
      return pathname;
    },
    out: function out(pathname) {
      return pathname;
    }
  }
};
export var setRouteConfig = buildConfigSetter(routeConfig);