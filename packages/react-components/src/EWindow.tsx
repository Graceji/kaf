import {coreConfig, getEntryComponent, IStore} from '@aimkaf/core';
import {FC, memo} from 'react';

const Component: FC<{store: IStore}> = function ({store}) {
  const AppView: KAF.Component = getEntryComponent() as any;
  const StoreProvider = coreConfig.StoreProvider!;
  return (
    <StoreProvider store={store}>
      <AppView />
    </StoreProvider>
  );
};

Component.displayName = 'KAFWindow';

export const EWindow = memo(Component);
