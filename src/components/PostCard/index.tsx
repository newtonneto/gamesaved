import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
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
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { PostDto } from '@interfaces/post.dto';
import { AXIS_X_MARGIN_CONTENT, CARDS_BORDER_WIDTH } from '@utils/constants';
import firestoreDateFormat from '@utils/fireabseDateFormat';

type Props = {
  uuid: string;
};

const PostCard = ({ uuid }: Props) => {
  const [post, setPost] = useState<PostDto>({} as PostDto);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await firestore().collection('posts').doc(uuid).get();

        setPost(response.data() as PostDto);
      } catch (err) {
        Alert.alert(
          '>.<',
          'Conteúdo indisponível, tente novamente mais tarde.',
          [
            {
              text: 'Ok',
            },
          ],
        );
      } finally {
        setIsLoading(false);
      }
    };

    getPost();
  }, []);

  return (
    <Pressable mx={AXIS_X_MARGIN_CONTENT}>
      <Box
        w="full"
        overflow="hidden"
        rounded="lg"
        borderWidth={CARDS_BORDER_WIDTH}
        borderColor="secondary.700"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start">
        <VStack w="full" py={2} px={4}>
          <Heading
            size="sm"
            color="white"
            ellipsizeMode="tail"
            numberOfLines={1}
            w="full">
            {post.title}
          </Heading>
          <Text
            color="white"
            ellipsizeMode="tail"
            numberOfLines={2}
            width="100%">
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
        </VStack>
      </Box>
    </Pressable>
  );
};

export default PostCard;
