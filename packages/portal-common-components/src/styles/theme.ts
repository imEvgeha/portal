import 'styled-components';

const theme = {
  colors: {
    black: Object.assign('#000000', { test: '#0001' }),
    grey: Object.assign('#F2F2F2', { dark: '#13120D' }),
  },
} as const;

export default theme;
