import React, { ReactNode } from 'react';
import { VStack as NativeBaseVStack, IStackProps } from 'native-base';

type Props = IStackProps & {
  children: ReactNode[];
};

const VStack = ({ children, ...rest }: Props) => {
  return (
    <NativeBaseVStack
      flex={1}
      alignItems="center"
      bg="gray.600"
      px={8}
      {...rest}>
      {children}
    </NativeBaseVStack>
  );
};

export default VStack;
