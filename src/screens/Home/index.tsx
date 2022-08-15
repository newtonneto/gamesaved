import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

import VStack from '../../components/VStack';
import { Game } from '../../interfaces/game.dto';
import rawg from '../../services/rawg.api';
import GameCard from '../../components/GameCard';
import { GamesPage } from '../../interfaces/gamespage.dto';
import Loading from '../../components/Loading';
import {
  FlatListFooter,
  FlatListSeparator,
} from '../../components/FlatListComponents';

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
        const response = await rawg.get<GamesPage>(
          'games?key=e30c4b13ba264b8680f0fcab95f1b69a',
        );

        setGames(response.data.results);
        handleNextPage(response.data);
      } catch (err) {
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
    <VStack px={8}>
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
    paddingVertical: 24,
  },
});

export default Home;
