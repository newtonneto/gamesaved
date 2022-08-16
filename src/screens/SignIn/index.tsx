import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { FormControl, Heading, Icon, IconButton, useTheme } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Eye, EyeClosed, Key } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Input from '@components/Input';
import Button from '@components/Button';
import TextButton from '@components/TextButton';
import Logo from '@components/Logo';
import ScrollView from '@components/ScrollView';
import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  INPUT_ICON_LEFT_MARGIN,
} from '@styles/sizes';
import firebaseExceptions from '@utils/firebaseExceptions';

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
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await auth().signInWithEmailAndPassword(data.email, data.password);
    } catch (err: any) {
      Alert.alert(
        '>.<',
        firebaseExceptions[err.code] || 'Não foi possível acessar',
        [
          {
            text: 'Ok',
          },
        ],
      );
    } finally {
      isMounted.current && setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <VStack px={AXIS_X_PADDING_CONTENT}>
        <ScrollView pt={8}>
          <Logo />
          <Heading fontFamily="heading" fontSize="6xl" color="secondary.700">
            GAMESAVED
          </Heading>

          <FormControl
            isRequired
            isInvalid={'email' in errors}
            mb={NO_LABEL_INPUT_MARGIN_BOTTOM}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  InputLeftElement={
                    <Icon
                      as={<Envelope color={colors.gray[300]} />}
                      ml={INPUT_ICON_LEFT_MARGIN}
                    />
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
          <FormControl
            isRequired
            isInvalid={'password' in errors}
            mb={NO_LABEL_INPUT_MARGIN_BOTTOM}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  InputLeftElement={
                    <Icon
                      as={<Key color={colors.gray[300]} />}
                      ml={INPUT_ICON_LEFT_MARGIN}
                    />
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
            title="Start"
            w="full"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
          <TextButton
            title="Novo save"
            w="full"
            onPress={() => navigation.navigate('signup')}
            disabled={isLoading}
          />
          <TextButton
            title="Restaurar save"
            w="full"
            onPress={() => navigation.navigate('forgotpassword')}
            disabled={isLoading}
          />
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default SignIn;
