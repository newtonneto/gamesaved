import React, { useState, useEffect, memo } from 'react';
import { Pressable, Box, HStack, AspectRatio, Heading } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import Loading from '@components/Loading';
import { Game } from '@interfaces/game.dto';
import rawg from '@services/rawg.api';
import { AXIS_X_PADDING_CONTENT, RATIO } from '@utils/constants';
import { GAMEAPI_KEY } from 'react-native-dotenv';

type Props = {
  id: number;
};

const LootCard = ({ id }: Props) => {
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
      mx={AXIS_X_PADDING_CONTENT}>
      <Box
        w="98%"
        rounded="lg"
        overflow="hidden"
        borderWidth={1}
        borderColor="secondary.700"
        h={14}
        bg="gray.600">
        {!isLoading ? (
          <HStack h={14} w="full" alignItems="center">
            {!hasError && (
              <AspectRatio w="30%" ratio={RATIO} h={14} zIndex={-1}>
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
