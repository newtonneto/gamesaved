import React, { useState, useRef } from 'react';
import { FormControl, Heading, Icon, IconButton, useTheme } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Eye, EyeClosed, Key } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Logo from '../../assets/imgs/savegame.svg';
import TextButton from '../../components/TextButton';
import firebaseExceptions from '../../maps/firebaseExceptions';
import ScreenWrapper from '../../components/ScreenWrapper';
import VStack from '../../components/VStack';
import ScrollView from '../../components/ScrollView';
import AlertDialog from '../../components/AlertDialog';

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Prenchimento obrigatorio')
    .email('Email inválido'),
  password: yup.string().required('Prenchimento obrigatorio'),
});

const SignIn = () => {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const cancelRef = useRef(null);
  const alertMessage = useRef<string>('alertMessage');
  const alertTitle = useRef<string>('alertTitle');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then(response => {
          console.log(response);
          setIsLoading(false);
        });
    } catch (err: any) {
      alertTitle.current = ':(';
      alertMessage.current =
        firebaseExceptions[err.code] || 'Não foi possível acessar';
      setIsAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlertDialog = () => {
    setIsAlertOpen(!isAlertOpen);
  };

  return (
    <ScreenWrapper>
      <VStack>
        <AlertDialog
          isOpen={isAlertOpen}
          onClose={handleCloseAlertDialog}
          cancelRef={cancelRef}
          title={alertTitle.current}
          message={alertMessage.current}
        />
        <ScrollView pt={24}>
          <Logo width={200} height={200} />
          <Heading fontFamily="heading" fontSize="6xl" color="secondary.700">
            GAMESAVED
          </Heading>

          <FormControl isRequired isInvalid={'email' in errors} mb={4}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  InputLeftElement={
                    <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
                  }
                  onChangeText={onChange}
                  value={value}
                  isDisabled={isLoading}
                  autoComplete="email"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
              name="email"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.email?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={'password' in errors} mb={4}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  InputLeftElement={
                    <Icon as={<Key color={colors.gray[300]} />} ml={4} />
                  }
                  InputRightElement={
                    <IconButton
                      _icon={{
                        as: () =>
                          isHidden ? (
                            <EyeClosed color={colors.secondary[700]} />
                          ) : (
                            <Eye color={colors.secondary[700]} />
                          ),
                      }}
                      mr={4}
                      onPress={() => setIsHidden(!isHidden)}
                    />
                  }
                  secureTextEntry={isHidden}
                  onChangeText={onChange}
                  value={value}
                  isDisabled={isLoading}
                  autoCapitalize="none"
                />
              )}
              name="password"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            title="Entrar"
            w="full"
            onPress={handleSubmit(onSubmit)}
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
