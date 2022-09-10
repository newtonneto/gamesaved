import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GRAY_600 } from '@styles/colors';

type Props = {
  pTop: number;
};

export const SafeAreaViewStyled = styled(SafeAreaView)`
  background-color: ${GRAY_600};
  flex: 1;
  borderwidth: 1px;
  padding-top: ${(props: Props) => props.pTop}px;
`;

export const KeyboardAvoidingViewStyled = styled.KeyboardAvoidingView`
  flex: 1;
`;
