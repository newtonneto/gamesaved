import React, { useState, useEffect } from 'react';
import {
  Pressable,
  Box,
  HStack,
  AspectRatio,
  Heading,
  useTheme,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Trash } from 'phosphor-react-native';

import Loading from '@components/Loading';
import { Game } from '@interfaces/game.dto';
import rawg from '@services/rawg.api';
import { AXIS_X_PADDING_CONTENT, RATIO } from '@styles/sizes';
import { GAMEAPI_KEY } from 'react-native-dotenv';

type Props = {
  id: number;
};

const LootCard = ({ id }: Props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game>({} as Game);

  useEffect(() => {
    const getGame = async () => {
      try {
        const response = await rawg.get<Game>(`games/${id}?key=${GAMEAPI_KEY}`);

        setGame(response.data);
      } catch (err) {
        console.warn('err: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    getGame();
  }, [id]);

  const handleNavigation = () => {
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
        w="full"
        rounded="lg"
        overflow="hidden"
        borderColor="secondary.700"
        borderWidth="1"
        h={14}
        bg="gray.600">
        {!isLoading ? (
          <HStack h="14" w="full" alignItems="center">
            <AspectRatio w="30%" ratio={RATIO}>
              <FastImage
                source={{
                  uri: game.background_image,
                }}
              />
            </AspectRatio>
            <Heading
              size="sm"
              color="white"
              ellipsizeMode="tail"
              w="70%"
              numberOfLines={1}
              px={4}>
              {game.name}
            </Heading>
          </HStack>
        ) : (
          <Loading />
        )}
      </Box>
    </Pressable>
  );
};

export const RightButton = () => {
  const { colors } = useTheme();

  return (
    <Box alignItems="flex-end">
      <Box
        width={24}
        h={14}
        bg="red.700"
        rounded="lg"
        mx={8}
        alignItems="center"
        justifyContent="center">
        <Trash color={colors.white} size={24} />
      </Box>
    </Box>
  );
};

export default LootCard;
