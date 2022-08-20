import React, { useEffect, useState } from 'react';
import { VStack } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Logo from '@components/Logo';
import AuthRoutes from '@routes/auth.routes';
import AppRoutes from '@routes/app.routes';

const Routes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSession, setUserSession] =
    useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(response => {
      setUserSession(response);
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
      {userSession?.emailVerified ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
};

export default Routes;
