import React from 'react';
import { HStack, StyledProps, Heading } from 'native-base';

type Props = StyledProps & {
  title: string;
};

const AppHeader = ({ title, ...rest }: Props) => {
  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      h="full"
      {...rest}>
      <Heading color="gray.100" textAlign="center" fontSize="lg" w="full">
        {title}
      </Heading>
    </HStack>
  );
};

export default AppHeader;
