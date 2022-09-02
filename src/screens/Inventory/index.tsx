import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import VStack from '@components/VStack';
import Loading from '@components/Loading';
import LootCard from '@components/LootCard';
import { FlatListSeparator } from '@components/FlatListComponents';
import { InventoryDto } from '@interfaces/inventory.dto';
import { AXIS_X_PADDING_CONTENT, VERTICAL_PADDING_LISTS } from '@styles/sizes';

const Inventory = () => {
  const [inventory, setInventory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const inventoryRef = firestore()
    .collection<InventoryDto>('lists')
    .doc(userSession.uid);

  useEffect(() => {
    const getInventory = async () => {
      try {
        const response = await inventoryRef.get();

        response.data()?.games.length && setInventory(response.data()!.games);
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
  }, []);

  const RenderItem = ({ item }: { item: number }) => (
    <LootCard id={item} key={item} />
  );

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      {!isLoading ? (
        <FlatList
          data={inventory}
          renderItem={RenderItem}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={FlatListSeparator}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
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
