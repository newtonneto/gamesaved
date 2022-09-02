import React from 'react';
import { HStack, Text, Alert, VStack } from 'native-base';

type Props = {
  status: string;
  title: string;
  description: string;
  textColor: string;
};

const Toast = ({ status, title, description, textColor }: Props) => {
  return (
    <Alert
      maxWidth="90%"
      alignSelf="center"
      flexDirection="row"
      status={status}
      variant="left-accent">
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={textColor}>
              {title}
            </Text>
          </HStack>
        </HStack>
        <Text px="6" color={textColor}>
          {description}
        </Text>
      </VStack>
    </Alert>
  );
};

export default Toast;
