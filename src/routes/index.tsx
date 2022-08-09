import React, { useEffect, useState } from 'react';
import { VStack } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import Logo from '../components/Logo';

const Routes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(response => {
      setUser(response);
      setIsLoading(false);
    });

    return subscriber;
  }, []);

  if (isLoading) {
    return (
      <VStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        bg="gray.600">
        <Logo />
      </VStack>
    );
  }

  return (
    <NavigationContainer>
      {user?.emailVerified ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
};

export default Routes;
