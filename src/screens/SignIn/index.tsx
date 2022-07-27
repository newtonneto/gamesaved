import React, { useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Heading, Text, Icon, useTheme } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from 'phosphor-react-native';

import { SafeAreaView } from '../../styles/styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
    <SafeAreaView>
      <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
        <Heading color="secondary.700">GameSaved</Heading>
        <Text
          fontSize="4xl"
          color="secondary.700"
          fontFamily="body"
          fontWeight={600}
          fontStyle="italic">
          "aghsyagsyagsa"
        </Text>
        <Heading fontFamily="heading" fontSize="6xl" color="secondary.700">
          GAMESAVED
        </Heading>
        <Text fontFamily="body" fontWeight={600} fontStyle="italic">
          Teste
        </Text>

        <Input
          placeholder="E-mail"
          mb={4}
          InputLeftElement={
            <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
          }
          onChangeText={setEmail}
          isDisabled={isLoading}
        />
        <Input
          placeholder="Senha"
          mb={8}
          InputLeftElement={
            <Icon as={<Key color={colors.gray[300]} />} ml={4} />
          }
          secureTextEntry
          onChangeText={setPassword}
          isDisabled={isLoading}
        />
        <Button
          title="Entrar"
          w="full"
          onPress={handleSignIn}
          isLoading={isLoading}
        />
      </VStack>
    </SafeAreaView>
  );
};

export default SignIn;
