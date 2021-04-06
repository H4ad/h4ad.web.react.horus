import { ThemeProvider } from '@emotion/react';
import React, { ReactElement } from 'react';
import { hot } from 'react-hot-loader/root'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import AppRouting from './App.routing';
import { theme } from './App.theming';
import { GlobalStyles } from './styles/global';

export const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App(): ReactElement | null {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={defaultQueryClient}>
        <GlobalStyles/>
        <AppRouting/>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
