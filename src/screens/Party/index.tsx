import React, { useEffect, useState, useRef } from 'react';
import { ListRenderItem, StyleSheet, Alert } from 'react-native';
import { useToast } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Toast from '@components/Toast';
import VStack from '@components/VStack';
import Button from '@components/Button';
import MemberCard from '@components/MemberCard';
import HiddenButton from '@components/HiddenButton';
import { FlatListSeparator } from '@components/FlatListComponents';
import { PartyDto } from '@interfaces/party.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  VERTICAL_PADDING_LISTS,
  TOAST_DURATION,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
} from '@utils/constants';

const Party = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [members, setMembers] = useState<String[]>([]);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const partyRef = useRef<FirebaseFirestoreTypes.DocumentReference<PartyDto>>(
    firestore().collection<PartyDto>('parties').doc(userSession.uid),
  );

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Party'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    const subscriber = partyRef.current.onSnapshot(snapshot => {
      const list: string[] = snapshot.get('members');

      setMembers(list);
    });

    return subscriber;
  }, []);

  const FlatListHeader = () => (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      <Button
        title="Search Friends"
        w="full"
        onPress={() => navigation.navigate('FindFriendsScreen')}
        mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
      />
    </VStack>
  );

  const RenderItem: ListRenderItem<string> = ({ item }) => (
    <MemberCard uuid={item} key={item} />
  );

  const handleBan = async (usersUuid: string, rowMap: RowMap<number>) => {
    toast.show({
      duration: TOAST_DURATION,
      render: () => {
        return (
          <Toast
            status="warning"
            title="GameSaved"
            description="Banning party member"
            textColor="darkText"
          />
        );
      },
    });

    try {
      await partyRef.current.update({
        members: firestore.FieldValue.arrayRemove(usersUuid),
      });

      // rowMap[usersUuid].closeRow();
      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="success"
              title="GameSaved"
              description="Member banned to the party"
              textColor="darkText"
            />
          );
        },
      });
    } catch (err) {
      Alert.alert(
        '>.<',
        'Não foi possível concluir a operação, tente novamente mais tarde.',
        [
          {
            text: 'Ok',
          },
        ],
      );
    }
  };

  return (
    <VStack>
      <SwipeListView
        data={members}
        renderItem={RenderItem}
        keyExtractor={(item: string) => item}
        ListHeaderComponent={FlatListHeader}
        style={styles.flatList}
        ItemSeparatorComponent={FlatListSeparator}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        renderHiddenItem={(rowData, rowMap) => (
          <HiddenButton
            handler={handleBan}
            id={rowData.item}
            rowMap={rowMap}
            type={'remove_friend'}
          />
        )}
        rightOpenValue={-75}
        stopRightSwipe={-75}
        stopLeftSwipe={1}
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
  },
  flatListContent: {
    paddingVertical: VERTICAL_PADDING_LISTS,
  },
});

export default Party;
