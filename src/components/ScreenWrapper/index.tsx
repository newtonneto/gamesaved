import React, { ReactElement } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IScrollViewProps } from 'native-base';

type Props = IScrollViewProps & {
  children: ReactElement;
};

const GRAY_600 = '#202024';

const ScreenWrapper = ({ children }: Props) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          style={styles.KeyboardAvoidingView}
          behavior="padding">
          {children}
        </KeyboardAvoidingView>
      ) : (
        <>{children}</>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: GRAY_600,
  },
  KeyboardAvoidingView: {
    flex: 1,
  },
});

export default ScreenWrapper;
