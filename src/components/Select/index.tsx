import React, { ReactNode } from 'react';
import {
  Select as NativeBaseSelect,
  ISelectProps,
  CheckIcon,
} from 'native-base';

import {
  INPUT_HEIGHT,
  INPUT_BORDER_WIDTH,
  ACTIONSHEET_ROUND_SIZE,
} from '@styles/sizes';

type Props = ISelectProps & {
  children: ReactNode[];
};

const Select = ({ children, ...rest }: Props) => {
  return (
    <NativeBaseSelect
      bg="gray.700"
      h={INPUT_HEIGHT}
      size="md"
      borderWidth={INPUT_BORDER_WIDTH}
      borderColor="secondary.700"
      fontFamily="body"
      color="white"
      placeholderTextColor="gray.300"
      mb={0}
      _selectedItem={{
        bg: 'secondary.700',
        endIcon: <CheckIcon size={ACTIONSHEET_ROUND_SIZE} />,
      }}
      _actionSheetContent={{ bg: 'gray.600' }}
      _item={{ bg: 'gray.600', _text: { color: 'white' } }}
      {...rest}>
      {children}
    </NativeBaseSelect>
  );
};

export default Select;
