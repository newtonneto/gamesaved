import React from 'react';
import { HStack, IconButton, useTheme } from 'native-base';
import { SkipBack } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import { ICON_NORMAL } from '@utils/constants';

const BackButton = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <HStack
      w="full"
      bg="gray.600"
      alignItems="center"
      justifyContent="center"
      h="full">
      <IconButton
        icon={<SkipBack color={colors.gray[200]} size={ICON_NORMAL} />}
        onPress={() => navigation.goBack()}
      />
    </HStack>
  );
};

export default BackButton;
