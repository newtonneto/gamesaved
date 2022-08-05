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

import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import ScrollView from '../../components/ScrollView';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import VStack from '../../components/VStack';
import firebaseExceptions from '../../maps/firebaseExceptions';
import { handleDateMask, handlePhoneMask } from '../../utils/inputMasks';

type FormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

const schema = yup
  .object()
  .shape({
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
      .matches(/^[0-9]+$/, 'Apenas números')
      .test(
        'len',
        'Telefone deve conter 11 dígitos',
        (value: string | undefined): boolean => value?.toString().length === 11,
      ),
  })

  .required();
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
    firstName: string,
    lastName: string,
    birthDate: string,
    gender: string,
    email: string,
    phone: string,
  ) => {
    try {
      return firestore()
        .collection('profiles')
        .doc(uid)
        .set({ firstName, lastName, birthDate, gender, email, phone });
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
        data.firstName,
        data.lastName,
        data.birthDate,
        data.gender,
        data.email,
        data.phone,
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
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <VStack>
        <Header title="Cadastro" />
        <ScrollView>
          <FormControl isRequired isInvalid={'firstName' in errors} mb={3}>
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
                />
              )}
              name="firstName"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.firstName?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'lastName' in errors} mb={3}>
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
                />
              )}
              name="lastName"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.lastName?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'birthDate' in errors} mb={3}>
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
                />
              )}
              name="birthDate"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.birthDate?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'gender' in errors} mb={3}>
            <FormControl.Label>Gênero</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  selectedValue={value}
                  accessibilityLabel="Choose gender"
                  placeholder="Selecionar..."
                  onValueChange={onChange}>
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

          <FormControl isRequired isInvalid={'email' in errors} mb={3}>
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
                />
              )}
              name="email"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.email?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'password' in errors} mb={3}>
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
                      mr={4}
                      onPress={() => setIsHidden(!isHidden)}
                    />
                  }
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
            mb={3}>
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
                      mr={4}
                      onPress={() => setIsHidden(!isHidden)}
                    />
                  }
                />
              )}
              name="confirmPassword"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.confirmPassword?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'phone' in errors} mb={8}>
            <FormControl.Label>Telefone</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="84996128883"
                  onChangeText={changedValue =>
                    onChange(handlePhoneMask(changedValue))
                  }
                  value={value}
                  autoComplete="tel-country-code"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  keyboardType="phone-pad"
                  maxLength={16}
                />
              )}
              name="phone"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.phone?.message}
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

export default SignUp;
