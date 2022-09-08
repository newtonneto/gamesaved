import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

import VStack from '@components/VStack';
import Loading from '@components/Loading';
import LootCard, { RightButton } from '@components/LootCard';
import { FlatListSeparator } from '@components/FlatListComponents';
import { InventoryDto } from '@interfaces/inventory.dto';
import { AXIS_X_PADDING_CONTENT, VERTICAL_PADDING_LISTS } from '@styles/sizes';

const Inventory = () => {
  const isFocused = useIsFocused();
  const [inventory, setInventory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const gamesList = useRef<number[]>([]);
  const nextIndex = useRef<number>(0);

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
    const getInventory = async () => {
      gamesList.current = [];
      nextIndex.current = 0;
      setInventory([]);
      setIsLoading(true);

      try {
        const response = await firestore()
          .collection<InventoryDto>('lists')
          .doc(userSession.uid)
          .get();

        if (response.data()?.games.length) {
          gamesList.current = response.data()!.games;

          controlPagination();
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
        setIsLoading(false);
      }
    };

    getInventory();
  }, [userSession.uid, isFocused]);

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
          renderHiddenItem={() => <RightButton />}
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
