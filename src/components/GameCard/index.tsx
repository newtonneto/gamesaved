import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  AspectRatio,
  Box,
  Center,
  Heading,
  HStack,
  Stack,
  Text,
  useTheme,
} from 'native-base';
import { Star, FloppyDisk } from 'phosphor-react-native';
import FastImage from 'react-native-fast-image';

import { Game } from '../../interfaces/game.dto';
import { formatDate } from '../../utils/formatDate';

type Props = {
  game: Game;
};

const GameCard = ({ game }: Props) => {
  const { colors } = useTheme();
  const released = formatDate(game.released);

  return (
    <Box alignItems="center">
      <Box
        w="full"
        rounded="lg"
        overflow="hidden"
        borderColor="secondary.700"
        borderWidth="1">
        <Box>
          <AspectRatio w="100%" ratio={16 / 9}>
            <FastImage
              source={{
                uri: game.background_image,
              }}
            />
          </AspectRatio>
          <Center
            bg="gray.700"
            position="absolute"
            bottom="0"
            px="3"
            py="1.5"
            flexDirection="row"
            opacity={0.8}
            w="full"
            justifyContent="space-between">
            <HStack alignItems="center">
              <Star color={colors.white} style={styles.icon} />
              <Text color={colors.white}>{game.metacritic}</Text>
            </HStack>
            <HStack>
              <FloppyDisk color={colors.white} style={styles.icon} />
            </HStack>
          </Center>
        </Box>
        <Stack p="4" space={3} bg="gray.700">
          <Stack space={2}>
            <Heading size="md" ml="-1" color="white">
              {game.name}
            </Heading>
            <Text
              fontSize="xs"
              fontWeight="500"
              ml="-0.5"
              mt="-1"
              color={colors.white}>
              {released}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
  },
});

export default memo(GameCard);
