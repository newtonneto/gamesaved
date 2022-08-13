import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../../screens/Home';
import GameDetails from '../../screens/GameDetails';

const { Navigator, Screen } = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen
        name="game"
        component={GameDetails}
        options={{ headerShown: false }}
      />
    </Navigator>
  );
};

export default HomeStack;
