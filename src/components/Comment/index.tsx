import React from 'react';
import { VStack, Text } from 'native-base';

import UserLabel from '@components/UserLabel';
import { CommentModel } from '@interfaces/comment.model';
import { UserBasicInfo } from '@interfaces/userBasicInfo.model';
import firestoreDateFormat from '@utils/fireabseDateFormat';

type Props = {
  commentData: CommentModel;
  usersInfo: Record<string, UserBasicInfo>;
};

const Comment = ({ commentData, usersInfo }: Props) => {
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
      <VStack alignItems="flex-end">
        <Text color="white" fontWeight={100}>
          {firestoreDateFormat(commentData.createdAt)}
        </Text>
      </VStack>
    </VStack>
  );
};

export default Comment;
