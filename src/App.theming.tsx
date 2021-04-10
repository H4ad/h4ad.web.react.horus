import { Theme } from '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary500: string,
      primaryContrast500: string,
      light800: string,
      light500: string,
      light100: string,
    };
  }
}

export const theme: Theme = {
  colors: {
    primary500: '#1890FF',
    primaryContrast500: '#262626',
    light100: '#FFFFFF',
    light500: '#F5F6FC',
    light800: '#858585',
  },
};
