import React, { useState, useEffect } from 'react';
import { Avatar, Text } from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';

import VStack from '@components/VStack';
import ScrollView from '@components/ScrollView';
import Loading from '@components/Loading';
import { AXIS_X_PADDING_CONTENT } from '@utils/constants';

const UserStats = () => {
  const route = useRoute();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      {!isLoading ? (
        <ScrollView pt={8}>
          <Text>user stats</Text>
        </ScrollView>
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

export default UserStats;
