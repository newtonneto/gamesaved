import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions, Alert } from 'react-native';
import {
  AspectRatio,
  VStack as NativeBaseVStack,
  Text,
  HStack,
  Fab,
  useToast,
  useTheme,
  Heading,
} from 'native-base';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import RenderHtml from 'react-native-render-html';
import { FloppyDisk } from 'phosphor-react-native';

import ScrollView from '@components/ScrollView';
import Header from '@components/Header';
import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import Toast from '@components/Toast';
import Loading from '@components/Loading';
import { Game } from '@interfaces/game.dto';
import { InventoryDto } from '@interfaces/inventory.dto';
import rawg from '@services/rawg.api';
import { useAppDispatch } from '@src/store';
import { setDrawerHeader } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  GENERIC_TITTLE,
  AXIS_Y_PADDING_CONTENT,
  RATIO,
  TOAST_DURATION,
} from '@utils/constants';
import firebaseExceptions from '@utils/firebaseExceptions';
import { GAMEAPI_KEY } from 'react-native-dotenv';

type RouteParams = {
  id: number;
  slug: string;
  name: string;
};

const GameDetails = () => {
  const toast = useToast();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { id, name } = route.params as RouteParams;
  const { width } = useWindowDimensions();
  const [game, setGame] = useState<Game>({} as Game);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const inventoryRef = useRef<
    FirebaseFirestoreTypes.DocumentReference<InventoryDto>
  >(firestore().collection<InventoryDto>('lists').doc(userSession.uid));

  useEffect(() => {
    const getGame = async () => {
      try {
        const response = await rawg.get<Game>(`games/${id}?key=${GAMEAPI_KEY}`);

        setGame(response.data);
      } catch (err: any) {
        throw new Error(err);
      }
    };

    const getInventory = async () => {
      try {
        const response = await inventoryRef.current.get();
        const saved = response.data()?.games.indexOf(id);

        saved !== -1 && setIsSaved(true);
      } catch (err: any) {
        throw new Error(err);
      }
    };

    const initialize = async () => {
      try {
        await getGame();
        await getInventory();
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

    initialize();

    return () => {
      dispatch(setDrawerHeader(true));
    };
  }, [dispatch, id, userSession.uid]);

  const firestoreUpdate = async (gameId: number) => {
    isSaved
      ? await inventoryRef.current.update({
          games: firestore.FieldValue.arrayRemove(gameId),
        })
      : await inventoryRef.current.update({
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
    <ScreenWrapper>
      <VStack>
        <Header title={name} />
        {!isLoading ? (
          <>
            <Fab
              placement="bottom-right"
              renderInPortal={false}
              shadow={2}
              size="sm"
              bg={isSaved ? 'gray.700' : 'secondary.700'}
              icon={
                <FloppyDisk
                  color={colors.white}
                  style={styles.icon}
                  size={18}
                />
              }
              label={isSaved ? 'Remove Game' : 'Save Game'}
              onPress={() => handleInventory()}
              _pressed={{ bg: 'gray.500' }}
            />
            <ScrollView>
              <AspectRatio w="100%" ratio={RATIO}>
                <FastImage
                  source={{
                    uri: game.background_image,
                  }}
                />
              </AspectRatio>
              <VStack px={AXIS_X_PADDING_CONTENT} mt={AXIS_Y_PADDING_CONTENT}>
                <NativeBaseVStack w={width - 64}>
                  <Heading
                    fontFamily="heading"
                    color={colors.white}
                    fontSize={GENERIC_TITTLE}>
                    {game.name.toUpperCase()}
                  </Heading>
                  <HStack>
                    <Text color={colors.white} fontWeight="700">
                      Lançamento:{' '}
                    </Text>
                    <Text color={colors.white}>{game.released}</Text>
                  </HStack>
                  <HStack>
                    <Text color={colors.white} fontWeight="700">
                      Metacritic:{' '}
                    </Text>
                    <Text color={colors.white}>{game.metacritic}</Text>
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
          </>
        ) : (
          <Loading />
        )}
      </VStack>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
  },
});

export default GameDetails;
