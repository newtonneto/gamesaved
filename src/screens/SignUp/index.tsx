import React, { useState } from 'react';
import { FormControl, Select as NativeBaseSelect } from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useForm, Controller } from 'react-hook-form';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import ScrollView from '../../components/ScrollView';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import VStack from '../../components/VStack';

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

const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const handleSignUp = (): void => {
  //   setIsLoading(true);

  //   auth()
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(response =>
  //       firestore()
  //         .collection('profiles')
  //         .doc(response.user.uid)
  //         .set({
  //           name,
  //           email,
  //           phone,
  //         })
  //         .then(response1 => console.log(response1)),
  //     );

  //   setIsLoading(false);
  // };

  const onSubmit = (data: any) => {
    console.log(data);
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
                />
              )}
              name="firstName"
              rules={{ required: 'Field is required', minLength: 3 }}
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
                />
              )}
              name="lastName"
              rules={{ required: 'Field is required', minLength: 3 }}
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
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="birthDate"
              rules={{ required: 'Field is required', minLength: 3 }}
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
              rules={{ required: 'Field is required', minLength: 3 }}
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
                />
              )}
              name="email"
              rules={{ required: 'Field is required', minLength: 3 }}
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
                  secureTextEntry
                />
              )}
              name="password"
              rules={{ required: 'Field is required', minLength: 3 }}
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
                  secureTextEntry
                />
              )}
              name="confirmPassword"
              rules={{ required: 'Field is required', minLength: 3 }}
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
                  placeholder="+55 (84) 9 9621-3383"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="phone"
              rules={{ required: 'Field is required', minLength: 3 }}
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
          />
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default SignUp;
