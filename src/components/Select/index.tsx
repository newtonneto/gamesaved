import React, { ReactNode } from 'react';
import {
  Select as NativeBaseSelect,
  ISelectProps,
  CheckIcon,
} from 'native-base';

type Props = ISelectProps & {
  children: ReactNode[];
};

const Select = ({ children, ...rest }: Props) => {
  return (
    <NativeBaseSelect
      bg="gray.700"
      h={14}
      size="md"
      borderWidth={1}
      borderColor="secondary.700"
      fontFamily="body"
      color="white"
      placeholderTextColor="gray.300"
      mb={0}
      _selectedItem={{
        bg: 'secondary.700',
        endIcon: <CheckIcon size="5" />,
      }}
      _actionSheetContent={{ bg: 'gray.600' }}
      _item={{ bg: 'gray.600', _text: { color: 'white' } }}
      {...rest}>
      {children}
    </NativeBaseSelect>
  );
};

export default Select;
