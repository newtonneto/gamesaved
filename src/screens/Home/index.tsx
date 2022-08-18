import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';
import { FormControl, useTheme, IconButton } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MagnifyingGlass, XCircle } from 'phosphor-react-native';

import VStack from '@components/VStack';
import Loading from '@components/Loading';
import GameCard from '@components/GameCard';
import {
  FlatListFooter,
  FlatListSeparator,
} from '@components/FlatListComponents';
import Input from '@components/Input';
import { Game } from '@interfaces/game.dto';
import { GamesPage } from '@interfaces/gamespage.dto';
import rawg from '@services/rawg.api';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  VERTICAL_PADDING_LISTS,
} from '@styles/sizes';
import { GAMEAPI_KEY } from 'react-native-dotenv';

type FormData = {
  searchValue: string;
};

const schema = yup.object().shape({
  searchValue: yup.string(),
});

const Home = () => {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasNext = useRef<boolean>(false);
  const nextUrl = useRef<string>('');
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);

  const handleNextPage = (data: GamesPage) => {
    if (data.next) {
      hasNext.current = true;
      nextUrl.current = data.next;
    } else {
      hasNext.current = false;
      nextUrl.current = '';
    }
  };

  const getGames = useCallback(async () => {
    setValue('searchValue', '');
    setIsLoading(true);

    try {
      const response = await rawg.get<GamesPage>(`games?key=${GAMEAPI_KEY}`);

      setGames(response.data.results);
      handleNextPage(response.data);
    } catch (err) {
      Alert.alert('>.<', 'Conteúdo indisponível, tente novamente mais tarde.', [
        {
          text: 'Ok',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    getGames();
  }, [getGames]);

  const getNextGames = async () => {
    setIsLoadingNext(true);

    try {
      const response = await rawg.get<GamesPage>(nextUrl.current);

      setGames([...games, ...response.data.results]);
      handleNextPage(response.data);
    } catch (err) {
      Alert.alert('>.<', 'Conteúdo indisponível, tente novamente mais tarde.', [
        {
          text: 'Ok',
        },
      ]);
    } finally {
      setIsLoadingNext(false);
    }
  };

  const RenderItem = ({ item }: { item: Game }) => (
    <GameCard game={item} key={item.id} />
  );

  const onSubmit = async (data: FormData) => {
    if (data.searchValue) {
      setIsLoading(true);

      try {
        const response = await rawg.get<GamesPage>(
          `games?search=${data.searchValue}&key=${GAMEAPI_KEY}`,
        );

        setGames(response.data.results);
        handleNextPage(response.data);
      } catch (err) {
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
            placeholder="Look for a game"
            InputLeftElement={
              value ? (
                <IconButton
                  _icon={{
                    as: <XCircle color={colors.gray[300]} />,
                  }}
                  onPress={getGames}
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
      {!isLoading ? (
        <FlatList
          data={games}
          renderItem={RenderItem}
          onEndReached={getNextGames}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.flatList}
          ListHeaderComponent={FlatListHeader}
          ListFooterComponent={() => FlatListFooter(isLoadingNext)}
          ItemSeparatorComponent={FlatListSeparator}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

const styles = StyleSheet.create({
  flatList: {
    paddingVertical: VERTICAL_PADDING_LISTS,
  },
});

export default Home;
