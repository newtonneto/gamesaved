import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  FormControl,
  IconButton,
  Select as NativeBaseSelect,
  useTheme,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeClosed } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import Input from '@components/Input';
import Button from '@components/Button';
import Select from '@components/Select';
import ScrollView from '@components/ScrollView';
import Header from '@components/Header';
import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import firebaseExceptions from '@hashmaps/firebaseExceptions';
import { FORM_INPUT_MARGIN_BOTTOM } from '@utils/constants';
import { handleDateMask, handlePhoneMask } from '@utils/inputMasks';

type FormData = {
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  psnId: string;
  xboxGamertag: string;
  nintendoAccount: string;
  steamProfile: string;
};

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(6, 'Username deve ter no mínimo 2 caracteres'),
  firstName: yup
    .string()
    .required('Prenchimento obrigatorio')
    .matches(/^[aA-zZ\s]+$/, 'Apenas letras')
    .min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: yup
    .string()
    .required('Prenchimento obrigatorio')
    .matches(/^[aA-zZ\s]+$/, 'Apenas letras')
    .min(2, 'Nome deve ter no mínimo 2 caracteres'),
  birthDate: yup
    .string()
    .required('Prenchimento obrigatorio')
    .test(
      'len',
      'Data de Nascimento deve seguir o formato DD/MM/AAAA',
      (value: string | undefined): boolean => value?.toString().length === 10,
    ),
  gender: yup.string().required('Prenchimento obrigatorio'),
  email: yup
    .string()
    .required('Prenchimento obrigatorio')
    .email('Email inválido'),
  password: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(8, 'Senha deve ter no mínimo 8 dígitos')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'A senha deve contem ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    ),
  confirmPassword: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(8, 'Confirmação de senha deve ter no mínimo 8 dígitos')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'A senha deve contem ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    )
    .oneOf([yup.ref('password')], 'As senhas informadas são divergentes'),
  phone: yup
    .string()
    .required('Prenchimento obrigatorio')
    .test(
      'len',
      'Telefone deve conter 11 dígitos',
      (value: string | undefined): boolean => value?.toString().length === 15,
    ),
  psnId: yup
    .string()
    .test(
      'len',
      'PSN ID deve ter no mínimo 3 caracteres',
      (value: string | undefined): boolean =>
        value === undefined || value === '' ? true : value.length >= 3,
    )
    .max(16, 'PSN ID deve ter no máximo 16 caracteres'),
  xboxGamertag: yup
    .string()
    .test(
      'len',
      'Xbox Gamertag deve ter no mínimo 3 caracteres',
      (value: string | undefined): boolean =>
        value === undefined || value === '' ? true : value.length >= 3,
    )
    .max(12, 'Xbox Gamertag deve ter no máximo 12 caracteres'),
  nintendoAccount: yup
    .string()
    .test(
      'len',
      'Nintendo Account deve ter no mínimo 6 caracteres',
      (value: string | undefined): boolean =>
        value === undefined || value === '' ? true : value.length >= 6,
    )
    .max(10, 'Nintendo Account deve ter no máximo 10 caracteres'),
  steamProfile: yup
    .string()
    .test(
      'len',
      'Steam Profile deve ter no mínimo 2 caracteres',
      (value: string | undefined): boolean =>
        value === undefined || value === '' ? true : value.length >= 2,
    )
    .max(32, 'Steam Profile deve ter no máximo 32 caracteres'),
});

const SignUp = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(true);

  const createUser = async (email: string, password: string) => {
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await auth().currentUser?.sendEmailVerification();

      return response;
    } catch (err: any) {
      throw new Error(err.code);
    }
  };

  const createProfile = async (
    uid: string,
    username: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    gender: string,
    email: string,
    phone: string,
    psnId: string,
    xboxGamertag: string,
    nintendoAccount: string,
    steamProfile: string,
  ) => {
    try {
      await firestore().collection('profiles').doc(uid).set({
        uuid: uid,
        username,
        firstName,
        lastName,
        birthDate,
        gender,
        email,
        phone,
        psnId,
        xboxGamertag,
        nintendoAccount,
        steamProfile,
        guild: '',
      });

      await firestore().collection('lists').doc(uid).set({ games: [] });
      await firestore().collection('parties').doc(uid).set({ members: [] });
      await auth().signOut();
    } catch (err: any) {
      throw new Error(err.code);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await createUser(data.email, data.password);
      await createProfile(
        response.user.uid,
        data.username,
        data.firstName,
        data.lastName,
        data.birthDate,
        data.gender,
        data.email,
        data.phone,
        data.psnId,
        data.xboxGamertag,
        data.nintendoAccount,
        data.steamProfile,
      );

      Alert.alert(
        ':D',
        'Cadastro realizado com sucesso, em poucos segundos você recebera um email de confirmação no endereço de email cadastrado',
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
        firebaseExceptions[err.code] || 'Não foi possível criar seu usuário',
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
      <VStack px={8}>
        <Header title="Cadastro" />
        <ScrollView>
          <FormControl
            isRequired
            isInvalid={'username' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Username</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="XCloud"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="username"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.username?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'firstName' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Nome</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Cloud"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="firstName"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.firstName?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'lastName' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Sobrenome</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Strife"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="lastName"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.lastName?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'birthDate' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Data de nascimento</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="11/08/1986"
                  onChangeText={changedValue =>
                    onChange(handleDateMask(changedValue))
                  }
                  value={value}
                  autoComplete="birthdate-full"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  keyboardType="number-pad"
                  maxLength={10}
                  isDisabled={isLoading}
                />
              )}
              name="birthDate"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.birthDate?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'gender' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Gênero</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  selectedValue={value}
                  accessibilityLabel="Choose gender"
                  placeholder="Selecionar..."
                  onValueChange={onChange}
                  isDisabled={isLoading}>
                  <NativeBaseSelect.Item label="Masculino" value="male" />
                  <NativeBaseSelect.Item label="Feminino" value="female" />
                  <NativeBaseSelect.Item label="Outro" value="other" />
                </Select>
              )}
              name="gender"
              defaultValue="other"
            />
            <FormControl.ErrorMessage>
              {errors.gender?.message}
            </FormControl.ErrorMessage>
          </FormControl>

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

          <FormControl
            isRequired
            isInvalid={'password' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Senha</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="!1#Class"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={isHidden}
                  autoComplete="password"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  autoCapitalize="none"
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
                      onPress={() => setIsHidden(!isHidden)}
                    />
                  }
                  isDisabled={isLoading}
                />
              )}
              name="password"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'confirmPassword' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Confirmação de senha</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="!1#Class"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={isHidden}
                  autoComplete="password"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  autoCapitalize="none"
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
                      onPress={() => setIsHidden(!isHidden)}
                    />
                  }
                  isDisabled={isLoading}
                />
              )}
              name="confirmPassword"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.confirmPassword?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'phone' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Telefone</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="(84) 9 9612-8883"
                  onChangeText={changedValue =>
                    onChange(handlePhoneMask(changedValue))
                  }
                  value={value}
                  autoComplete="tel-country-code"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  keyboardType="phone-pad"
                  maxLength={15}
                  isDisabled={isLoading}
                />
              )}
              name="phone"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.phone?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={'psnId' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>PSN ID</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="CloudAvalanchePS"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="psnId"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.psnId?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={'xboxGamertag' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Xbox Gamertag</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="XCloudAvalanche"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="xboxGamertag"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.xboxGamertag?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={'nintendoAccount' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Nintendo Account</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="RedCloud"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="nintendoAccount"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.nintendoAccount?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={'steamProfile' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Steam Profile</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Cloud_Ex-Soldier"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="steamProfile"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.steamProfile?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button
            title="Enviar"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            w="full"
          />
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default SignUp;
