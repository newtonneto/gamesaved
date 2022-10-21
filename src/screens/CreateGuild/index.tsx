import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { FormControl } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useIsFocused } from '@react-navigation/native';

import ScrollView from '@components/ScrollView';
import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import Header from '@components/Header';
import Input from '@components/Input';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import { FORM_INPUT_MARGIN_BOTTOM } from '@utils/constants';

type FormData = {
  name: string;
  description: string;
  warCry: string;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(6, 'Username deve ter no mínimo 2 caracteres'),
  description: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(6, 'Username deve ter no mínimo 2 caracteres'),
  warCry: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(6, 'Username deve ter no mínimo 2 caracteres'),
});

const CreateGuild: React.FC = () => {
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Create Guild'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const onSubmit = (data: FormData) => {
    Alert.alert('Dados enviados', JSON.stringify(data));
  };

  return (
    <ScreenWrapper>
      <VStack px={8}>
        <ScrollView>
          <FormControl
            isRequired
            isInvalid={'name' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Nome</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Devotion"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="name"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.name?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'description' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Descrição</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Guilda de jogadores de Perfect World"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="description"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.description?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={'warCry' in errors}
            mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>Grito de Guerra</FormControl.Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="No limite da devoção"
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                  autoCorrect={false}
                  selectionColor="secondary.700"
                  isDisabled={isLoading}
                  autoCapitalize="words"
                />
              )}
              name="warCry"
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.warCry?.message}
            </FormControl.ErrorMessage>
          </FormControl>
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default CreateGuild;
