import React, { useState, useEffect } from 'react';
import { Box, Pressable, Heading, Text, VStack, Avatar } from 'native-base';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

import { ProfileDto } from '@interfaces/profile.dto';
import { AXIS_X_PADDING_CONTENT, CARDS_BORDER_WIDTH } from '@utils/constants';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';

type Props = {
  profile: ProfileDto;
};

const UserCard = ({ profile }: Props) => {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getImage = async () => {
      const imageUrl = await storage().ref(profile.avatarRef).getDownloadURL();

      setImage(imageUrl);
    };

    firestoreValueIsValid(profile.avatarRef) && getImage();
  }, []);

  const handleNavigation = () => {
    navigation.navigate('UserStats', {
      uuid: profile.uuid,
    });
  };

  return (
    <Pressable mx={AXIS_X_PADDING_CONTENT} onPress={handleNavigation}>
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
          alignSelf="center"
          source={{
            uri: image,
          }}>{`${profile.firstName[0]}${profile.lastName[0]}`}</Avatar>
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
