import React, { MutableRefObject } from 'react';
import { ListRenderItem, StyleSheet, Alert } from 'react-native';
import { Heading, useToast } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import Void from '@assets/imgs/undraw_void.svg';
import Toast from '@components/Toast';
import VStack from '@components/VStack';
import MemberCard from '@components/MemberCard';
import HiddenButton from '@components/HiddenButton';
import { FlatListSeparator } from '@components/FlatListComponents';
import { PartyDto } from '@interfaces/party.dto';
import {
  AXIS_X_PADDING_CONTENT,
  VERTICAL_PADDING_LISTS,
  TOAST_DURATION,
} from '@utils/constants';

type Props = {
  partyRef: MutableRefObject<
    FirebaseFirestoreTypes.DocumentReference<PartyDto>
  >;
  members: string[];
  flatListHeader: () => JSX.Element;
};

const PartyList = ({ partyRef, members, flatListHeader }: Props) => {
  const toast = useToast();

  const RenderItem: ListRenderItem<string> = ({ item }) => (
    <MemberCard uuid={item} key={item} />
  );

  const handleBan = async (usersUuid: string) => {
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

  const RenderEmpty = () => (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      <Void width={150} height={150} />
      <Heading fontFamily="heading" color="secondary.700" textAlign="center">
        GO AHEAD AND INVITE SOME FRIENDS!
      </Heading>
    </VStack>
  );

  return (
    <SwipeListView
      data={members}
      renderItem={RenderItem}
      keyExtractor={(item: string) => item}
      ListHeaderComponent={flatListHeader}
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
      ListEmptyComponent={RenderEmpty}
      rightOpenValue={-75}
      stopRightSwipe={-75}
      stopLeftSwipe={1}
    />
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

export default PartyList;
