import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import PlaystationIcon from '@assets/imgs/playstation.svg';
import XboxIcon from '@assets/imgs/xbox.svg';
import NintendoIcon from '@assets/imgs/nintendo.svg';
import SteamIcon from '@assets/imgs/steam.svg';

const platformsIcons: { [key: string]: FC<SvgProps> } = {
  playstation: PlaystationIcon,
  xbox: XboxIcon,
  nintendo: NintendoIcon,
  steam: SteamIcon,
};

export default platformsIcons;
