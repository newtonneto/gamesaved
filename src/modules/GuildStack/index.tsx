import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Guild from '@screens/Guild';

const { Navigator, Screen } = createNativeStackNavigator();

const GuildStack = () => {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GuildScreen">
      <Screen name="GuildScreen" component={Guild} />
    </Navigator>
  );
};

export default GuildStack;
