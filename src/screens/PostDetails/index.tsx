import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  Heading,
  VStack as NativeBaseVStack,
  Text,
  FormControl,
  useToast,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import Input from '@components/Input';
import Header from '@components/Header';
import Button from '@components/Button';
import ScrollView from '@components/ScrollView';
import Toast from '@components/Toast';
import UserLabel from '@components/UserLabel';
import { PostDto } from '@interfaces/post.dto';
import { ProfileDto } from '@interfaces/profile.dto';
import {
  AXIS_X_MARGIN_CONTENT,
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  TOAST_DURATION,
} from '@utils/constants';
import firestoreDateFormat from '@utils/fireabseDateFormat';
import { CommentsDto } from '@src/interfaces/comments.dto';

type RouteParams = {
  postData: PostDto;
  userData: ProfileDto;
  imageData: string | undefined;
  postUuid: string;
};

type FormData = {
  comment: string;
};

const schema = yup.object().shape({
  comment: yup.string().required('Prenchimento obrigatorio'),
});

const PostDetails = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const route = useRoute();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const { postData, userData, imageData, postUuid } =
    route.params as RouteParams;
  const [comments, setComments] = useState<CommentsDto[]>([]);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;

  useEffect(() => {}, []);

  const onSubmit = async (formData: FormData) => {
    setIsLoadingRequest(true);

    try {
      await firestore()
        .collection<CommentsDto>('comments')
        .doc(postUuid)
        .update({
          comments: firestore.FieldValue.arrayUnion({
            owner: userSession.uid,
            comment: formData.comment,
            createdAt: 'kkk',
          }),
        });

      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="success"
              title="GameSaved"
              description="Comment added successfully"
              textColor="darkText"
            />
          );
        },
      });
    } catch (err) {
      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="error"
              title="GameSaved"
              description="Error sending comment"
              textColor="darkText"
            />
          );
        },
      });
    } finally {
      setIsLoadingRequest(false);
    }
  };

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
          <FormControl
            isRequired
            isInvalid={'comment' in errors}
            mb={NO_LABEL_INPUT_MARGIN_BOTTOM}>
            <Controller
              control={control}
              name="comment"
              render={({ field: { onChange, value } }) => (
                <Input
                  multiline
                  textAlignVertical="top"
                  h={100}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <FormControl.ErrorMessage>
              {errors.comment?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            title="Enviar"
            w="full"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoadingRequest}
          />
        </NativeBaseVStack>
      </VStack>
    </ScreenWrapper>
  );
};

export default PostDetails;
