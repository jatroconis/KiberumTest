import { defaultTheme } from 'react-admin';

export const theme = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
  },
} as const;
