import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

import ScrollView from '../../components/ScrollView';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import VStack from '../../components/VStack';
import { useAppDispatch } from '../../store';
import { setDrawerHeader } from '../../store/slices/navigation-slice';

type Props = {
  id: number;
  slug: string;
  name: string;
};

const Game = ({ id, slug, name }: Props) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log(id, slug, name);

    return () => {
      dispatch(setDrawerHeader(true));
    };
  }, [dispatch]);

  return (
    <ScreenWrapper>
      <VStack>
        <Header title={name} />
        <ScrollView>
          <Text>{id}</Text>
          <Text>{slug}</Text>
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default Game;
