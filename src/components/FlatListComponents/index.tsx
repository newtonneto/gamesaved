import React from 'react';
import { ActivityIndicator } from 'react-native';
import { HStack, useTheme } from 'native-base';

export const FlatListFooter = (isLoadingNext: boolean) => {
  const { colors } = useTheme();

  return (
    <HStack alignItems="center" justifyContent="center" py={8}>
      {isLoadingNext && (
        <ActivityIndicator size="small" color={colors.secondary[700]} />
      )}
    </HStack>
  );
};

export const FlatListSeparator = () => <HStack h={8} />;
