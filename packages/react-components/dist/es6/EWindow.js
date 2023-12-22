import { coreConfig, getEntryComponent } from '@aimkaf/core';
import { memo } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";

const Component = function ({
  store
}) {
  const AppView = getEntryComponent();
  const StoreProvider = coreConfig.StoreProvider;
  return _jsx(StoreProvider, {
    store: store,
    children: _jsx(AppView, {})
  });
};

Component.displayName = 'KAFWindow';
export const EWindow = memo(Component);