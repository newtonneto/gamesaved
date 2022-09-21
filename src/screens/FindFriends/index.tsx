import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

import VStack from '@components/VStack';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import { AXIS_X_PADDING_CONTENT } from '@utils/constants';

const FindFriends = () => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Find Friends'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      <></>
    </VStack>
  );
};

export default FindFriends;
