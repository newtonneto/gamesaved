import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import {
  ScrollView as NativeBaseScrollView,
  IScrollViewProps,
} from 'native-base';

import { CONTENT_PADDING_BOTTOM } from '@styles/sizes';

type Props = IScrollViewProps & {
  children: ReactNode;
};

const ScrollView = ({ children, ...rest }: Props) => {
  return (
    <NativeBaseScrollView
      flex={1}
      w="full"
      showsVerticalScrollIndicator={false}
      _contentContainerStyle={styles.scrollViewContent}
      {...rest}>
      {children}
    </NativeBaseScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: CONTENT_PADDING_BOTTOM,
    alignItems: 'center',
  },
});

export default ScrollView;
