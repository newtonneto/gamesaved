import React from 'react';
import { FlatListProps, StyleSheet } from 'react-native';

import { FlatListNative } from './styles';
import { Game } from '@interfaces/game.dto';
import {
  HORIZONTAL_PADDING_LISTS,
  VERTICAL_PADDING_LISTS,
} from '@utils/constants';

const FlatList = ({ ...rest }: FlatListProps<Game>) => {
  return (
    <FlatListNative {...rest} contentContainerStyle={styles.flatListContent} />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: VERTICAL_PADDING_LISTS,
    paddingHorizontal: HORIZONTAL_PADDING_LISTS,
  },
});

export default FlatList;
