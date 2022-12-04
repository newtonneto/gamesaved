import React, { memo, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  AspectRatio,
  Box,
  Center,
  Heading,
  HStack,
  Stack,
  Text,
  useTheme,
  Pressable,
  IconButton,
  useToast,
} from 'native-base';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

import { FloppyDiskStyled, StarStyled } from './styles';
import Toast from '@components/Toast';
import firebaseExceptions from '@hashmaps/firebaseExceptions';
import { Game } from '@interfaces/game.dto';
import { InventoryDto } from '@interfaces/inventory.dto';
import { formatDate } from '@utils/formatDate';
import { CARDS_BORDER_WIDTH, RATIO, TOAST_DURATION } from '@utils/constants';

type Props = {
  game: Game;
  inventory: number[];
  setInventory: Function;
  inventoryRef: FirebaseFirestoreTypes.DocumentReference<InventoryDto>;
};

const GameCard = ({ game, inventory, inventoryRef }: Props) => {
  const toast = useToast();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const released = formatDate(game.released);

  useEffect(() => {
    const checkIsSaved = () => {
      const saved = inventory.indexOf(game.id);

      setIsSaved(saved !== -1 ? true : false);
    };

    checkIsSaved();
  }, [game.id, inventory]);

  const handleNavigation = () => {
    navigation.navigate('GameScreen', {
      id: game.id,
      slug: game.slug,
      name: game.name,
    });
  };

  const firestoreUpdate = async (gameId: number) => {
    isSaved
      ? await inventoryRef.update({
          games: firestore.FieldValue.arrayRemove(gameId),
        })
      : await inventoryRef.update({
          games: firestore.FieldValue.arrayUnion(gameId),
        });

    setIsSaved(!isSaved);
  };

  const handleInventory = async () => {
    toast.show({
      duration: TOAST_DURATION,
      render: () => {
        return (
          <Toast
            status="success"
            title="GameSaved"
            description={`${
              isSaved ? 'Removing' : 'Saving'
            } game, please don't turn off your phone`}
            textColor="darkText"
          />
        );
      },
    });

    try {
      await firestoreUpdate(game.id);

      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="success"
              title="GameSaved"
              description={`Game ${isSaved ? 'Removed' : 'Saved'}`}
              textColor="darkText"
            />
          );
        },
      });
    } catch (err: any) {
      Alert.alert(
        '>.<',
        firebaseExceptions[err.code] || 'Não foi possível lootear esse jogo.',
        [
          {
            text: 'Ok',
          },
        ],
      );
    }
  };

  return (
    <Pressable alignItems="center" onPress={handleNavigation}>
      <Box
        w="full"
        rounded="lg"
        overflow="hidden"
        borderColor="secondary.700"
        borderWidth={CARDS_BORDER_WIDTH}>
        <Box>
          <AspectRatio w="100%" ratio={RATIO}>
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
              <StarStyled color={colors.secondary[700]} />
              <Text color={colors.secondary[700]}>{game.metacritic}</Text>
            </HStack>
            <HStack>
              <IconButton
                _icon={{
                  as: (
                    <FloppyDiskStyled
                      color={colors.secondary[700]}
                      weight={isSaved ? 'fill' : 'light'}
                    />
                  ),
                }}
                onPress={handleInventory}
              />
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
    </Pressable>
  );
};

export default memo(GameCard);
