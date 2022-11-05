import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Alert } from 'react-native';
import {
  FormControl,
  useTheme,
  IconButton,
  Heading,
  AspectRatio,
  Text,
  useToast,
  Fab,
} from 'native-base';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MagnifyingGlass, SignOut, XCircle } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import DarkAlley from '@assets/imgs/undraw_dark_alley.svg';
import VStack from '@components/VStack';
import Loading from '@components/Loading';
import Input from '@components/Input';
import FlatList from '@components/FlatList';
import Button from '@components/Button';
import Toast from '@components/Toast';
import { ProfileDto } from '@interfaces/profile.dto';
import { GuildDto } from '@interfaces/guild.dto';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  RATIO,
  TOAST_DURATION,
} from '@utils/constants';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';

type FormData = {
  searchValue: string;
};

const schema = yup.object().shape({
  searchValue: yup.string(),
});

const Guild = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [hasGuild, setHasGuild] = useState<boolean>(false);
  const [guild, setGuild] = useState<GuildDto>({} as GuildDto);
  const [image, setImage] = useState<string | undefined>(undefined);
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const profileRef = useRef<
    FirebaseFirestoreTypes.DocumentReference<ProfileDto>
  >(firestore().collection<ProfileDto>('profiles').doc(userSession.uid));

  const getImage = async (bannerRef: string) => {
    if (firestoreValueIsValid(bannerRef)) {
      try {
        const response = await storage().ref(bannerRef).getDownloadURL();

        setImage(response);
      } catch (err) {
        toast.show({
          duration: TOAST_DURATION,
          render: () => {
            return (
              <Toast
                status="error"
                title="GameSaved"
                description="Error to retrieve user avatar"
                textColor="darkText"
              />
            );
          },
        });
      }
    }
  };

  const getGuild = async (id: string) => {
    setHasGuild(true);

    try {
      const response = await firestore()
        .collection<GuildDto>('guilds')
        .doc(id)
        .get();

      const guildData = response.data();

      if (guildData) {
        await getImage(guildData.bannerRef);

        setGuild(guildData);
      }
    } catch (error) {
      Alert.alert('Error');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getProfile = async () => {
      try {
        const response = await profileRef.current.get();

        if (response.exists) {
          const profile = response.data() as ProfileDto;

          if (isMounted && profile.guild) {
            await getGuild(profile.guild);
          }
        }

        if (userSession.photoURL) {
          const imageUrl = await storage()
            .ref(userSession.photoURL)
            .getDownloadURL();

          setImage(imageUrl);

          console.log('img: ', imageUrl);
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

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLeave = async () => {
    setIsLoadingRequest(true);

    try {
      await profileRef.current.update({
        guild: '',
      });

      setHasGuild(false);
    } catch (error) {
      Alert.alert(
        '>.<',
        'Não foi possível concluir a sua solicitação, tente novamente mais tarde.',
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

  const onSubmit = async (data: FormData) => {
    //TO-DO: search guild
  };

  const GuildHeader = () => (
    <VStack>
      <Fab
        placement="top-right"
        renderInPortal={false}
        shadow={2}
        bg="danger.700"
        icon={<SignOut color={colors.white} size={18} />}
        label="Leave"
        onPress={handleLeave}
        _pressed={{ bg: 'gray.500' }}
        disabled={isLoadingRequest}
      />
      <AspectRatio w="100%" ratio={RATIO}>
        {image ? (
          <FastImage
            source={{
              uri: image,
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
      <VStack px={AXIS_X_PADDING_CONTENT} w="full">
        <Heading
          fontFamily="body"
          fontSize="lg"
          color="white"
          ml={4}
          my={4}
          numberOfLines={1}
          ellipsizeMode="tail">
          {guild.name}
        </Heading>
        <Heading
          fontFamily="body"
          fontSize="sm"
          color="white"
          ml={4}
          mb={4}
          numberOfLines={1}
          ellipsizeMode="tail">
          {guild.warCry}
        </Heading>
        <VStack w="full" alignItems="flex-start">
          <Text color="white" mb={4}>
            {guild.description}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );

  const NoGuildHeader = () => (
    <Fragment>
      <FormControl
        isRequired
        isInvalid={'searchValue' in errors}
        mb={NO_LABEL_INPUT_MARGIN_BOTTOM}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Look for a guild"
              InputLeftElement={
                value ? (
                  <IconButton
                    _icon={{
                      as: <XCircle color={colors.gray[300]} />,
                    }}
                    onPress={() => {}}
                  />
                ) : undefined
              }
              InputRightElement={
                <IconButton
                  _icon={{
                    as: <MagnifyingGlass color={colors.gray[300]} />,
                  }}
                  onPress={handleSubmit(onSubmit)}
                />
              }
              onChangeText={onChange}
              value={value}
              isDisabled={isLoading}
              autoCorrect={false}
              selectionColor="secondary.700"
              autoCapitalize="none"
              keyboardType="web-search"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
          name="searchValue"
          defaultValue=""
        />
      </FormControl>

      <Button
        title="Create your own"
        w="full"
        onPress={() => navigation.navigate('CreateGuild')}
      />
    </Fragment>
  );

  const RenderEmptyNoGuild = () => (
    <VStack>
      <DarkAlley width={150} height={150} />
      <Heading fontFamily="heading" color="secondary.700" textAlign="center">
        LOOK FOR A GUILD TO JOIN...OR CREATE YOUR OWN
      </Heading>
    </VStack>
  );

  return (
    <VStack>
      {!isLoading ? (
        <Fragment>
          {hasGuild ? (
            <FlatList
              data={[]}
              renderItem={() => null}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={GuildHeader}
            />
          ) : (
            <FlatList
              data={[]}
              renderItem={() => null}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={NoGuildHeader}
              ListEmptyComponent={RenderEmptyNoGuild}
            />
          )}
        </Fragment>
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

export default Guild;
