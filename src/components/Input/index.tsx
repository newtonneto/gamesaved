import React from 'react';
import { Input as NativeBaseInput, IInputProps } from 'native-base';

import { INPUT_HEIGHT, INPUT_BORDER_WIDTH } from '@utils/constants';

const Input = ({ ...rest }: IInputProps) => {
  return (
    <NativeBaseInput
      bg="gray.700"
      h={INPUT_HEIGHT}
      size="md"
      borderWidth={INPUT_BORDER_WIDTH}
      borderColor="secondary.700"
      fontFamily="body"
      color="white"
      placeholderTextColor="gray.300"
      _focus={{
        borderWidth: INPUT_BORDER_WIDTH,
        borderColor: 'green.500',
        bg: 'gray.700',
      }}
      {...rest}
    />
  );
};

export default Input;
