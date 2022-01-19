import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    gainsboro: '#e3e2e2',
    lightblue: '#28aacb',
    moodyBlue: '#7171cb',
    red: 'red',
    white: 'white',
    green: 'green',
  },
};

export const themePaperBar = {};

export type Theme = typeof theme;
