import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Guild from '@screens/Guild';
import CreateGuild from '@screens/CreateGuild';

const { Navigator, Screen } = createNativeStackNavigator();

const GuildStack = () => {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GuildScreen">
      <Screen name="GuildScreen" component={Guild} />
      <Screen name="CreateGuild" component={CreateGuild} />
    </Navigator>
  );
};

export default GuildStack;