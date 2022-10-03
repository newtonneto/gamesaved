import React, { createElement } from 'react';
import { Heading, HStack, useTheme } from 'native-base';

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
};

const Attribute = ({ type, value, svg }: Props) => {
  const { colors } = useTheme();

  return (
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
      <Heading fontFamily="body" fontSize="lg" color="white" ml={4}>
        {value}
      </Heading>
    </HStack>
  );
};

export default Attribute;
