import React from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { Provider } from 'react-redux';

import { THEME } from '@src/styles/theme';
import Routes from '@src/routes';
import store from '@src/store';

const GRAY_600 = '#202024';

const App = () => {
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="light-content" backgroundColor={GRAY_600} />
      <Provider store={store}>
        <Routes />
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;
