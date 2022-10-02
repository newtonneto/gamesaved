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
import { ProfileDto } from '@interfaces/profile.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import { AXIS_X_PADDING_CONTENT } from '@utils/constants';
import Attribute from '@src/components/Attribute';

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
          <Attribute type="sword" value={profile.username} />
          <Attribute
            type="sword"
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <Attribute type="sword" value={profile.email.toUpperCase()} />
          <Attribute type="sword" value={profile.gender.toUpperCase()} />
          <Attribute type="sword" value={profile.psnId.toUpperCase()} />
          <Attribute type="sword" value={profile.xboxGamertag.toUpperCase()} />
          <Attribute
            type="sword"
            value={profile.nintendoAccount.toUpperCase()}
          />
          <Attribute type="sword" value={profile.steamProfile.toUpperCase()} />
        </ScrollView>
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

export default UserStats;
