import React, { useEffect, useState } from 'react';
import {
  HStack,
  StyledProps,
  IconButton,
  Heading,
  useTheme,
} from 'native-base';
import { Pause, SkipBack } from 'phosphor-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { ICON_NORMAL } from '@utils/constants';

type Props = StyledProps & {
  title: string;
};

const Header = ({ title, ...rest }: Props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [canGoBack, setCanGoBack] = useState<boolean>(false);

  useEffect(() => {
    setCanGoBack(navigation.canGoBack());
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      py={2}
      px={2.5}
      {...rest}>
      {canGoBack && (
        <IconButton
          icon={<SkipBack color={colors.gray[200]} size={ICON_NORMAL} />}
          onPress={handleGoBack}
        />
      )}
      <Heading
        color="gray.100"
        textAlign="center"
        fontSize="lg"
        flex={1}
        ml={canGoBack ? 0 : 12}
        ellipsizeMode="tail"
        numberOfLines={1}>
        {title}
      </Heading>
      <IconButton
        icon={<Pause color={colors.gray[200]} size={ICON_NORMAL} />}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </HStack>
  );
};

export default Header;
