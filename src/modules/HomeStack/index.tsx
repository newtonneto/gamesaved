import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '@screens/Home';
import GameDetails from '@screens/GameDetails';

const { Navigator, Screen } = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen">
      <Screen
        name="HomeScreen"
        component={Home}
        options={{ headerShown: false }}
      />
      <Screen
        name="GameScreen"
        component={GameDetails}
        options={{ headerShown: false }}
      />
    </Navigator>
  );
};

export default HomeStack;
