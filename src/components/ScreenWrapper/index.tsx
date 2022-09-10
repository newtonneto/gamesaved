import React, { ReactElement } from 'react';
import { Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { IScrollViewProps } from 'native-base';

import { SafeAreaViewStyled, KeyboardAvoidingViewStyled } from './styles';

type Props = IScrollViewProps & {
  children: ReactElement;
};

const ScreenWrapper = ({ children }: Props) => {
  const headerHeight = useHeaderHeight();
  const pTop = Platform.OS === 'ios' ? -headerHeight : 0;

  return (
    <SafeAreaViewStyled pTop={pTop}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingViewStyled behavior="padding">
          {children}
        </KeyboardAvoidingViewStyled>
      ) : (
        <>{children}</>
      )}
    </SafeAreaViewStyled>
  );
};

export default ScreenWrapper;
