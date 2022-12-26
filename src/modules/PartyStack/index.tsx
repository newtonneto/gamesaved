import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Party from '@screens/Party';
import FindFriends from '@screens/FindFriends';
import UserStats from '@screens/UserStats';
import GameDetails from '@screens/GameDetails';

const { Navigator, Screen } = createNativeStackNavigator();

const PartyStack = () => {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen">
      <Screen name="PartyScreen" component={Party} />
      <Screen name="FindFriendsScreen" component={FindFriends} />
      <Screen name="UserStats" component={UserStats} />
      <Screen name="GameScreen" component={GameDetails} />
    </Navigator>
  );
};

export default PartyStack;
