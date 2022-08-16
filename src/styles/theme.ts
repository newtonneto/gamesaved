import { extendTheme } from 'native-base';

import {
  PRIMARY_700,
  SECONDARY_700,
  GREEN_700,
  GREEN_500,
  GREEN_300,
  GRAY_700,
  GRAY_600,
  GRAY_500,
  GRAY_400,
  GRAY_300,
  GRAY_200,
  GRAY_100,
  WHITE,
} from '@styles/colors';

export const THEME = extendTheme({
  colors: {
    primary: {
      700: PRIMARY_700,
    },
    secondary: {
      700: SECONDARY_700,
    },
    green: {
      700: GREEN_700,
      500: GREEN_500,
      300: GREEN_300,
    },
    gray: {
      700: GRAY_700,
      600: GRAY_600,
      500: GRAY_500,
      400: GRAY_400,
      300: GRAY_300,
      200: GRAY_200,
      100: GRAY_100,
    },
    white: WHITE,
  },
  fontConfig: {
    Gamer: {
      100: {
        normal: 'Gamer',
      },
      200: {
        normal: 'Gamer',
      },
      300: {
        normal: 'Gamer',
      },
      400: {
        normal: 'Gamer',
      },
      500: {
        normal: 'Gamer',
      },
      600: {
        normal: 'Gamer',
      },
      700: {
        normal: 'Gamer',
      },
      800: {
        normal: 'Gamer',
      },
      900: {
        normal: 'Gamer',
      },
    },
    Roboto: {
      100: {
        normal: 'Roboto-Light',
        italic: 'Roboto-LightItalic',
      },
      200: {
        normal: 'Roboto-Light',
        italic: 'Roboto-LightItalic',
      },
      300: {
        normal: 'Roboto-Light',
        italic: 'Roboto-LightItalic',
      },
      400: {
        normal: 'Roboto-Regular',
        italic: 'Roboto-Italic',
      },
      500: {
        normal: 'Roboto-Medium',
      },
      600: {
        normal: 'Roboto-Medium',
        italic: 'Roboto-MediumItalic',
      },
      700: {
        normal: 'Roboto-Bold',
      },
      800: {
        normal: 'Roboto-Bold',
        italic: 'Roboto-BoldItalic',
      },
      900: {
        normal: 'Roboto-Bold',
        italic: 'Roboto-BoldItalic',
      },
    },
  },
  fonts: {
    heading: 'Gamer',
    body: 'Roboto',
    mono: 'Roboto',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
  },
  sizes: {
    12: 48,
    14: 56,
    16: 64,
    18: 72,
    20: 80,
    22: 88,
    24: 96,
  },
});
