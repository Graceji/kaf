import { exportView, setCoreConfig } from '@aimkaf/core';
import { connect, Provider, useStore } from 'react-redux';
export function connectStore(mapStateToProps, options) {
  return function (component) {
    return exportView(connect(mapStateToProps, options)(component));
  };
}
export const connectRedux = connectStore;
setCoreConfig({
  UseStore: useStore,
  StoreProvider: Provider
});
export { batch, connect, createSelectorHook, shallowEqual, useSelector } from 'react-redux';