import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { PostDto } from '@interfaces/post.dto';

type RouteParams = {
  uuid: string;
};

const Post = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { uuid } = route.params as RouteParams;

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await firestore()
          .collection<PostDto>('posts')
          .doc(uuid)
          .get();

        console.log(response.data());
      } catch (err: any) {
        Alert.alert('>.<', 'Something went wrong', [
          {
            text: 'Voltar',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Tentar novamente',
            onPress: () => getPost(),
          },
        ]);
      }
    };

    getPost();
  }, []);

  return <></>;
};

export default Post;
