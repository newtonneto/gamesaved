import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  AspectRatio,
  VStack as NativeBaseVStack,
  Text,
  HStack,
} from 'native-base';
import { useRoute } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import RenderHtml from 'react-native-render-html';

import ScrollView from '../../components/ScrollView';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import VStack from '../../components/VStack';
import { useAppDispatch } from '../../store';
import { setDrawerHeader } from '../../store/slices/navigation-slice';
import rawg from '../../services/rawg.api';
import { Game } from '../../interfaces/game.dto';
import Loading from '../../components/Loading';

type RouteParams = {
  id: number;
  slug: string;
  name: string;
};

const GameDetails = () => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { id, name } = route.params as RouteParams;
  const { width } = useWindowDimensions();
  const [game, setGame] = useState<Game>({} as Game);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getGame = async () => {
      try {
        const response = await rawg.get<Game>(
          `https://api.rawg.io/api/games/${id}?key=e30c4b13ba264b8680f0fcab95f1b69a`,
        );

        setGame(response.data);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    getGame();

    return () => {
      dispatch(setDrawerHeader(true));
    };
  }, [dispatch, id]);

  return (
    <ScreenWrapper>
      <VStack>
        <Header title={name} />
        {!isLoading ? (
          <ScrollView>
            <AspectRatio w="100%" ratio={16 / 9}>
              <FastImage
                source={{
                  uri: game.background_image,
                }}
              />
            </AspectRatio>
            <VStack px={8} mt={8}>
              <NativeBaseVStack w={width - 64}>
                <Text color="white" fontSize={24}>
                  {game.name}
                </Text>
                <HStack>
                  <Text color="white" fontWeight="700">
                    Lançamento:{' '}
                  </Text>
                  <Text color="white">{game.released}</Text>
                </HStack>
                <HStack>
                  <Text color="white" fontWeight="700">
                    Metacritic:{' '}
                  </Text>
                  <Text color="white">{game.metacritic}</Text>
                </HStack>
              </NativeBaseVStack>
              <RenderHtml
                contentWidth={width - 16}
                source={{
                  html: `<p style="color: white; font-size: 1rem;">
                    <span style="text-align: justify; text-justify: inter-word;">
                    
                      ${game.description}
                    </span>
                  </p>`,
                }}
              />
            </VStack>
          </ScrollView>
        ) : (
          <Loading />
        )}
      </VStack>
    </ScreenWrapper>
  );
};

export default GameDetails;