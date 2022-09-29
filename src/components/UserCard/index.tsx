import React from 'react';
import { Box, Pressable, Heading, Text, VStack, Avatar } from 'native-base';

import { ProfileDto } from '@interfaces/profile.dto';
import { AXIS_X_PADDING_CONTENT, CARDS_BORDER_WIDTH } from '@utils/constants';

type Props = {
  profile: ProfileDto;
};

const UserCard = ({ profile }: Props) => {
  return (
    <Pressable mx={AXIS_X_PADDING_CONTENT}>
      <Box
        w="98%"
        rounded="lg"
        overflow="hidden"
        borderWidth={CARDS_BORDER_WIDTH}
        borderColor="secondary.700"
        h={14}
        bg="gray.600"
        px={4}
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start">
        <Avatar
          h={10}
          w={10}
          bg="gray.700"
          alignSelf="center">{`${profile.firstName[0]}${profile.lastName[0]}`}</Avatar>
        <VStack px={4}>
          <Heading
            size="sm"
            color="white"
            ellipsizeMode="tail"
            numberOfLines={1}>
            {profile.username}
          </Heading>
          <Text color="white" ellipsizeMode="tail" numberOfLines={1}>
            {profile.firstName} {profile.lastName}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default UserCard;
