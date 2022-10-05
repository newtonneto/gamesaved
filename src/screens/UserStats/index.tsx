import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Avatar, Fab, useTheme, useToast } from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  useRoute,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UserCirclePlus, UserCircleMinus } from 'phosphor-react-native';

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
import { PartyDto } from '@src/interfaces/party.dto';

type RouteParams = {
  uuid: string;
};

const UserStats = () => {
  const toast = useToast();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { uuid } = route.params as RouteParams;
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<ProfileDto>({} as ProfileDto);
  const [image, setImage] = useState<string | undefined>(undefined);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const profileRef = useRef<
    FirebaseFirestoreTypes.DocumentReference<ProfileDto>
  >(firestore().collection<ProfileDto>('profiles').doc(uuid));
  const partyRef = useRef<FirebaseFirestoreTypes.DocumentReference<PartyDto>>(
    firestore().collection<PartyDto>('parties').doc(userSession.uid),
  );

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('User Stats'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const checkMember = async () => {
    try {
      const response = (await partyRef.current.get()).data();

      if (response !== undefined) {
        setIsMember(response.members.includes(uuid));
      }
    } catch {
      Alert.alert('>.<', 'Conteúdo indisponível, tente novamente mais tarde.', [
        {
          text: 'Voltar',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  useEffect(() => {
    checkMember();
  }, []);

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

  const handleInvite = async () => {
    toast.show({
      duration: TOAST_DURATION,
      render: () => {
        return (
          <Toast
            status="warning"
            title="GameSaved"
            description="Inviting member to party"
            textColor="darkText"
          />
        );
      },
    });

    try {
      await partyRef.current.update({
        members: firestore.FieldValue.arrayUnion(uuid),
      });

      setIsMember(true);

      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="success"
              title="GameSaved"
              description="Member joined to the party"
              textColor="darkText"
            />
          );
        },
      });
    } catch (err) {
      Alert.alert(
        '>.<',
        'Não foi possível concluir a operação, tente novamente mais tarde.',
        [
          {
            text: 'Ok',
          },
        ],
      );
    }
  };

  const handleBan = async () => {
    toast.show({
      duration: TOAST_DURATION,
      render: () => {
        return (
          <Toast
            status="warning"
            title="GameSaved"
            description="Banning party member"
            textColor="darkText"
          />
        );
      },
    });

    try {
      await partyRef.current.update({
        members: firestore.FieldValue.arrayRemove(uuid),
      });

      setIsMember(false);

      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="success"
              title="GameSaved"
              description="Member banned to the party"
              textColor="darkText"
            />
          );
        },
      });
    } catch (err) {
      Alert.alert(
        '>.<',
        'Não foi possível concluir a operação, tente novamente mais tarde.',
        [
          {
            text: 'Ok',
          },
        ],
      );
    }
  };

  const handleMember = async () => {
    isMember ? handleBan() : handleInvite();
  };

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      {!isLoading ? (
        <>
          <Fab
            placement="bottom-right"
            renderInPortal={false}
            shadow={2}
            bg={isMember ? 'gray.700' : 'secondary.700'}
            icon={
              isMember ? (
                <UserCircleMinus color={colors.white} size={18} />
              ) : (
                <UserCirclePlus color={colors.white} size={18} />
              )
            }
            label={isMember ? 'Ban Member' : 'Invite Member'}
            onPress={handleMember}
            _pressed={{ bg: 'gray.500' }}
          />
          <ScrollView pt={8}>
            <Avatar
              bg="gray.700"
              alignSelf="center"
              size="2xl"
              mb={8}
              source={{
                uri: image,
              }}>{`${profile.firstName[0]}${profile.lastName[0]}`}</Avatar>

            <Attribute
              type="sword"
              value={profile.username}
              svg={false}
              label="Username"
            />
            <Attribute
              type="shield"
              value={`${profile.firstName} ${profile.lastName}`}
              svg={false}
              label="Nome"
            />
            <Attribute
              type="magicWand"
              value={profile.email}
              svg={false}
              label="Email"
            />
            <Attribute
              type="genderIntersex"
              value={genderTranslator[profile.gender]}
              svg={false}
              label="Gênero"
            />
            {firestoreValueIsValid(profile.psnId) && (
              <Attribute
                type="playstation"
                value={profile.psnId}
                svg={true}
                label="PSN ID"
              />
            )}
            {firestoreValueIsValid(profile.xboxGamertag) && (
              <Attribute
                type="xbox"
                value={profile.psnId}
                svg={true}
                label="Xbox Gamertag"
              />
            )}
            {firestoreValueIsValid(profile.nintendoAccount) && (
              <Attribute
                type="nintendo"
                value={profile.psnId}
                svg={true}
                label="Nintendo Account"
              />
            )}
            {firestoreValueIsValid(profile.steamProfile) && (
              <Attribute
                type="steam"
                value={profile.psnId}
                svg={true}
                label="Steam Profile"
              />
            )}
          </ScrollView>
        </>
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

export default UserStats;
