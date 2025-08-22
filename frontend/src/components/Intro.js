import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Fade,
  Slide
} from '@mui/material';
import { styled } from '@mui/material/styles';

const IntroContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none'
  }
}));

const GlowText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #f59e0b, #ef4444)',
  backgroundSize: '300% 300%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'gradientShift 3s ease-in-out infinite',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  }
}));

const FloatingElement = styled(Box)(({ theme, delay }) => ({
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
  borderRadius: '50%',
  animation: `float 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: 0.7 },
    '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: 1 }
  }
}));

const Intro = ({ onEnter }) => {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowButton(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleEnter = () => {
    onEnter();
  };

  return (
    <IntroContainer>
      {/* Floating elements */}
      <FloatingElement style={{ top: '20%', left: '15%', delay: 0 }} />
      <FloatingElement style={{ top: '30%', right: '20%', delay: 1 }} />
      <FloatingElement style={{ bottom: '25%', left: '25%', delay: 2 }} />
      <FloatingElement style={{ bottom: '35%', right: '15%', delay: 3 }} />
      
      <Container maxWidth="md">
        <Box textAlign="center" position="relative" zIndex={1}>
          {/* Main Title */}
          <Slide direction="down" in={showContent} timeout={1000}>
            <Box mb={4}>
              <GlowText
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '5rem' },
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  mb: 2,
                  textShadow: '0 0 30px rgba(99, 102, 241, 0.5)'
                }}
              >
                NEXUS
              </GlowText>
              
              <Typography
                variant="h4"
                sx={{
                  color: '#94a3b8',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  mb: 1
                }}
              >
                INTELLIGENT DOCUMENT ANALYSIS
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  fontWeight: 400,
                  letterSpacing: '0.1em'
                }}
              >
                PLATFORM
              </Typography>
            </Box>
          </Slide>

          {/* Subtitle */}
          <Fade in={showContent} timeout={1500}>
            <Typography
              variant="h6"
              sx={{
                color: '#cbd5e1',
                fontWeight: 400,
                letterSpacing: '0.05em',
                mb: 6,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Where intelligence meets your documents. A sophisticated AI-powered platform 
              designed for professionals who demand excellence in document analysis and insights.
            </Typography>
          </Fade>

          {/* Slogan */}
          <Fade in={showContent} timeout={2000}>
            <Typography
              variant="h5"
              sx={{
                color: '#8b5cf6',
                fontWeight: 600,
                letterSpacing: '0.1em',
                mb: 8,
                fontStyle: 'italic'
              }}
            >
              "NEXUS for your queries"
            </Typography>
          </Fade>

          {/* Enter Button */}
          <Fade in={showButton} timeout={1000}>
            <Button
              variant="contained"
              size="large"
              onClick={handleEnter}
              sx={{
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                borderRadius: '50px',
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)'
                }
              }}
            >
              ENTER PLATFORM
            </Button>
          </Fade>
        </Box>
      </Container>

      {/* Bottom text */}
      <Fade in={showContent} timeout={2500}>
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            bottom: '2rem',
            color: '#64748b',
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}
        >
          THANKS FOR WATCHING
        </Typography>
      </Fade>
    </IntroContainer>
  );
};

export default Intro;
