import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { FormControl, useTheme, IconButton, Button } from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MagnifyingGlass, XCircle } from 'phosphor-react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

import VStack from '@components/VStack';
import Input from '@components/Input';
import { ProfileDto } from '@interfaces/profile.dto';
import { PartyDto } from '@interfaces/party.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
} from '@utils/constants';
import UsersSearchList from '@src/components/UsersSearchList';

type FormData = {
  searchValue: string;
};

const schema = yup.object().shape({
  searchValue: yup.string(),
});

const FindFriends = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<ProfileDto[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileDto>({} as ProfileDto);
  const [filterSelected, setFilterSelected] = useState<'email' | 'username'>(
    'email',
  );
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const profilesRef = useRef<
    FirebaseFirestoreTypes.CollectionReference<ProfileDto>
  >(firestore().collection<ProfileDto>('profiles'));
  const partyRef = useRef<FirebaseFirestoreTypes.DocumentReference<PartyDto>>(
    firestore().collection<PartyDto>('parties').doc(userSession.uid),
  );

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Find Friends'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    const subscriber = partyRef.current.onSnapshot(snapshot => {
      const list: string[] = snapshot.get('members');

      setMembers(list);
    });

    return subscriber;
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await firestore()
          .collection<ProfileDto>('profiles')
          .doc(userSession.uid)
          .get();

        setProfile(response.data()!);
      } catch (err) {
        Alert.alert(
          '>.<',
          'Conteúdo indisponível, tente novamente mais tarde.',
          [
            {
              text: 'Ok',
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

  const onSubmit = async (data: FormData) => {
    if (data.searchValue) {
      setIsLoading(true);

      try {
        const response = await (
          await profilesRef.current
            .where(
              filterSelected,
              '!=',
              filterSelected === 'email' ? userSession.email : profile.username,
            )
            .orderBy(filterSelected)
            .startAt(data.searchValue)
            .endAt(data.searchValue + '\uf8ff')
            .get()
        ).docs;

        if (response.length > 0) {
          const data: ProfileDto[] = response.map(item => {
            return { ...item.data() };
          });

          setUsers([...data]);
        } else {
          setUsers([]);
        }
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
    }
  };

  const FlatListHeader = () => (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      <FormControl
        isRequired
        isInvalid={'searchValue' in errors}
        mb={NO_LABEL_INPUT_MARGIN_BOTTOM}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Find a friend"
              InputLeftElement={
                value ? (
                  <IconButton
                    _icon={{
                      as: <XCircle color={colors.gray[300]} />,
                    }}
                    onPress={() => {
                      setValue('searchValue', '');
                      setUsers([]);
                    }}
                  />
                ) : undefined
              }
              InputRightElement={
                <IconButton
                  _icon={{
                    as: <MagnifyingGlass color={colors.gray[300]} />,
                  }}
                  onPress={handleSubmit(onSubmit)}
                />
              }
              onChangeText={onChange}
              value={value}
              isDisabled={isLoading}
              autoCorrect={false}
              selectionColor="secondary.700"
              autoCapitalize="none"
              keyboardType="web-search"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
          name="searchValue"
          defaultValue=""
        />
      </FormControl>
      <Button.Group
        isAttached
        size="sm"
        w="full"
        mb={NO_LABEL_INPUT_MARGIN_BOTTOM}>
        <Button
          bg={filterSelected === 'email' ? 'secondary.700' : 'gray.600'}
          _text={{
            color: 'white',
          }}
          flexGrow={1}
          flexShrink={1}
          flexBasis={0}
          borderRightRadius={0}
          borderWidth={filterSelected === 'email' ? 1 : 0}
          variant={filterSelected === 'email' ? 'solid' : 'outline'}
          onPress={() => setFilterSelected('email')}>
          EMAIL
        </Button>
        <Button
          bg={filterSelected === 'username' ? 'secondary.700' : 'gray.600'}
          _text={{
            color: 'white',
          }}
          flexGrow={1}
          flexShrink={1}
          flexBasis={0}
          borderLeftRadius={0}
          borderWidth={filterSelected === 'username' ? 1 : 0}
          variant={filterSelected === 'username' ? 'solid' : 'outline'}
          onPress={() => setFilterSelected('username')}>
          USERNAME
        </Button>
      </Button.Group>
    </VStack>
  );

  return (
    <VStack>
      <UsersSearchList
        partyRef={partyRef}
        members={members}
        users={users}
        flatListHeader={FlatListHeader}
      />
    </VStack>
  );
};

export default FindFriends;
