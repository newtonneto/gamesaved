import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Heading, Icon, useTheme } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/imgs/savegame.svg';
import TextButton from '../../components/TextButton';
import firebaseExceptions from '../../maps/firebaseExceptions';
import ScreenWrapper from '../../components/ScreenWrapper';
import VStack from '../../components/VStack';
import ScrollView from '../../components/ScrollView';

const SignIn = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
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

        if (firebaseExceptions[error.code] !== undefined) {
          return Alert.alert('Entrar', firebaseExceptions[error.code]);
        }

        return Alert.alert('Entrar', 'Não foi possível acessar');
      });
  };

  return (
    <ScreenWrapper>
      <VStack>
        <ScrollView pt={24}>
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
            mb={4}
            InputLeftElement={
              <Icon as={<Key color={colors.gray[300]} />} ml={4} />
            }
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
          <TextButton
            title="Registrar-se"
            w="full"
            onPress={() => navigation.navigate('signup')}
            disabled={isLoading}
          />
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default SignIn;
