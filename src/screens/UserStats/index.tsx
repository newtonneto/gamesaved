import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Avatar, useToast } from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  useRoute,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';

import Toast from '@components/Toast';
import VStack from '@components/VStack';
import ScrollView from '@components/ScrollView';
import Loading from '@components/Loading';
import Attribute from '@components/Attribute';
import genderTranslator from '@hashmaps/genderTranslator';
import { ProfileDto } from '@interfaces/profile.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import { AXIS_X_PADDING_CONTENT, TOAST_DURATION } from '@utils/constants';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';

type RouteParams = {
  uuid: string;
};

const UserStats = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { uuid } = route.params as RouteParams;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileDto>({} as ProfileDto);
  const [image, setImage] = useState<string | undefined>(undefined);
  const profileRef = useRef<
    FirebaseFirestoreTypes.DocumentReference<ProfileDto>
  >(firestore().collection<ProfileDto>('profiles').doc(uuid));

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('User Stats'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const getImage = async (avatarRef: string) => {
    if (firestoreValueIsValid(avatarRef)) {
      try {
        const response = await storage().ref(avatarRef).getDownloadURL();

        setImage(response);
      } catch (err) {
        toast.show({
          duration: TOAST_DURATION,
          render: () => {
            return (
              <Toast
                status="error"
                title="GameSaved"
                description="Error to retrieve user avatar"
                textColor="darkText"
              />
            );
          },
        });
      }
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await profileRef.current.get();
        const profileStats = response.data();

        if (profileStats !== undefined) {
          setProfile(profileStats);

          await getImage(profileStats.avatarRef);
        }
      } catch (err) {
        Alert.alert(
          '>.<',
          'Conteúdo indisponível, tente novamente mais tarde.',
          [
            {
              text: 'Voltar',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, []);

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      {!isLoading ? (
        <ScrollView pt={8}>
          <Avatar
            bg="gray.700"
            alignSelf="center"
            size="2xl"
            mb={8}
            source={{
              uri: image,
            }}>{`${profile.firstName[0]}${profile.lastName[0]}`}</Avatar>

          <Attribute type="sword" value={profile.username} svg={false} />
          <Attribute
            type="shield"
            value={`${profile.firstName} ${profile.lastName}`}
            svg={false}
          />
          <Attribute type="magicWand" value={profile.email} svg={false} />
          <Attribute
            type="genderIntersex"
            value={genderTranslator[profile.gender]}
            svg={false}
          />
          {firestoreValueIsValid(profile.psnId) && (
            <Attribute type="playstation" value={profile.psnId} svg={true} />
          )}
          {firestoreValueIsValid(profile.xboxGamertag) && (
            <Attribute type="xbox" value={profile.psnId} svg={true} />
          )}
          {firestoreValueIsValid(profile.nintendoAccount) && (
            <Attribute type="nintendo" value={profile.psnId} svg={true} />
          )}
          {firestoreValueIsValid(profile.steamProfile) && (
            <Attribute type="steam" value={profile.psnId} svg={true} />
          )}
        </ScrollView>
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

export default UserStats;
