import React, { useEffect, useState, useRef } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import VStack from '@components/VStack';
import Button from '@components/Button';
import Loading from '@components/Loading';
import { PartyDto } from '@interfaces/party.dto';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
} from '@utils/constants';
import PartyList from '@src/components/PartyList';

const Party = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<string[]>([]);
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

    setIsLoading(false);

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

  return (
    <VStack>
      {!isLoading ? (
        <PartyList
          partyRef={partyRef}
          members={members}
          flatListHeader={FlatListHeader}
        />
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

export default Party;
