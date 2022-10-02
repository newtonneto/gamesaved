import React, { useState, useEffect } from 'react';
import {
  Box,
  Pressable,
  Heading,
  Text,
  VStack,
  Avatar,
  useToast,
} from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import Loading from '@components/Loading';
import Toast from '@components/Toast';
import { ProfileDto } from '@interfaces/profile.dto';
import { AXIS_X_PADDING_CONTENT, CARDS_BORDER_WIDTH } from '@utils/constants';
import avatarRefIsValid from '@utils/avatarRefIsValid';
import { TOAST_DURATION } from '@utils/constants';

type Props = {
  uuid: string;
};

const MemberCard = ({ uuid }: Props) => {
  const navigation = useNavigation();
  const toast = useToast();
  const [profile, setProfile] = useState<ProfileDto>({} as ProfileDto);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getImage = async () => {
    const imageUrl = await storage().ref(profile.avatarRef).getDownloadURL();

    setImage(imageUrl);
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await firestore()
          .collection<ProfileDto>('profiles')
          .doc(uuid)
          .get();

        setProfile(response.data()!);
        setIsLoading(false);
        avatarRefIsValid(response.data()!.avatarRef) && getImage();
      } catch (err) {
        toast.show({
          duration: TOAST_DURATION,
          render: () => {
            return (
              <Toast
                status="error"
                title="GameSaved"
                description="Error to retrieve member stats"
                textColor="darkText"
              />
            );
          },
        });
      }
    };

    getProfile();
  }, []);

  const handleNavigation = () => {
    navigation.navigate('UserStats', {
      uuid,
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
        {!isLoading ? (
          <>
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
          </>
        ) : (
          <Loading />
        )}
      </Box>
    </Pressable>
  );
};

export default MemberCard;
