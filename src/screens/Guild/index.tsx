import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Alert, ListRenderItem, FlatList, StyleSheet } from 'react-native';
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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import DarkAlley from '@assets/imgs/undraw_dark_alley.svg';
import VStack from '@components/VStack';
import Loading from '@components/Loading';
import Input from '@components/Input';
import Button from '@components/Button';
import Toast from '@components/Toast';
import Header from '@components/Header';
import ScreenWrapper from '@components/ScreenWrapper';
import PostCard from '@components/PostCard';
import { ProfileDto } from '@interfaces/profile.dto';
import { GuildDto } from '@interfaces/guild.dto';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  RATIO,
  TOAST_DURATION,
  VERTICAL_PADDING_LISTS,
} from '@utils/constants';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';
import GuildCard from '@src/components/GuildCard';
import { FlatListSeparator } from '@src/components/FlatListComponents';
import PostModal from './modal';

type FormData = {
  searchValue: string;
};

const schema = yup.object().shape({
  searchValue: yup.string(),
});

const Guild = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [hasGuild, setHasGuild] = useState<boolean>(false);
  const [guild, setGuild] = useState<GuildDto>({} as GuildDto);
  const [guilds, setGuilds] = useState<GuildDto[]>([]);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const guildUuid = useRef<string>('');
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const profileRef = useRef<
    FirebaseFirestoreTypes.DocumentReference<ProfileDto>
  >(firestore().collection<ProfileDto>('profiles').doc(userSession.uid));
  const guildRef = useRef<FirebaseFirestoreTypes.CollectionReference<GuildDto>>(
    firestore().collection<GuildDto>('guilds'),
  );

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

  const getGuild = async () => {
    setHasGuild(true);

    try {
      guildRef.current.doc(guildUuid.current).onSnapshot(async snapshot => {
        if (snapshot.exists) {
          const guild = snapshot.data() as GuildDto;

          setGuild(guild);
          await getImage(guild.bannerRef);
        } else {
          setHasGuild(false);
        }
      });
    } catch (error) {
      Alert.alert('>.<', 'Something went wrong', [
        {
          text: 'Voltar',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Tentar novamente',
          onPress: () => getGuild(),
        },
      ]);
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
            guildUuid.current = profile.guild;
            await getGuild();
          }
        }

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

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const handleLeave = async () => {
    setIsLoadingRequest(true);

    try {
      await guildRef.current.doc(guildUuid.current).update({
        members: firestore.FieldValue.arrayRemove(userSession.uid),
      });

      guildUuid.current = '';

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
    setIsLoadingRequest(true);

    try {
      const response = (
        await guildRef.current
          .orderBy('name')
          .startAt(data.searchValue)
          .endAt(data.searchValue + '\uf8ff')
          .get()
      ).docs;

      if (response.length > 0) {
        const guildsData = response.map(doc => doc.data() as GuildDto);

        setGuilds(guildsData);
      }
    } catch (error) {
      console.log('error: ', error);
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

  const GuildHeader = () => (
    <VStack>
      <PostModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        guildUuid={guildUuid.current}
        userUuid={userSession.uid}
      />
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
      <Fab
        placement="top-left"
        renderInPortal={false}
        shadow={2}
        bg="secondary.700"
        icon={<MagnifyingGlass color={colors.white} size={18} />}
        label="Search"
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
              {guild.name}
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
        <Button
          title="New Post"
          w="full"
          onPress={() => setIsModalVisible(true)}
          mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
        />
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
        mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
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

  const RenderGuild: ListRenderItem<GuildDto> = ({ item }) => (
    <GuildCard guild={item} />
  );

  const RenderPosts: ListRenderItem<string> = ({ item }) => (
    <PostCard uuid={item} />
  );

  return (
    <ScreenWrapper>
      <VStack>
        <Header title="Guild" />
        {!isLoading ? (
          <VStack w="full">
            {hasGuild ? (
              <VStack w="full">
                <FlatList
                  data={guild.posts}
                  renderItem={RenderPosts}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={GuildHeader}
                  ItemSeparatorComponent={FlatListSeparator}
                  contentContainerStyle={styles.flatListContent}
                  style={styles.flatList}
                />
              </VStack>
            ) : (
              <VStack px={AXIS_X_PADDING_CONTENT} w="full">
                <FlatList
                  data={guilds}
                  renderItem={RenderGuild}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={NoGuildHeader}
                  ListEmptyComponent={RenderEmptyNoGuild}
                  ItemSeparatorComponent={FlatListSeparator}
                  contentContainerStyle={styles.flatListContent}
                  style={styles.flatList}
                />
              </VStack>
            )}
          </VStack>
        ) : (
          <Loading />
        )}
      </VStack>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: VERTICAL_PADDING_LISTS,
  },
  flatList: {
    width: '100%',
  },
});

export default Guild;
