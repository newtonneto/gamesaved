import React from 'react';
import { FlatListProps, StyleSheet } from 'react-native';

import { FlatListNative } from './styles';
import { Game } from '@interfaces/game.dto';
import { VERTICAL_PADDING_LISTS } from '@utils/constants';

const FlatList = ({ ...rest }: FlatListProps<Game>) => {
  return (
    <FlatListNative {...rest} contentContainerStyle={styles.flatListContent} />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingVertical: VERTICAL_PADDING_LISTS,
  },
});

export default FlatList;
