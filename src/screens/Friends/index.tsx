import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';

const Friends = () => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Party'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  return <Text>Friends</Text>;
};

export default Friends;
