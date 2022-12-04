import React from 'react';
import { Avatar, Text } from 'native-base';

import VStack from '@components/VStack';

type Props = {
  image: string | undefined;
  username: string;
};

const UserLabel = ({ image, username }: Props) => {
  return (
    <VStack w="full" alignItems="center" flexDirection="row" mb={1}>
      <Avatar
        bg="gray.700"
        alignSelf="center"
        size="xs"
        mr={2}
        source={{
          uri: image,
        }}
      />
      <Text color="white" ellipsizeMode="tail" numberOfLines={1} fontSize="xs">
        @{username}
      </Text>
    </VStack>
  );
};

export default UserLabel;
