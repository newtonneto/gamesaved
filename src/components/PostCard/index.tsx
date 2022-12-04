import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Box,
  Pressable,
  Heading,
  Text,
  VStack,
  Spinner,
  useTheme,
} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Warning } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import UserLabel from '@components/UserLabel';
import { PostDto } from '@interfaces/post.dto';
import { ProfileDto } from '@interfaces/profile.dto';
import { AXIS_X_MARGIN_CONTENT, CARDS_BORDER_WIDTH } from '@utils/constants';
import firestoreDateFormat from '@utils/fireabseDateFormat';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';

type Props = {
  uuid: string;
};

const PostCard = ({ uuid }: Props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [post, setPost] = useState<PostDto>({} as PostDto);
  const [user, setUser] = useState<ProfileDto>({} as ProfileDto);
  const [hasError, setHasError] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const postUuid = useRef<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPost = async (): Promise<PostDto> => {
    try {
      const response = await firestore().collection('posts').doc(uuid).get();

      if (!response.exists) throw new Error('Post not found');

      postUuid.current = response.id;

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

  useEffect(() => {
    const initialize = async () => {
      try {
        const postData = await getPost();
        setPost(postData);

        const userData = await getUser(postData.owner);
        setUser(userData);

        if (userData.avatarRef) {
          const imageData = await getImage(userData.avatarRef);
          setImage(imageData);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const handleNavigation = () => {
    navigation.navigate('PostDetails', {
      postData: post,
      userData: user,
      imageData: image,
      postUuid: postUuid.current,
    });
  };

  return (
    <Pressable mx={AXIS_X_MARGIN_CONTENT} onPress={handleNavigation}>
      <Box
        w="full"
        minH={90}
        overflow="hidden"
        rounded="lg"
        borderWidth={CARDS_BORDER_WIDTH}
        borderColor="secondary.700"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start">
        {isLoading ? (
          <VStack w="full" justifyContent="center" alignItems="center">
            <Spinner
              accessibilityLabel="Loading content"
              color="secondary.700"
              size="sm"
            />
          </VStack>
        ) : (
          <VStack w="full" py={2} px={4}>
            {!hasError ? (
              <Fragment>
                <UserLabel image={image} username={user.username} />
                <Heading
                  size="sm"
                  color="white"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  w="full"
                  mb={2}>
                  {post.title}
                </Heading>
                <Text
                  color="white"
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  width="full">
                  {post.description}
                </Text>
                <VStack width="full" alignItems="flex-end">
                  <Text
                    color="white"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    fontSize="xs">
                    Criado em: {firestoreDateFormat(post.createdAt)}
                  </Text>
                </VStack>
                {post.updatedAt && (
                  <VStack width="full" justifyContent="flex-end">
                    <Text
                      color="white"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      fontSize="xs">
                      Atualizado em: {firestoreDateFormat(post.updatedAt)}
                    </Text>
                  </VStack>
                )}
              </Fragment>
            ) : (
              <VStack w="full" justifyContent="center" alignItems="center">
                <Warning color={colors.secondary[700]} />
                <Text color="white">{'Something went wrong :('}</Text>
              </VStack>
            )}
          </VStack>
        )}
      </Box>
    </Pressable>
  );
};

export default PostCard;
