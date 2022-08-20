import React, { useEffect, useState } from 'react';
import { VStack } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Logo from '@components/Logo';
import { useAppDispatch } from '@src/store';
import { setUser } from '@store/slices/user-slice';
import AuthRoutes from '@routes/auth.routes';
import AppRoutes from '@routes/app.routes';

const Routes = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSession, setUserSession] =
    useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(response => {
      setUserSession(response);
      response &&
        dispatch(
          setUser({
            uid: response.uid,
            email: response.email,
            emailVerified: response.emailVerified,
            photoURL: response.photoURL,
          }),
        );
      setIsLoading(false);
    });

    return subscriber;
  }, [dispatch]);

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
