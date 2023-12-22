import { coreConfig, getEntryComponent } from '@aimkaf/core';
import { memo } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";

var Component = function Component(_ref) {
  var store = _ref.store;
  var AppView = getEntryComponent();
  var StoreProvider = coreConfig.StoreProvider;
  return _jsx(StoreProvider, {
    store: store,
    children: _jsx(AppView, {})
  });
};

Component.displayName = 'KAFWindow';
export var EWindow = memo(Component);