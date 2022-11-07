import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import {
  Box,
  Pressable,
  Heading,
  Text,
  VStack,
  AspectRatio,
  Spinner,
} from 'native-base';
import storage from '@react-native-firebase/storage';

import { LinearGradientView } from './styles';
import Loading from '@components/Loading';
import { GuildDto } from '@interfaces/guild.dto';
import { CARDS_BORDER_WIDTH, RATIO } from '@utils/constants';
import firestoreDateFormat from '@utils/fireabseDateFormat';
import firestoreValueIsValid from '@utils/firestoreValueIsValid';

type Props = {
  guild: GuildDto;
};

const GuildCard = ({ guild }: Props) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getImage = async () => {
      setIsLoading(true);

      try {
        const imageUrl = await storage().ref(guild.bannerRef).getDownloadURL();
        setImage(imageUrl);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    firestoreValueIsValid(guild.bannerRef) && getImage();
  }, []);

  return (
    <Pressable>
      <Box
        w="full"
        height="100px"
        rounded="lg"
        overflow="hidden"
        borderWidth={CARDS_BORDER_WIDTH}
        borderColor="secondary.700"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start">
        <VStack bg="rgba(32, 32, 36, 1)" width="full" h="full">
          <AspectRatio h="100%" ratio={RATIO} mr="0px" ml="auto">
            {image ? (
              <ImageBackground
                source={{
                  uri: image,
                }}>
                <LinearGradientView
                  start={{ x: 1.0, y: 0.3 }}
                  end={{ x: 0.3, y: 0.3 }}
                  colors={['rgba(32, 32, 36, 0)', 'rgba(32, 32, 36, 1)']}
                />
              </ImageBackground>
            ) : (
              <VStack w="full" justifyContent="center" alignItems="center">
                {isLoading && (
                  <Spinner
                    accessibilityLabel="Loading content"
                    color="secondary.700"
                    size="sm"
                  />
                )}
              </VStack>
            )}
          </AspectRatio>
          <VStack
            w="100%"
            my={2}
            mx={4}
            position="absolute"
            zIndex={1}
            overflow="visible">
            <Heading
              size="sm"
              color="white"
              ellipsizeMode="tail"
              numberOfLines={1}>
              {guild.name}
            </Heading>
            <Text color="white" ellipsizeMode="tail" numberOfLines={1}>
              {guild.warCry}
            </Text>
            <Text color="white" ellipsizeMode="tail" numberOfLines={1}>
              Members: {guild.members.length}
            </Text>
            <Text color="white" ellipsizeMode="tail" numberOfLines={1}>
              Since: {firestoreDateFormat(guild.createdAt)}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default GuildCard;
