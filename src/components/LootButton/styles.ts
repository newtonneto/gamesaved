import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const TouchableOpacityStyled = styled(TouchableOpacity)`
  background-color: ${(props: { bgColor: string }) => props.bgColor};
  width: 88px;
  height: 56px;
  margin-right: 32px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;
