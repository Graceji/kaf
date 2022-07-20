import { createTextVNode as _createTextVNode, createVNode as _createVNode } from "vue";
import { buildProvider, coreConfig, setCoreConfig } from '@elux/core';
import { locationToUrl } from '@elux/route';
import { createRouter } from '@elux/route-mp';
import { onShow, taroHistory } from '@elux/taro';
import { EWindow } from '@elux/vue-components';
import { useDidHide, useDidShow } from '@tarojs/taro';
import { createApp as createCSRApp, defineComponent, onBeforeUnmount, ref } from 'vue';
export { DocumentHead, Else, Link, Switch, connectStore } from '@elux/vue-components';
export * from '@elux/app';
setCoreConfig({
  Platform: 'taro'
});
export var EluxPage = defineComponent({
  setup: function setup() {
    var router = coreConfig.UseRouter();
    var store = ref();
    var unlink;
    useDidShow(function () {
      if (!unlink) {
        unlink = router.addListener(function (_ref) {
          var newStore = _ref.newStore;
          store.value = newStore;
        });
      }

      onShow();
    });
    useDidHide(function () {
      if (unlink) {
        unlink();
        unlink = undefined;
      }
    });
    onBeforeUnmount(function () {
      if (unlink) {
        unlink();
        unlink = undefined;
      }
    });
    return function () {
      return store.value ? _createVNode(EWindow, {
        "store": store.value,
        "key": store.value.sid
      }, null) : _createVNode("div", {
        "className": "g-page-loading"
      }, [_createTextVNode("Loading...")]);
    };
  }
});
var cientSingleton;
export function createApp(appConfig, appOptions) {
  if (appOptions === void 0) {
    appOptions = {};
  }

  if (!cientSingleton) {
    var onLaunch = appOptions.onLaunch;

    appOptions.onLaunch = function (options) {
      var location = taroHistory.getLocation();
      router.init({
        url: locationToUrl(location)
      }, {});
      onLaunch && onLaunch(options);
    };

    cientSingleton = createCSRApp(appOptions);
    var router = createRouter(taroHistory);
    buildProvider(cientSingleton, router);
  }

  return cientSingleton;
}