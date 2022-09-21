import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import VStack from '@components/VStack';
import Button from '@components/Button';
import FlatList from '@components/FlatList';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import { AXIS_X_PADDING_CONTENT } from '@utils/constants';

const Party = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Party'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const FlatListHeader = () => (
    <Button
      title="Search Friends"
      w="full"
      onPress={() => navigation.navigate('FindFriendsScreen')}
    />
  );

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      <FlatList
        data={members}
        renderItem={() => <></>}
        ListHeaderComponent={FlatListHeader}
      />
    </VStack>
  );
};

export default Party;
