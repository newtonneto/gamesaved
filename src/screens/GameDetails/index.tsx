import React, { useState, useEffect } from 'react';
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
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import RenderHtml from 'react-native-render-html';
import { FloppyDisk } from 'phosphor-react-native';

import ScrollView from '@components/ScrollView';
import Header from '@components/Header';
import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import Loading from '@components/Loading';
import { Game } from '@interfaces/game.dto';
import { Inventory } from '@interfaces/inventory.dto';
import rawg from '@services/rawg.api';
import { useAppDispatch } from '@src/store';
import { setDrawerHeader } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  GENERIC_TITTLE,
  AXIS_Y_PADDING_CONTENT,
  RATIO,
} from '@styles/sizes';
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
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;

  useEffect(() => {
    const getGame = async () => {
      try {
        const response = await rawg.get<Game>(`games/${id}?key=${GAMEAPI_KEY}`);

        setGame(response.data);
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

    getGame();

    return () => {
      dispatch(setDrawerHeader(true));
    };
  }, [dispatch, id]);

  const addToInventory = async () => {
    let inventory: number[] = [];

    try {
      const response = await firestore()
        .collection<Inventory>('lists')
        .doc(userSession.uid)
        .get();

      if (response.data()?.games) {
        inventory = response.data()!.games;
        inventory.push(game.id);
      } else {
        inventory.push(game.id);
      }

      await firestore()
        .collection<Inventory>('lists')
        .doc(userSession.uid)
        .update({ games: inventory });
      toast.show({
        description: "Isn't available right now",
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
        <Fab
          placement="bottom-right"
          renderInPortal={false}
          shadow={2}
          size="sm"
          bg="secondary.700"
          icon={
            <FloppyDisk color={colors.white} style={styles.icon} size={18} />
          }
          label="Save Game"
          onPress={() => addToInventory()}
          _pressed={{ bg: 'gray.500' }}
        />
        {!isLoading ? (
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
