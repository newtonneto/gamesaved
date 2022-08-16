import React from 'react';
import { Button as NativeBaseButton, IButtonProps, Heading } from 'native-base';

import { GHOST_BUTTON_HEIGHT } from '@styles/sizes';

type Props = IButtonProps & {
  title: string;
};

const TextButton = ({ title, ...rest }: Props) => {
  return (
    <NativeBaseButton
      variant="ghost"
      h={GHOST_BUTTON_HEIGHT}
      fontSize="sm"
      rounded="sm"
      _pressed={{ bg: 'gray.500' }}
      {...rest}>
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </NativeBaseButton>
  );
};

export default TextButton;
