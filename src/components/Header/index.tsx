import React from 'react';
import {
  HStack,
  StyledProps,
  IconButton,
  Heading,
  useTheme,
} from 'native-base';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = StyledProps & {
  title: string;
};

const Header = ({ title, ...rest }: Props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      pb={4}
      pt={4}
      {...rest}>
      <IconButton
        icon={<CaretLeft color={colors.gray[200]} size={24} />}
        onPress={handleGoBack}
      />
      <Heading
        color="gray.100"
        textAlign="center"
        fontSize="lg"
        flex={1}
        mr={12}
        ellipsizeMode="tail"
        numberOfLines={1}>
        {title}
      </Heading>
    </HStack>
  );
};

export default Header;
