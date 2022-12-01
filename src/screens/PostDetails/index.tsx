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
import storage from '@react-native-firebase/storage';
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
import Loading from '@components/Loading';
import { PostDto } from '@interfaces/post.dto';
import { ProfileDto } from '@interfaces/profile.dto';
import { CommentsDto } from '@interfaces/comments.dto';
import { CommentModel } from '@interfaces/comment.model';
import {
  AXIS_X_MARGIN_CONTENT,
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  TOAST_DURATION,
} from '@utils/constants';
import firestoreDateFormat from '@utils/fireabseDateFormat';
import { generateErrorMessage } from '@utils/generateErrorMessage';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';

type RouteParams = {
  postUuid: string;
  postData?: PostDto;
  userData?: ProfileDto;
  imageData?: string | undefined;
};

type FormData = {
  comment: string;
};

type Post = {
  postData: PostDto;
  userData: ProfileDto;
  imageData: string | undefined;
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
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [post, setPost] = useState<Post>({
    postData: postData ? postData : ({} as PostDto),
    userData: userData ? userData : ({} as ProfileDto),
    imageData,
  });
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;

  const getPost = async (uuid: string): Promise<PostDto> => {
    try {
      const response = await firestore().collection('posts').doc(uuid).get();

      if (!response.exists) throw new Error('Post not found');

      return response.data() as PostDto;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  };

  const getUser = async (ownerUuid: string): Promise<ProfileDto> => {
    try {
      const response = await firestore()
        .collection('profiles')
        .doc(ownerUuid)
        .get();

      if (!response.exists) throw new Error('User not found');

      return response.data() as ProfileDto;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  };

  const getImage = async (imageRef: string): Promise<string> => {
    try {
      if (!firestoreValueIsValid(imageRef)) throw new Error('Image not found');

      const imageUrl = await storage().ref(imageRef).getDownloadURL();

      return imageUrl;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  };

  const getComments = async () => {
    try {
      const response = await firestore()
        .collection<CommentsDto>('comments')
        .doc(postUuid)
        .get();

      if (!response.exists) throw new Error('Comments not found');

      const commentsData = response.data() as CommentsDto;

      if (!commentsData) throw new Error('Comments not found');

      console.log('commentsData', commentsData.comments);

      setComments(commentsData.comments);
    } catch (err) {
      Alert.alert(
        '>.<',
        generateErrorMessage(
          err,
          'Conteúdo indisponível, tente novamente mais tarde.',
        ),
        [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  };

  useEffect(() => {
    const getPostData = async () => {
      try {
        const fetchedPost = await getPost(postUuid);
        const fetchedUser = await getUser(fetchedPost.owner);
        const fetchedImage = await getImage(fetchedUser.avatarRef);

        setPost({
          postData: fetchedPost,
          userData: fetchedUser,
          imageData: fetchedImage,
        });
      } catch (err) {
        Alert.alert(
          '>.<',
          generateErrorMessage(
            err,
            'Conteúdo indisponível, tente novamente mais tarde.',
          ),
          [
            {
              text: 'Ok',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    };

    if (!postData || !userData) {
      getPostData();
    }

    getComments();

    setIsLoading(false);
  }, []);

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
        <Header title={post.postData.title ? post.postData.title : ''} />
        {!isLoading ? (
          <VStack w="full">
            <ScrollView px={AXIS_X_PADDING_CONTENT}>
              <UserLabel
                image={imageData}
                username={post.userData.username ? post.userData.username : ''}
              />
              <Heading size="md" color="white" w="full" mb={2}>
                {postData ? postData.title : post.postData.title}
              </Heading>
              <Text color="white" width="full">
                {post.postData.description ? post.postData.description : ''}
              </Text>
              <VStack width="full" alignItems="flex-end">
                <Text
                  color="white"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  fontSize="xs">
                  Criado em:{' '}
                  {post.postData.createdAt
                    ? firestoreDateFormat(post.postData.createdAt)
                    : ''}
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
        ) : (
          <Loading />
        )}
      </VStack>
    </ScreenWrapper>
  );
};

export default PostDetails;
