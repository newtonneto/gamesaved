import React, { useState } from 'react';

import VStack from '@components/VStack';
import Loading from '@components/Loading';
import FlatList from '@components/FlatList';
import { AXIS_X_PADDING_CONTENT } from '@utils/constants';

const Guild = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <VStack px={AXIS_X_PADDING_CONTENT}>
      {!isLoading ? (
        <FlatList
          data={[]}
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Loading />
      )}
    </VStack>
  );
};

export default Guild;
