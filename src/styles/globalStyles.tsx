// src/styles/globalStyles.tsx
import { GlobalStyles } from '@mui/material';

export const GlobalCss = () => (
  <GlobalStyles
    styles={{
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: '#ffffffff',
        fontFamily: "'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      a: {
        textDecoration: 'none',
        color: 'inherit',
      },
      ul: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
      img: {
        maxWidth: '100%',
        display: 'block',
      },
    }}
  />
);
