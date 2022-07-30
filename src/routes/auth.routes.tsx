import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';

const { Navigator, Screen } = createNativeStackNavigator();

const AuthRoutes = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signin" component={SignIn} />
      <Screen name="signup" component={SignUp} />
    </Navigator>
  );
};

export default AuthRoutes;
