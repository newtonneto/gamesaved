import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { AspectRatio, Heading, Text } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import ScreenWrapper from '@components/ScreenWrapper';
import VStack from '@components/VStack';
import Header from '@components/Header';
import Button from '@components/Button';
import ScrollView from '@components/ScrollView';
import Loading from '@components/Loading';
import { GuildDto } from '@interfaces/guild.dto';
import { ProfileDto } from '@interfaces/profile.dto';
import {
  AXIS_X_PADDING_CONTENT,
  NO_LABEL_INPUT_MARGIN_BOTTOM,
  RATIO,
} from '@utils/constants';
import { generateErrorMessage } from '@utils/generateErrorMessage';

type RouteParams = {
  guild: GuildDto;
  imageUrl: string | undefined;
};

const GuildDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { guild, imageUrl } = route.params as RouteParams;
  const userSession: FirebaseAuthTypes.User = auth().currentUser!;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const guildUuid = useRef<string>('');

  useEffect(() => {
    const getGuild = async () => {
      try {
        const response = await firestore()
          .collection<GuildDto>('guilds')
          .where('owner', '==', guild.owner)
          .limit(1)
          .get();

        const guildData = response.docs.pop();

        if (!guildData) throw new Error('Guild not found');

        guildUuid.current = guildData.id;
        setIsLoading(false);
      } catch (err) {
        Alert.alert(
          '>.<',
          generateErrorMessage(
            err,
            'Somenthing went wrong while trying to get guild data',
          ),
          [
            {
              text: 'Ok',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    };

    getGuild();
  }, []);

  const handleJoin = async () => {
    setIsLoadingRequest(true);

    try {
      firestore()
        .collection<ProfileDto>('profiles')
        .doc(userSession.uid)
        .update({
          guild: guildUuid.current,
        });

      firestore()
        .collection<GuildDto>('guilds')
        .doc(guildUuid.current)
        .update({
          members: firestore.FieldValue.arrayUnion(userSession.uid),
        });

      Alert.alert('=D', 'Guild joined with success', [
        {
          text: 'Ok',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert(
        '>.<',
        generateErrorMessage(
          err,
          'Somenthing went wrong while trying to join the guild',
        ),
        [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } finally {
      setIsLoadingRequest(false);
    }
  };

  return (
    <ScreenWrapper>
      <VStack>
        <Header title={guild.name} />
        <ScrollView>
          <VStack w="full">
            <AspectRatio w="100%" ratio={RATIO}>
              {imageUrl ? (
                <FastImage
                  source={{
                    uri: imageUrl,
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
            {!isLoading ? (
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
                  mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {guild.warCry}
                </Heading>
                <VStack w="full" alignItems="flex-start">
                  <Text color="white" mb={NO_LABEL_INPUT_MARGIN_BOTTOM}>
                    {guild.description}
                  </Text>
                </VStack>
                <Button
                  title="Join"
                  w="full"
                  onPress={handleJoin}
                  mb={NO_LABEL_INPUT_MARGIN_BOTTOM}
                  isLoading={isLoadingRequest}
                />
              </VStack>
            ) : (
              <Loading />
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </ScreenWrapper>
  );
};

export default GuildDetail;
