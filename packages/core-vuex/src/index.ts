import {Plugin, MutationPayload, SubscribeOptions, Mutation, Store} from 'vuex';
import {WatchOptions} from 'vue';
import {mergeState} from '@elux/core';
import type {BStore, ICoreRouter, StoreBuilder} from '@elux/core';

export interface VuexOptions {
  initState?: any;
  plugins?: Plugin<any>[];
  devtools?: boolean;
}

export interface VuexStore<S extends Record<string, any> = {}> extends BStore<S> {
  state: S;
  subscribe<P extends MutationPayload>(fn: (mutation: P, state: S) => any, options?: SubscribeOptions): () => void;
  watch<T>(getter: (state: S, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;
}

const updateMutation: Mutation<any> = (state, {newState}) => {
  mergeState(state, newState);
};

const UpdateMutationName = 'update';

export function storeCreator(storeOptions: VuexOptions, router: ICoreRouter, id = 0): VuexStore {
  const {initState = {}, plugins, devtools = true} = storeOptions;
  const store = new Store({state: initState, mutations: {[UpdateMutationName]: updateMutation}, plugins, devtools});
  const vuexStore: VuexStore = Object.assign(store, {id, router, baseFork: {}}) as any;
  vuexStore.getState = () => {
    return store.state;
  };
  vuexStore.getPureState = () => {
    const state = vuexStore.getState();
    return JSON.parse(JSON.stringify(state));
  };
  vuexStore.update = (actionName: string, newState: any, actionData: any[]) => {
    store.commit(UpdateMutationName, {actionName, newState, actionData});
  };
  vuexStore.baseFork = {creator: storeCreator, options: storeOptions};
  return vuexStore;
}

export function createVuex(storeOptions: VuexOptions = {}): StoreBuilder<VuexOptions, VuexStore> {
  return {storeOptions, storeCreator};
}
