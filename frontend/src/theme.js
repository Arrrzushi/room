import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9999', // Soft pink
      light: '#FFB3B3',
      dark: '#FF8080',
    },
    secondary: {
      main: '#99CCFF', // Soft blue
      light: '#B3D9FF',
      dark: '#80BFFF',
    },
    background: {
      default: '#FFF5F5', // Very light pink
      paper: '#FFFFFF',
    },
    success: {
      main: '#99FF99', // Soft green
    },
    info: {
      main: '#CC99FF', // Soft purple
    },
    warning: {
      main: '#FFCC99', // Soft orange
    },
    error: {
      main: '#FF99CC', // Soft red
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16, // Rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          padding: '8px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;