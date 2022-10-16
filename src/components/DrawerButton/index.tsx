import React from 'react';
import { HStack, IconButton, useTheme } from 'native-base';
import { Pause } from 'phosphor-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { ICON_NORMAL } from '@utils/constants';

const DrawerButton = () => {
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
        icon={<Pause color={colors.gray[200]} size={ICON_NORMAL} />}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </HStack>
  );
};

export default DrawerButton;
