import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const IntroContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#1B1B1B',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const VideoBackground = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 1,
  opacity: 0.3,
});

const ContentOverlay = styled(Box)({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: '800px',
  padding: '0 20px',
});

const Intro = ({ onEnter }) => {
  return (
    <IntroContainer>
      <VideoBackground autoPlay muted loop>
        <source src="/uploads/INTRO.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>
      
      <ContentOverlay>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '5rem' },
            fontWeight: 900,
            color: 'white',
            mb: 3,
            letterSpacing: '0.1em',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
          }}
        >
          NEXUS
        </Typography>
        
        <Typography
          variant="h4"
          sx={{
            color: '#9CA3AF',
            fontWeight: 400,
            mb: 6,
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.4,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          }}
        >
          Upload & Analyze Documents Intelligently
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            color: '#6B7280',
            fontWeight: 300,
            mb: 8,
            maxWidth: '500px',
            mx: 'auto',
            lineHeight: 1.6,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          }}
        >
          A minimal, modern way to get insights from your files.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={onEnter}
          sx={{
            background: 'white',
            color: 'black',
            px: 8,
            py: 3,
            fontSize: '1.2rem',
            fontWeight: 700,
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: '#E5E7EB',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          Get Started
        </Button>
      </ContentOverlay>
    </IntroContainer>
  );
};

export default Intro;
