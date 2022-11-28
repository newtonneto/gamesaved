import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Heading, VStack as NativeBaseVStack, Text } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import Input from '@components/Input';
import Header from '@components/Header';
import Button from '@components/Button';
import ScrollView from '@components/ScrollView';
import UserLabel from '@components/UserLabel';
import { PostDto } from '@interfaces/post.dto';
import { ProfileDto } from '@interfaces/profile.dto';
import {
  AXIS_X_MARGIN_CONTENT,
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
} from '@utils/constants';
import firestoreDateFormat from '@utils/fireabseDateFormat';

type RouteParams = {
  postData: PostDto;
  userData: ProfileDto;
  imageData: string | undefined;
};

const PostDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postData, userData, imageData } = route.params as RouteParams;

  useEffect(() => {
    console.log(postData, userData, imageData);
  }, []);

  return (
    <ScreenWrapper>
      <VStack>
        <Header title={postData.title} />
        <ScrollView px={AXIS_X_PADDING_CONTENT}>
          <UserLabel image={imageData} username={userData.username} />
          <Heading size="md" color="white" w="full" mb={2}>
            {postData.title}
          </Heading>
          <Text color="white" width="full">
            {postData.description}
          </Text>
          <VStack width="full" alignItems="flex-end">
            <Text
              color="white"
              ellipsizeMode="tail"
              numberOfLines={1}
              fontSize="xs">
              Criado em: {firestoreDateFormat(postData.createdAt)}
            </Text>
          </VStack>
        </ScrollView>
        <NativeBaseVStack w="full" px={AXIS_X_MARGIN_CONTENT}>
          <Input
            multiline
            textAlignVertical="top"
            h={100}
            mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
          />
          <Button title="Enviar" w="full" />
        </NativeBaseVStack>
      </VStack>
    </ScreenWrapper>
  );
};

export default PostDetails;
