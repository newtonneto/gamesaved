import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { FormControl, useTheme, IconButton, Heading } from 'native-base';
import { useIsFocused } from '@react-navigation/native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MagnifyingGlass, XCircle } from 'phosphor-react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import VStack from '@components/VStack';
import Input from '@components/Input';
import { ProfileDto } from '@interfaces/profile.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  VERTICAL_PADDING_LISTS,
} from '@utils/constants';

type FormData = {
  searchValue: string;
};

const schema = yup.object().shape({
  searchValue: yup.string(),
});

const FindFriends = () => {
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
  const profilesRef = useRef(firestore().collection<ProfileDto>('profiles'));

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
            .orderBy('email')
            .startAt(data.searchValue)
            .endAt(data.searchValue + '\uf8ff')
            .get()
        ).docs;

        if (response.length > 0) {
          const data: ProfileDto[] = response.map(item => {
            return item.data();
          });

          setUsers(data);
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

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      <SwipeListView
        data={[]}
        renderItem={() => <></>}
        ListHeaderComponent={FlatListHeader}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
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
