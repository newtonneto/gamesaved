import React from 'react';
import { Button as NativeBaseButton, IButtonProps, Heading } from 'native-base';

import { BUTTON_HEIGHT } from '@utils/constants';

type Props = IButtonProps & {
  title: string;
  color?: string;
};

const Button = ({ title, color = 'green.700', ...rest }: Props) => {
  return (
    <NativeBaseButton
      bg={color}
      h={BUTTON_HEIGHT}
      fontSize="sm"
      rounded="sm"
      _pressed={{ bg: 'green.500' }}
      {...rest}>
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </NativeBaseButton>
  );
};

export default Button;
