import { extendTheme } from '@chakra-ui/react';

const colors = {
  black: '#333333',
  procrastination: {
    second: 'rgba(152, 11, 202, .22)',
    gray: '#888888',
  },
};

const components = {
  Button: {
    baseStyle: {
      _focus: {
        boxShadow: 'none',
      },
    },
  },
  Link: {
    baseStyle: {
      _focus: {
        boxShadow: 'none',
      },
    },
  },
};

const styles = {
  a: {
    cursor: 'pointer',
  },
  'a&:hover': {
    textDecoration: 'none',
  },
  body: {
    letterSpacing: 22,
  },
};

const fonts = {
  heading: 'Noto Sans, sans-serif',
  body: 'Noto Sans, sans-serif',
};

const theme = extendTheme({
  styles,
  components,
  fonts,
  colors,
});

export default theme;
