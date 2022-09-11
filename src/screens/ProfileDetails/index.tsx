import React, { useState, useEffect } from 'react';
import { Alert, Pressable } from 'react-native';
import {
  Avatar,
  FormControl,
  Select as NativeBaseSelect,
  useToast,
  Actionsheet,
  Box,
  Text,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native';

import VStack from '@components/VStack';
import ScrollView from '@components/ScrollView';
import Button from '@components/Button';
import Select from '@components/Select';
import Input from '@components/Input';
import Loading from '@components/Loading';
import {
  AXIS_X_PADDING_CONTENT,
  FORM_INPUT_MARGIN_BOTTOM,
} from '@utils/constants';
import { handleDateMask, handlePhoneMask } from '@utils/inputMasks';
import { Profile } from '@interfaces/profile.dto';
import { Image } from '@interfaces/image.model';
import { useAppDispatch } from '@store/index';
import { setTitle } from '@store/slices/navigation-slice';
import getPermissions from '@utils/handleGalleryPermission';
import getPictureFromStorage from '@utils/getPictureFromStorage';
import getPictureFromCamera from '@utils/getPictureFromCamera';
import getImageType from '@utils/getImageType';
import firebaseExceptions from '@utils/firebaseExceptions';

type FormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
};

const schema = yup.object().shape({
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
  phone: yup
    .string()
    .required('Prenchimento obrigatorio')
    .test(
      'len',
      'Telefone deve conter 11 dígitos',
      (value: string | undefined): boolean => value?.toString().length === 15,
    ),
});

const ProfileDetails = () => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image>({} as Image);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;

  useEffect(() => {
    let isMounted = true;

    isMounted && isFocused && dispatch(setTitle('Stats'));

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await firestore()
          .collection<Profile>('profiles')
          .doc(userSession.uid)
          .get();

        setProfile(response.data()!);

        if (userSession.photoURL) {
          const imageUrl = await storage()
            .ref(userSession.photoURL)
            .getDownloadURL();

          setImage(imageUrl);
        }
      } catch (err) {
        Alert.alert(
          '>.<',
          'Conteúdo indisponível, tente novamente mais tarde.',
          [
            {
              text: 'Ok',
            },
          ],
        );
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [userSession.photoURL, userSession.uid]);

  const uploadAvatar = async (): Promise<string | void> => {
    const filename = selectedImage.filename;
    const uri = selectedImage.uri;

    try {
      const imageRef = `${userSession.uid}.${getImageType(filename)}`;
      const reference = storage().ref(imageRef);

      await reference.putFile(uri);

      return imageRef;
    } catch (err: any) {
      Alert.alert(
        '>.<',
        firebaseExceptions[err.code] ||
          'Não foi possível alterar o seu avatar.',
        [
          {
            text: 'Ok',
          },
        ],
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoadingRequest(true);

    try {
      await firestore()
        .collection<Profile>('profiles')
        .doc(userSession.uid)
        .update({
          birthDate: data.birthDate,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          phone: data.phone,
        });

      if (Object.keys(selectedImage).length !== 0) {
        const imageUrl = await uploadAvatar();

        imageUrl &&
          (await auth().currentUser?.updateProfile({
            displayName: `${data.firstName} ${data.lastName}`,
            photoURL: imageUrl,
          }));
      }

      toast.show({
        description: 'Ficha atualizada com sucesso.',
      });
    } catch (err) {
      Alert.alert(
        '>.<',
        'Não foi possível concluir a solicitação, tente novamente mais tarde.',
        [
          {
            text: 'Ok',
          },
        ],
      );
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleGallery = async () => {
    const permissionStatus = await getPermissions('gallery');

    if (permissionStatus === 'granted') {
      const imageFromStorage = await getPictureFromStorage();
      const filename = imageFromStorage.assets?.[0].fileName;
      const uri = imageFromStorage.assets?.[0].uri;

      if (filename && uri) {
        setSelectedImage({
          filename,
          uri,
        });
      }
    }
  };

  const handleCamera = async () => {
    const permissionStatus = await getPermissions('camera');

    if (permissionStatus === 'granted') {
      console.log('test');
      const imageFromCamera = await getPictureFromCamera();
      const filename = imageFromCamera.assets?.[0].fileName;
      const uri = imageFromCamera.assets?.[0].uri;

      if (filename && uri) {
        setSelectedImage({
          filename,
          uri,
        });
      }
    }
  };

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      {!isLoading ? (
        <ScrollView pt={8}>
          <Pressable onPress={() => setIsOpen(true)}>
            <Avatar
              bg="gray.700"
              alignSelf="center"
              size="2xl"
              source={{
                uri: selectedImage.uri ? selectedImage.uri : image,
              }}>
              {`${profile.firstName[0]}${profile.lastName[0]}`}
            </Avatar>
          </Pressable>
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
                  isDisabled={isLoadingRequest}
                />
              )}
              name="firstName"
              defaultValue={profile.firstName}
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
                  isDisabled={isLoadingRequest}
                />
              )}
              name="lastName"
              defaultValue={profile.lastName}
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
                  isDisabled={isLoadingRequest}
                />
              )}
              name="birthDate"
              defaultValue={profile.birthDate}
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
                  isDisabled={isLoadingRequest}>
                  <NativeBaseSelect.Item label="Masculino" value="male" />
                  <NativeBaseSelect.Item label="Feminino" value="female" />
                  <NativeBaseSelect.Item label="Outro" value="other" />
                </Select>
              )}
              name="gender"
              defaultValue={profile.gender}
            />
            <FormControl.ErrorMessage>
              {errors.gender?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl mb={FORM_INPUT_MARGIN_BOTTOM}>
            <FormControl.Label>E-mail</FormControl.Label>
            <Input
              placeholder="cloud.exsoldier@avalanche.com"
              value={userSession.email || ''}
              autoComplete="email"
              autoCorrect={false}
              selectionColor="secondary.700"
              autoCapitalize="none"
              keyboardType="email-address"
              isDisabled
            />
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
                  isDisabled={isLoadingRequest}
                />
              )}
              name="phone"
              defaultValue={handlePhoneMask(profile.phone)}
            />
            <FormControl.ErrorMessage>
              {errors.phone?.message}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button
            title="Enviar"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoadingRequest}
            isDisabled={
              Object.keys(dirtyFields).length === 0 ||
              Object.keys(errors).length !== 0
            }
            w="full"
          />
        </ScrollView>
      ) : (
        <Loading />
      )}
      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={handleGallery}>Galeria</Actionsheet.Item>
          <Actionsheet.Item onPress={handleCamera}>Camera</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
};

export default ProfileDetails;
