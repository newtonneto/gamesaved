import React from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';

import { THEME } from './src/styles/theme';
import Routes from './src/routes';

const App = () => {
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="light-content" backgroundColor="#121214" />
      <Routes />
    </NativeBaseProvider>
  );
};

export default App;
