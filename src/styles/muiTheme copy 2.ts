// src/styles/muiTheme.ts

import { createTheme } from '@mui/material/styles';

export const useMuiTheme = () => {
  return createTheme({
    typography: {
      fontWeightBold: 700,
      fontFamily: "'Inter', sans-serif",
      h1: {
        fontWeight: 800,
        fontSize: '3.5rem',
        fontFamily: "'Poppins', sans-serif",
      },
      h2: {
        fontWeight: 700,
        fontSize: '3rem',
        fontFamily: "'Poppins', sans-serif'",
      },
      h3: {
        fontWeight: 700,
        fontSize: '2.5rem',
        fontFamily: "'Poppins', sans-serif",
      },
      h4: {
        fontWeight: 700,
        fontSize: '2rem',
        fontFamily: "'Poppins', sans-serif",
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.5rem',
        fontFamily: "'Poppins', sans-serif",
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.2rem',
        fontFamily: "'Poppins', sans-serif",
      },
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#D72638', // vermelho queimado (fire)
        contrastText: '#fff',
      },
      secondary: {
        main: '#1E88E5', // azul céu (cloud)
        contrastText: '#fff',
      },
      background: {
        default: '#F9FAFB', // cinza super claro pra contraste suave
        paper: '#FFFFFF',
      },
      text: {
        primary: '#212121',
        secondary: '#555555',
      },
      error: {
        main: '#ff5252',
      },
      warning: {
        main: '#ffa726',
      },
      info: {
        main: '#29b6f6',
      },
      success: {
        main: '#66bb6a',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            padding: '8px 16px',
          },
          containedPrimary: {
            backgroundColor: '#D72638',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          },
          containedSecondary: {
            backgroundColor: '#1E88E5',
            '&:hover': {
              backgroundColor: '#1565C0',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(90deg, #D72638 0%, #1E88E5 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
    },
  });
};
