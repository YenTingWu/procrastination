import { addDecorator } from '@storybook/react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import theme from '../src/theme';
import '../src/global.css';

addDecorator((StoryFn) => (
  <ChakraProvider theme={theme}>
    <CSSReset />
    <StoryFn />
  </ChakraProvider>
));

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
