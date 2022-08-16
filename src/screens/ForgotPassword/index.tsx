import React, { useState } from 'react';
import { Alert } from 'react-native';
import { FormControl } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

import Header from '@components/Header';
import Input from '@components/Input';
import ScreenWrapper from '@components/ScreenWrapper';
import ScrollView from '@components/ScrollView';
import VStack from '@components/VStack';
import Button from '@components/Button';
import {
  AXIS_X_PADDING_CONTENT,
  FORM_INPUT_MARGIN_BOTTOM,
} from '@styles/sizes';
import firebaseExceptions from '@utils/firebaseExceptions';

type FormData = {
  email: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Prenchimento obrigatorio')
    .email('Email inválido'),
});

const ForgotScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await auth().sendPasswordResetEmail(data.email);

      Alert.alert(
        ':D',
        'O link de redefinição de senha foi enviado para a sua caixa de email, caso não encontre a mesma, verifique sua caixa de spam',
        [
          {
            text: 'Voltar para tela de login',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert(
        '>.<',
        firebaseExceptions[err.code] ||
          'Não foi possível solicitar a redifinição de senha',
        [
          {
            text: 'Voltar para tela de login',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Ok',
          },
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <VStack px={AXIS_X_PADDING_CONTENT}>
        <Header title="Restaurar Save" />
        <ScrollView>
          <FormControl
            isRequired
            isInvalid={'email' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>E-mail</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="cloud.exsoldier@avalanche.com"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="email"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  isDisabled={isLoading}
                />
              )}
              name="email"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.email?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button
            title="Enviar"
            onPress={handleSubmit(onSubmit)}
            colorScheme="pink"
            isLoading={isLoading}
            w="full"
          />
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default ForgotScreen;
