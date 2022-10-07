import React, { createElement } from 'react';
import { Heading, HStack, useTheme, Text, VStack } from 'native-base';

import statsIcons from '@hashmaps/statsIcons';
import platformsIcons from '@hashmaps/platformsIcons';

type Props = {
  type:
    | 'sword'
    | 'personSimpleRun'
    | 'shield'
    | 'magicWand'
    | 'barbell'
    | 'firstAid'
    | 'genderIntersex'
    | 'brain'
    | 'playstation'
    | 'xbox'
    | 'nintendo'
    | 'steam';
  value: string;
  svg: boolean;
  label: string;
};

const Attribute = ({ type, value, svg, label }: Props) => {
  const { colors } = useTheme();

  return (
    <VStack alignItems="flex-start" w="full" py={2}>
      <Text color="white">{label}</Text>
      <HStack w="full" alignItems="center">
        {!svg &&
          createElement(statsIcons[type], {
            color: colors.white,
            size: 24,
          })}
        {svg &&
          createElement(platformsIcons[type], {
            width: 24,
            height: 24,
          })}
        <Heading
          fontFamily="body"
          fontSize="lg"
          color="white"
          ml={4}
          numberOfLines={1}
          ellipsizeMode="tail">
          {value}
        </Heading>
      </HStack>
    </VStack>
  );
};

export default Attribute;
