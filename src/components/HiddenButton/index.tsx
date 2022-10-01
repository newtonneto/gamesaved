import React from 'react';
import { Box, useTheme } from 'native-base';
import { Trash, UserCirclePlus, UserCircleMinus } from 'phosphor-react-native';
import { RowMap } from 'react-native-swipe-list-view';
import { TouchableOpacityStyled } from './styles';
import { ProfileDto } from '@src/interfaces/profile.dto';

type Props = {
  handler: Function;
  id: string;
  rowMap: RowMap<number | ProfileDto | string>;
  type: 'add_friend' | 'remove_loot' | 'remove_friend';
};

const HiddenButton = ({ handler, id, rowMap, type }: Props) => {
  const { colors } = useTheme();

  return (
    <Box alignItems="flex-end">
      {type === 'add_friend' && (
        <TouchableOpacityStyled
          onPress={() => handler(id, rowMap)}
          bgColor={colors.success[700]}>
          <UserCirclePlus color={colors.white} size={24} />
        </TouchableOpacityStyled>
      )}
      {type === 'remove_loot' && (
        <TouchableOpacityStyled
          onPress={() => handler(id, rowMap)}
          bgColor={colors.red[700]}>
          <Trash color={colors.white} size={24} />
        </TouchableOpacityStyled>
      )}
      {type === 'remove_friend' && (
        <TouchableOpacityStyled
          onPress={() => handler(id, rowMap)}
          bgColor={colors.red[700]}>
          <UserCircleMinus color={colors.white} size={24} />
        </TouchableOpacityStyled>
      )}
    </Box>
  );
};

export default HiddenButton;
