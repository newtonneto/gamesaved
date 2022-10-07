import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Party from '@screens/Party';
import FindFriends from '@screens/FindFriends';
import UserStats from '@screens/UserStats';

const { Navigator, Screen } = createNativeStackNavigator();

const PartyStack = () => {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen">
      <Screen name="PartyScreen" component={Party} />
      <Screen name="FindFriendsScreen" component={FindFriends} />
      <Screen name="UserStats" component={UserStats} />
    </Navigator>
  );
};

export default PartyStack;
