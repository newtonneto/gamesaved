import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert } from 'react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

import VStack from '@components/VStack';
import Loading from '@components/Loading';
import LootCard from '@components/LootCard';
import LootButton from '@components/LootButton';
import { FlatListSeparator } from '@components/FlatListComponents';
import { InventoryDto } from '@interfaces/inventory.dto';
import { VERTICAL_PADDING_LISTS } from '@styles/sizes';

const Inventory = () => {
  const isFocused = useIsFocused();
  const [inventory, setInventory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const gamesList = useRef<number[]>([]);
  const nextIndex = useRef<number>(0);
  const inventoryRef = useRef<
    FirebaseFirestoreTypes.DocumentReference<InventoryDto>
  >(firestore().collection<InventoryDto>('lists').doc(userSession.uid));

  const controlPagination = () => {
    if (nextIndex.current !== -1) {
      const endIndex: number = nextIndex.current + 15;

      const nextPage: number[] = gamesList.current.slice(
        nextIndex.current,
        endIndex,
      );
      setInventory(state => {
        return [...state, ...nextPage];
      });

      nextIndex.current = endIndex;

      if (nextIndex.current > gamesList.current.length) {
        nextIndex.current = -1;
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getInventory = async () => {
      gamesList.current = [];
      nextIndex.current = 0;
      isMounted && setInventory([]);
      isMounted && setIsLoading(true);

      try {
        const response = await inventoryRef.current.get();

        if (response.data()?.games.length) {
          gamesList.current = response.data()!.games;

          isMounted && controlPagination();
        }
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
        isMounted && setIsLoading(false);
      }
    };

    getInventory();

    return () => {
      isMounted = false;
    };
  }, [userSession.uid, isFocused]);

  const handleRemove = async (removedLoot: number) => {
    try {
      await inventoryRef.current.update({
        games: firestore.FieldValue.arrayRemove(removedLoot),
      });

      const filteredInventory = inventory.filter(item => item !== removedLoot);
      setInventory(filteredInventory);
    } catch (err) {
      Alert.alert(
        '>.<',
        'Não foi possível remover o jogo especificado, tente novamente mais tarde.',
        [
          {
            text: 'Ok',
          },
        ],
      );
    }
  };

  const RenderItem = ({ item }: { item: number }) => (
    <LootCard id={item} key={item} />
  );

  return (
    <VStack>
      {!isLoading ? (
        <SwipeListView
          data={inventory}
          renderItem={RenderItem}
          onEndReached={controlPagination}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={FlatListSeparator}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          renderHiddenItem={item => (
            <LootButton handleRemove={handleRemove} id={item.item} />
          )}
          rightOpenValue={-75}
          stopRightSwipe={-75}
          stopLeftSwipe={1}
        />
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingVertical: VERTICAL_PADDING_LISTS,
  },
  flatList: {
    width: '100%',
  },
});

export default Inventory;
