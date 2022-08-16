import React from 'react';
import { ActivityIndicator } from 'react-native';
import { HStack, useTheme } from 'native-base';

import { AXIS_Y_PADDING_CONTENT } from '@styles/sizes';

export const FlatListFooter = (isLoadingNext: boolean) => {
  const { colors } = useTheme();

  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      py={AXIS_Y_PADDING_CONTENT}>
      {isLoadingNext && (
        <ActivityIndicator size="small" color={colors.secondary[700]} />
      )}
    </HStack>
  );
};

export const FlatListSeparator = () => <HStack h={8} />;
