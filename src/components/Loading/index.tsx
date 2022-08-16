import React from 'react';
import { Heading, HStack, Spinner } from 'native-base';

const Loading = () => {
  return (
    <HStack space={2} justifyContent="center" alignItems="center" flex={1}>
      <Spinner
        accessibilityLabel="Loading content"
        color="secondary.700"
        size="lg"
      />
      <Heading color="secondary.700" fontSize="lg">
        Carregando dados salvos...
      </Heading>
    </HStack>
  );
};

export default Loading;
