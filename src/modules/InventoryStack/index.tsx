import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inventory from '@screens/Inventory';
import GameDetails from '@screens/GameDetails';

const { Navigator, Screen } = createNativeStackNavigator();

const InventoryStack = () => {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="InventoryScreen">
      <Screen
        name="InventoryScreen"
        component={Inventory}
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

export default InventoryStack;
