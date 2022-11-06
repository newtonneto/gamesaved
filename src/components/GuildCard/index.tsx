import React from 'react';
import { Text } from 'react-native';

import { GuildDto } from '@interfaces/guild.dto';

type Props = {
  guild: GuildDto;
};

const GuildCard = ({ guild }: Props) => {
  return <Text>{guild.name}</Text>;
};

export default GuildCard;
