import React from 'react';
import { Heading, HStack, useTheme } from 'native-base';
import { Sword } from 'phosphor-react-native';

type Props = {
  type:
    | 'Sword'
    | 'PersonSimpleRun'
    | 'Shield'
    | 'MagicWand'
    | 'Barbell'
    | 'FirstAid'
    | 'GenderIntersex'
    | 'Brain';
  value: string;
};

const Attribute = ({ type, value }: Props) => {
  const { colors } = useTheme();

  return (
    <HStack w="full" alignItems="center">
      <Sword color={colors.white} size={24} />
      <Heading fontFamily="heading" fontSize="3xl" color="white" ml={4}>
        {value}
      </Heading>
    </HStack>
  );
};

export default Attribute;
