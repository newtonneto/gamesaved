import React, { useEffect, useRef, useState } from 'react';
import { Alert, ListRenderItem, StyleSheet, View } from 'react-native';
import { FormControl, useTheme, IconButton, useToast } from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MagnifyingGlass, XCircle } from 'phosphor-react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Toast from '@components/Toast';
import VStack from '@components/VStack';
import Input from '@components/Input';
import UserCard from '@components/UserCard';
import HiddenButton from '@components/HiddenButton';
import { ProfileDto } from '@interfaces/profile.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  TOAST_DURATION,
  VERTICAL_PADDING_LISTS,
} from '@utils/constants';

type FormData = {
  searchValue: string;
};

const schema = yup.object().shape({
  searchValue: yup.string(),
});

const FindFriends = () => {
  const toast = useToast();
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
  const profilesRef = useRef<
    FirebaseFirestoreTypes.CollectionReference<ProfileDto>
  >(firestore().collection<ProfileDto>('profiles'));
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Find Friends'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const onSubmit = async (data: FormData) => {
    if (data.searchValue) {
      setIsLoading(true);

      try {
        const response = await (
          await profilesRef.current
            .where('email', '!=', userSession.email)
            .orderBy('email')
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
    <FormControl
      isRequired
      isInvalid={'searchValue' in errors}
      mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
      px={AXIS_X_PADDING_CONTENT}>
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
                  onPress={() => setValue('searchValue', '')}
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
  );

  const RenderItem: ListRenderItem<ProfileDto> = ({ item }) => (
    <UserCard profile={item} key={item.email} />
  );

  const handleRemove = async (removedLoot: number, rowMap: RowMap<number>) => {
    toast.show({
      duration: TOAST_DURATION,
      render: () => {
        return (
          <Toast
            status="success"
            title="GameSaved"
            description="Removing game, please dont turn off your phone"
            textColor="darkText"
          />
        );
      },
    });
  };

  return (
    <VStack>
      <SwipeListView
        data={users}
        renderItem={RenderItem}
        ListHeaderComponent={FlatListHeader}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        renderHiddenItem={(rowData, rowMap) => (
          <HiddenButton
            handler={handleRemove}
            id={rowData.index}
            rowMap={rowMap}
            type="add_friend"
          />
        )}
        rightOpenValue={-75}
        stopRightSwipe={-75}
        stopLeftSwipe={1}
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
  },
  flatListContent: {
    paddingVertical: VERTICAL_PADDING_LISTS,
  },
});

export default FindFriends;
