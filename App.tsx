import React from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';

import { THEME } from './src/styles/theme';
import SignIn from './src/screens/SignIn';

const App = () => {
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SignIn />
    </NativeBaseProvider>
  );
};

export default App;
