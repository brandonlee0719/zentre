import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { RootStackNav } from './navigation';
import { setI18nConfig, useAppSelector } from './utils';
import { store } from './utils/store';
import { OverlayLoading, AlertView, PopupMenu, Alert } from './components';
import { MenuProvider } from 'react-native-popup-menu';

setI18nConfig();

function Root() {
  const { loadingController, alertController, popupController } = useAppSelector(
    state => state,
  );
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <RootStackNav />
      </MenuProvider>
      <OverlayLoading loading={loadingController.loading} />
      {/*<AlertView {...alertController} />*/}
      <PopupMenu {...popupController} />
      <Alert {...alertController} />
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

export default App;
