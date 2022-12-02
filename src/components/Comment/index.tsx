import React from 'react';
import { VStack, Text, useTheme, HStack } from 'native-base';
import { ThumbsUp, ThumbsDown } from 'phosphor-react-native';

import UserLabel from '@components/UserLabel';
import { CommentModel } from '@interfaces/comment.model';
import { UserBasicInfo } from '@interfaces/userBasicInfo.model';
import firestoreDateFormat from '@utils/fireabseDateFormat';

type Props = {
  commentData: CommentModel;
  usersInfo: Record<string, UserBasicInfo>;
};

const Comment = ({ commentData, usersInfo }: Props) => {
  const { colors } = useTheme();

  return (
    <VStack
      borderBottomColor="secondary.700"
      borderBottomWidth={1}
      borderRightColor="secondary.700"
      borderRightWidth={1}
      borderRadius={8}
      px={2}
      py={1}
      my={2}>
      <UserLabel
        image={usersInfo[commentData.owner].imageUrl}
        username={usersInfo[commentData.owner].username}
      />
      <Text color="white" fontWeight={500}>
        {commentData.comment}
      </Text>
      <HStack alignItems="center" justifyContent="space-between">
        <HStack>
          <ThumbsUp
            color={colors.secondary[700]}
            size={16}
            style={{ marginRight: 16 }}
          />
          <ThumbsDown color={colors.secondary[700]} size={16} />
        </HStack>
        <Text color="white" fontWeight={100}>
          {firestoreDateFormat(commentData.createdAt)}
        </Text>
      </HStack>
    </VStack>
  );
};

export default Comment;
