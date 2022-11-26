import React from 'react';
import {
  Box,
  Pressable,
  Heading,
  Text,
  VStack,
  AspectRatio,
  Spinner,
  useTheme,
} from 'native-base';

import { AXIS_X_MARGIN_CONTENT, CARDS_BORDER_WIDTH } from '@utils/constants';

type Props = {
  uuid: string;
};

const PostCard = ({ uuid }: Props) => {
  return (
    <Pressable mx={AXIS_X_MARGIN_CONTENT}>
      <Box
        w="full"
        height="100px"
        rounded="lg"
        overflow="hidden"
        borderWidth={CARDS_BORDER_WIDTH}
        borderColor="secondary.700"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start">
        <VStack
          w="100%"
          my={2}
          mx={4}
          position="absolute"
          zIndex={1}
          overflow="visible">
          <Heading
            size="sm"
            color="white"
            ellipsizeMode="tail"
            numberOfLines={1}>
            {'title'}
          </Heading>
          <Text color="white" ellipsizeMode="tail" numberOfLines={1}>
            {'description'}
          </Text>
          <Text color="white" ellipsizeMode="tail" numberOfLines={1}>
            {'createdAt'}
          </Text>
          <Text color="white" ellipsizeMode="tail" numberOfLines={1}>
            {'updatedAt'}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default PostCard;
