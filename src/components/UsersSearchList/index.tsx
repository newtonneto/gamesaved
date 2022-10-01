import React from 'react';
import { Alert, ListRenderItem, StyleSheet } from 'react-native';
import { useToast } from 'native-base';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import Toast from '@components/Toast';
import UserCard from '@components/UserCard';
import HiddenButton from '@components/HiddenButton';
import { FlatListSeparator } from '@components/FlatListComponents';
import { ProfileDto } from '@interfaces/profile.dto';
import { PartyDto } from '@interfaces/party.dto';
import { TOAST_DURATION, VERTICAL_PADDING_LISTS } from '@utils/constants';

type Props = {
  partyRef: React.MutableRefObject<
    FirebaseFirestoreTypes.DocumentReference<PartyDto>
  >;
  members: string[];
  users: ProfileDto[];
  flatListHeader: () => JSX.Element;
};

const UsersSearchList = ({
  partyRef,
  members,
  users,
  flatListHeader,
}: Props) => {
  const toast = useToast();

  const RenderItem: ListRenderItem<ProfileDto> = ({ item }) => (
    <UserCard profile={item} key={item.uuid} />
  );

  const handleInvite = async (usersIndex: string, rowMap: RowMap<number>) => {
    toast.show({
      duration: TOAST_DURATION,
      render: () => {
        return (
          <Toast
            status="warning"
            title="GameSaved"
            description="Inviting member to party"
            textColor="darkText"
          />
        );
      },
    });

    try {
      await partyRef.current.update({
        members: firestore.FieldValue.arrayUnion(usersIndex),
      });

      rowMap[usersIndex].closeRow();
      toast.show({
        duration: TOAST_DURATION,
        render: () => {
          return (
            <Toast
              status="success"
              title="GameSaved"
              description="Member joined to the party"
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

  const handleBan = async (usersIndex: string, rowMap: RowMap<number>) => {
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
        members: firestore.FieldValue.arrayRemove(usersIndex),
      });

      rowMap[usersIndex].closeRow();
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

  const verifyJoinedMembers = (uuid: string) => {
    return members.includes(uuid);
  };

  return (
    <SwipeListView
      data={users}
      renderItem={RenderItem}
      keyExtractor={(item: ProfileDto) => item.uuid}
      ListHeaderComponent={flatListHeader}
      style={styles.flatList}
      ItemSeparatorComponent={FlatListSeparator}
      contentContainerStyle={styles.flatListContent}
      showsVerticalScrollIndicator={false}
      renderHiddenItem={(rowData, rowMap) => (
        <HiddenButton
          handler={
            verifyJoinedMembers(rowData.item.uuid) ? handleBan : handleInvite
          }
          id={rowData.item.uuid}
          rowMap={rowMap}
          type={
            verifyJoinedMembers(rowData.item.uuid)
              ? 'remove_friend'
              : 'add_friend'
          }
        />
      )}
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

export default UsersSearchList;
