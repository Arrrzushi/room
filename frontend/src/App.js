import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Intro from './components/Intro';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';

// Create a dark, professional theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      letterSpacing: '0.1em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    body2: {
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          letterSpacing: '0.05em',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1a1a2e',
          border: '1px solid #334155',
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#1a1a2e',
          border: '1px solid #334155',
        },
      },
    },
  },
});

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleEnterPlatform = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Intro onEnter={handleEnterPlatform} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: '#0f0f23' }}>
        <Header />
        <Box sx={{ p: 3 }}>
          <FileUpload onFilesUploaded={setUploadedFiles} />
          <Chat uploadedFiles={uploadedFiles} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;


