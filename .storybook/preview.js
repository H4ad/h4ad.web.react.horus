import { css, Global, ThemeProvider } from '@emotion/react';
import React from 'react';
import { QueryClientProvider } from 'react-query';

import { defaultQueryClient } from '../src/App';
import { theme } from '../src/App.theming';
import { GlobalStyles } from '../src/styles/global';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

const globalStyle = css(`body { padding: 0!important; }`);

export const decorators = [
  (Story) =>
    <QueryClientProvider client={defaultQueryClient}>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyle} />
        <GlobalStyles/>
        <Story/>
      </ThemeProvider>
    </QueryClientProvider>,
];
