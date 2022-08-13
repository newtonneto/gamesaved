import React from 'react';
import { Button as NativeBaseButton, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
  title: string;
};

const TextButton = ({ title, ...rest }: Props) => {
  return (
    <NativeBaseButton
      bg="gray.600"
      h={10}
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
