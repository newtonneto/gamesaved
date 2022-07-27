import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    primary: {
      700: '#996DFF',
    },
    secondary: {
      700: '#FBA94C',
    },
    green: {
      700: '#00875F',
      500: '#00B37E',
      300: '#04D361',
    },
    gray: {
      700: '#121214',
      600: '#202024',
      500: '#29292E',
      400: '#323238',
      300: '#7C7C8A',
      200: '#C4C4CC',
      100: '#E1E1E6',
    },
    white: '#FFFFFF',
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
  ontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
  },
  sizes: {
    14: 56,
  },
});
