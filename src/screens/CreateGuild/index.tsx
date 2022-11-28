import React, { useEffect, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { Actionsheet, AspectRatio, FormControl, Text } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import ScrollView from '@components/ScrollView';
import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import Input from '@components/Input';
import Button from '@components/Button';
import Header from '@components/Header';
import firebaseExceptions from '@hashmaps/firebaseExceptions';
import { ProfileDto } from '@interfaces/profile.dto';
import { Image } from '@interfaces/image.model';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import {
  AXIS_X_PADDING_CONTENT,
  FORM_INPUT_MARGIN_BOTTOM,
  RATIO,
} from '@utils/constants';
import getImageType from '@utils/getImageType';
import handleRetrieveSingleImage from '@utils/handleRetrieveSingleImage';

type FormData = {
  name: string;
  description: string;
  warCry: string;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(6, 'Nome deve ter no mínimo 6 caracteres'),
  description: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(6, 'Descrição deve ter no mínimo 6 caracteres'),
  warCry: yup
    .string()
    .test(
      'len',
      'Grito de Guerra deve ter no mínimo 2 caracteres',
      (value: string | undefined): boolean =>
        value === undefined || value === '' ? true : value.length >= 2,
    )
    .max(32, 'Grito de Guerra deve ter no máximo 32 caracteres'),
});

const CreateGuild = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image>({} as Image);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Create Guild'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const uploadBanner = async (): Promise<string> => {
    const filename = selectedImage.filename;
    const uri = selectedImage.uri;

    try {
      const imageRef = `${uuidv4()}.${getImageType(filename)}`;
      const reference = storage().ref(imageRef);

      await reference.putFile(uri);

      return imageRef;
    } catch (err: any) {
      throw new Error(
        firebaseExceptions[err.code] || 'Não foi possível alterar o banner.',
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoadingRequest(true);
    let imageRef: string = '';

    try {
      if (Object.keys(selectedImage).length !== 0) {
        imageRef = await uploadBanner();
      }

      const { id } = await firestore()
        .collection('guilds')
        .add({
          name: data.name,
          bannerRef: imageRef !== '' ? imageRef : '',
          description: data.description,
          members: [userSession.uid],
          owner: userSession.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
          warCry: data.warCry,
        });

      await firestore()
        .collection<ProfileDto>('profiles')
        .doc(userSession.uid)
        .update({
          guild: id,
        });

      Alert.alert('=D', 'Guild criada com sucesso', [
        {
          text: 'Ok',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('>.<', err.message, [
          {
            text: 'Ok',
          },
        ]);
      } else {
        Alert.alert(
          '>.<',
          'Não foi possível concluir a solicitação, tente novamente mais tarde.',
          [
            {
              text: 'Ok',
            },
          ],
        );
      }
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    try {
      const image = await handleRetrieveSingleImage(type);

      if (!image) throw new Error('Something went wrong.');

      setSelectedImage(image);
      setIsOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('>.<', err.message);
      } else {
        Alert.alert('>.<', 'Something went wrong.');
      }
    }
  };

  return (
    <ScreenWrapper>
      <VStack>
        <Header title="Create Guild" />
        <ScrollView>
          <Pressable onPress={() => setIsOpen(true)}>
            <AspectRatio w="100%" ratio={RATIO}>
              {selectedImage.uri ? (
                <FastImage
                  source={{
                    uri: selectedImage.uri,
                  }}
                />
              ) : (
                <VStack justifyContent="center">
                  <Text fontSize="4xl" color="white">
                    Guild Banner
                  </Text>
                </VStack>
              )}
            </AspectRatio>
          </Pressable>
          <VStack px={AXIS_X_PADDING_CONTENT} w="100%">
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
                    isDisabled={isLoadingRequest}
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
                    isDisabled={isLoadingRequest}
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
                    isDisabled={isLoadingRequest}
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

            <Button
              title="Enviar"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoadingRequest}
              w="full"
            />
          </VStack>
        </ScrollView>
        <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Actionsheet.Content bg="gray.900">
            <Actionsheet.Item
              bg="gray.900"
              onPress={() => handleImageSelection('gallery')}>
              <Text fontSize="md" color="white">
                Galeria
              </Text>
            </Actionsheet.Item>
            <Actionsheet.Item
              bg="gray.900"
              onPress={() => handleImageSelection('camera')}>
              <Text fontSize="md" color="white">
                Camera
              </Text>
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </ScreenWrapper>
  );
};

export default CreateGuild;
