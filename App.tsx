import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEME } from './src/styles/theme';
import Routes from './src/routes';

const App = () => {
  return (
    <NativeBaseProvider theme={THEME}>
      <SafeAreaView style={styles.safeAreaView}>
        <StatusBar barStyle="light-content" backgroundColor="#121214" />
        <Routes />
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#121214',
  },
});
