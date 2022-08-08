import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { HStack, useTheme } from 'native-base';
import axios from 'axios';

import VStack from '../../components/VStack';
import { Game } from '../../interfaces/game.dto';
import rawg from '../../services/rawg.api';
import GameCard from '../../components/GameCard';
import { GamesPage } from '../../interfaces/gamespage.dto';

const Home = () => {
  const { colors } = useTheme();
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
          'https://api.rawg.io/api/games?key=e30c4b13ba264b8680f0fcab95f1b69a',
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

  const FlatListFooter = () => (
    <HStack alignItems="center" justifyContent="center" py={8}>
      {isLoadingNext && <ActivityIndicator size="small" color={colors.white} />}
    </HStack>
  );

  const FlatListSeparator = () => <HStack h={8} />;

  return (
    <VStack>
      <FlatList
        data={games}
        renderItem={RenderItem}
        onEndReached={getNextGames}
        onEndReachedThreshold={0.1}
        contentContainerStyle={styles.flatList}
        ListFooterComponent={FlatListFooter}
        ItemSeparatorComponent={FlatListSeparator}
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  flatList: {
    paddingVertical: 24,
  },
});

export default Home;
