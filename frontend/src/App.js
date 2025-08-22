import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Intro from './components/Intro';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';

// Create a minimal, clean theme
const cleanTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#1B1B1B',
      paper: '#242424',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      letterSpacing: '0.1em',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '0.05em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#242424',
          border: '1px solid #374151',
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#242424',
          border: '1px solid #374151',
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
      <ThemeProvider theme={cleanTheme}>
        <CssBaseline />
        <Intro onEnter={handleEnterPlatform} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={cleanTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: '#1B1B1B' }}>
        <Header />
        
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', py: 20, borderBottom: '1px solid #374151' }}>
          <Box
            component="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              color: 'white',
              mb: 2,
              letterSpacing: 'tight',
            }}
          >
            Upload & Analyze Documents Intelligently
          </Box>
          <Box
            component="p"
            sx={{
              color: '#9CA3AF',
              maxWidth: 'xl',
              mx: 'auto',
              fontSize: '1.125rem',
            }}
          >
            A minimal, modern way to get insights from your files.
          </Box>
        </Box>

        {/* Upload Section */}
        <Box sx={{ maxWidth: '5xl', mx: 'auto', py: 16, px: 6, borderBottom: '1px solid #374151' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box
                component="h3"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  mb: 2,
                  color: 'white',
                }}
              >
                Upload Documents
              </Box>
              <Box
                component="p"
                sx={{
                  color: '#9CA3AF',
                  fontSize: '0.875rem',
                  mb: 6,
                }}
              >
                Drag & drop your files here or click to browse. Supported formats: PDF, TXT, DOC, DOCX.
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileUpload onFilesUploaded={setUploadedFiles} />
            </Box>
          </Box>
        </Box>

        {/* Document Analysis */}
        <Box sx={{ maxWidth: '5xl', mx: 'auto', py: 16, px: 6 }}>
          <Box
            component="h3"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'white',
              mb: 6,
            }}
          >
            Document Analysis
          </Box>
          <Box sx={{ mb: 6 }}>
            <Chat uploadedFiles={uploadedFiles} />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: 'center',
            py: 8,
            borderTop: '1px solid #374151',
            color: '#6B7280',
            fontSize: '0.875rem',
          }}
        >
          <a 
            href="https://github.com/Arrrzushi" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#6B7280',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#9CA3AF'}
            onMouseLeave={(e) => e.target.style.color = '#6B7280'}
          >
            NEXUS — Built by Arushi
          </a>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;


