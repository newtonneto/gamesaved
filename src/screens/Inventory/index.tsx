import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert, ListRenderItem } from 'react-native';
import { useToast } from 'native-base';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';

import Toast from '@components/Toast';
import VStack from '@components/VStack';
import Loading from '@components/Loading';
import LootCard from '@components/LootCard';
import HiddenButton from '@components/HiddenButton';
import { FlatListSeparator } from '@components/FlatListComponents';
import { InventoryDto } from '@interfaces/inventory.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import { VERTICAL_PADDING_LISTS, TOAST_DURATION } from '@utils/constants';

const Inventory = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [inventory, setInventory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const gamesList = useRef<number[]>([]);
  const nextIndex = useRef<number>(0);
  const inventoryRef = useRef<
    FirebaseFirestoreTypes.DocumentReference<InventoryDto>
  >(firestore().collection<InventoryDto>('lists').doc(userSession.uid));

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Inventory'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

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

  const handleRemove = async (removedLoot: number, rowMap: RowMap<number>) => {
    toast.show({
      duration: TOAST_DURATION,
      render: () => {
        return (
          <Toast
            status="success"
            title="GameSaved"
            description="Removing game, please dont turn off your phone"
            textColor="darkText"
          />
        );
      },
    });

    try {
      await inventoryRef.current.update({
        games: firestore.FieldValue.arrayRemove(removedLoot),
      });

      rowMap[removedLoot].closeRow();
      const filteredInventory = inventory.filter(item => item !== removedLoot);
      setInventory(filteredInventory);
      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="success"
              title="GameSaved"
              description="Game Removed"
              textColor="darkText"
            />
          );
        },
      });
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

  const RenderItem: ListRenderItem<number> = ({ item }) => (
    <LootCard id={item} key={item} />
  );

  return (
    <VStack>
      {!isLoading ? (
        <SwipeListView
          data={inventory}
          renderItem={RenderItem}
          keyExtractor={(item: number) => item.toString()}
          onEndReached={controlPagination}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={FlatListSeparator}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          renderHiddenItem={(rowData, rowMap) => (
            <HiddenButton
              handler={handleRemove}
              id={rowData.item}
              rowMap={rowMap}
              type="remove_loot"
            />
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
