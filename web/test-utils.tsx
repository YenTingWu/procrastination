import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './src/theme';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

const AllProviders: React.FC = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

const customRender = (ui: any, options = {}) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
