import { defineComponent, h, provide } from 'vue';
import { getEntryComponent } from '@elux/core';
import { EluxStoreContextKey } from './base';
export var EWindow = defineComponent({
  props: {
    store: {
      type: Object,
      required: true
    }
  },
  setup: function setup(props) {
    var AppView = getEntryComponent();
    var storeContext = {
      store: props.store
    };
    provide(EluxStoreContextKey, storeContext);
    return function () {
      return h(AppView, null);
    };
  }
});