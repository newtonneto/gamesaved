import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

import VStack from '@components/VStack';
import Loading from '@components/Loading';
import GameCard from '@components/GameCard';
import {
  FlatListFooter,
  FlatListSeparator,
} from '@components/FlatListComponents';
import { Game } from '@interfaces/game.dto';
import { GamesPage } from '@interfaces/gamespage.dto';
import rawg from '@services/rawg.api';
import { AXIS_X_PADDING_CONTENT, VERTICAL_PADDING_LISTS } from '@styles/sizes';
import { GAMEAPI_KEY } from 'react-native-dotenv';

const Home = () => {
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

  useEffect(() => {
    const getGames = async () => {
      try {
        const response = await rawg.get<GamesPage>(`games?key=${GAMEAPI_KEY}`);

        setGames(response.data.results);
        handleNextPage(response.data);
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
    };

    getGames();
  }, []);

  const getNextGames = async () => {
    setIsLoadingNext(true);

    try {
      const response = await axios.get<GamesPage>(nextUrl.current);

      setGames([...games, ...response.data.results]);
      handleNextPage(response.data);
    } catch (err) {
    } finally {
      setIsLoadingNext(false);
    }
  };

  const RenderItem = ({ item }: { item: Game }) => (
    <GameCard game={item} key={item.id} />
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
