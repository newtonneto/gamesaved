import React, { useState, useEffect, memo } from 'react';
import { Pressable, Box, HStack, AspectRatio, Heading } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import Loading from '@components/Loading';
import { Game } from '@interfaces/game.dto';
import rawg from '@services/rawg.api';
import {
  AXIS_X_PADDING_CONTENT,
  CARDS_BORDER_WIDTH,
  RATIO,
} from '@utils/constants';
import { GAMEAPI_KEY } from 'react-native-dotenv';

type Props = {
  id: number;
  hasPadding?: boolean;
  width?: string;
};

const LootCard = ({ id, hasPadding = true, width = '98%' }: Props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game>({} as Game);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const getGame = async () => {
      try {
        const response = await rawg.get<Game>(`games/${id}?key=${GAMEAPI_KEY}`);

        isMounted && setGame(response.data);
        isMounted && setIsLoading(false);
      } catch (err) {
        setHasError(true);
      }
    };

    getGame();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleNavigation = () => {
    !hasError &&
      !isLoading &&
      navigation.navigate('GameScreen', {
        id: game.id,
        slug: game.slug,
        name: game.name,
      });
  };

  return (
    <Pressable
      alignItems="center"
      onPress={handleNavigation}
      mx={hasPadding ? AXIS_X_PADDING_CONTENT : 0}>
      <Box
        w={width}
        rounded="lg"
        overflow="hidden"
        borderWidth={CARDS_BORDER_WIDTH}
        borderColor="secondary.700"
        h={14}
        bg="gray.600">
        {!isLoading ? (
          <HStack h={14} w="full" alignItems="center">
            {!hasError && (
              <AspectRatio ratio={RATIO} h={14}>
                <FastImage
                  source={{
                    uri: game.background_image,
                  }}
                />
              </AspectRatio>
            )}
            <Heading
              size="sm"
              color="white"
              ellipsizeMode="tail"
              w="70%"
              numberOfLines={1}
              px={4}>
              {hasError ? 'Fetch Failed x_x' : game.name}
            </Heading>
          </HStack>
        ) : (
          <Loading />
        )}
      </Box>
    </Pressable>
  );
};

export default memo(LootCard);
