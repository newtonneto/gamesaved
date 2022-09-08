import React from 'react';
import { Box, useTheme, Pressable } from 'native-base';
import { Trash } from 'phosphor-react-native';

type Props = {
  handleRemove: Function;
  id: number;
};

const LootButton = ({ handleRemove, id }: Props) => {
  const { colors } = useTheme();

  return (
    <Box alignItems="flex-end">
      <Pressable
        width={24}
        h={14}
        bg="red.700"
        rounded="lg"
        mx={8}
        alignItems="center"
        justifyContent="center"
        onPress={() => handleRemove(id)}>
        <Trash color={colors.white} size={24} />
      </Pressable>
    </Box>
  );
};

export default LootButton;
