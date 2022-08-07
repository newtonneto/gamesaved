import React, { useEffect, useState } from 'react';
import axios from 'axios';

import VStack from '../../components/VStack';
import { Game } from '../../interfaces/game.dto';
import rawg from '../../services/rawg.api';
import GameCard from '../../components/GameCard';
import ScrollView from '../../components/ScrollView';

const Home = () => {
  const [game, setGame] = useState<Game>({} as Game);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getGames = async () => {
    try {
      const response = await axios.get<Game>(
        'https://api.rawg.io/api/games/3498?key=e30c4b13ba264b8680f0fcab95f1b69a',
      );
      console.log('response: ', response.data.name);

      setGame(response.data);
      setIsLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <VStack>
      <ScrollView>{!isLoading && <GameCard game={game} />}</ScrollView>
    </VStack>
  );
};

export default Home;
