declare module 'styled-components/native';

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-dotenv' {
  export const GAMEAPI_BASE_URL: string;
  export const GAMEAPI_KEY: string;
}
