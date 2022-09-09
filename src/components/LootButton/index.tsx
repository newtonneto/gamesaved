import React from 'react';
import { Box, useTheme } from 'native-base';
import { Trash } from 'phosphor-react-native';
import { RowMap } from 'react-native-swipe-list-view';
import { TouchableOpacityStyled } from './styles';

type Props = {
  handleRemove: Function;
  id: number;
  rowMap: RowMap<number>;
};

const LootButton = ({ handleRemove, id, rowMap }: Props) => {
  const { colors } = useTheme();

  return (
    <Box alignItems="flex-end">
      <TouchableOpacityStyled
        onPress={() => handleRemove(id, rowMap)}
        bgColor={colors.red[700]}>
        <Trash color={colors.white} size={24} />
      </TouchableOpacityStyled>
    </Box>
  );
};

export default LootButton;
