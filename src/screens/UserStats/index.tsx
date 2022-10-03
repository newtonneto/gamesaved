import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Text } from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { useRoute, useIsFocused } from '@react-navigation/native';

import VStack from '@components/VStack';
import ScrollView from '@components/ScrollView';
import Loading from '@components/Loading';
import Attribute from '@components/Attribute';
import { ProfileDto } from '@interfaces/profile.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import { AXIS_X_PADDING_CONTENT } from '@utils/constants';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';

type RouteParams = {
  uuid: string;
};

const UserStats = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { uuid } = route.params as RouteParams;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileDto>({} as ProfileDto);
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

  useEffect(() => {
    const subscriber = profileRef.current.onSnapshot(snapshot => {
      const profileStats: ProfileDto = snapshot.data()!;

      setProfile(profileStats);
    });

    setIsLoading(false);

    return subscriber;
  }, []);

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      {!isLoading ? (
        <ScrollView pt={8}>
          <Attribute type="sword" value={profile.username} svg={false} />
          <Attribute
            type="shield"
            value={`${profile.firstName} ${profile.lastName}`}
            svg={false}
          />
          <Attribute type="magicWand" value={profile.email} svg={false} />
          <Attribute type="genderIntersex" value={profile.gender} svg={false} />
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
