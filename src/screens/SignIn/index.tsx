import React, { useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from 'phosphor-react-native';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/imgs/savegame.svg';

const SignIn = () => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignIn = (): void => {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe e-mail e senha');
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        console.log(response);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'E-mail inválido');
        }

        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.');
        }

        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.');
        }

        return Alert.alert('Entrar', 'Não foi possível acessar');
      });
  };

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo width={200} height={200} />
      <Heading fontFamily="heading" fontSize="6xl" color="secondary.700">
        GAMESAVED
      </Heading>

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
        isDisabled={isLoading}
        autoCapitalize="none"
      />
      <Input
        placeholder="Senha"
        mb={8}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
        isDisabled={isLoading}
        autoCapitalize="none"
      />
      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
};

export default SignIn;
