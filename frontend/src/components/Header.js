import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)',
  borderBottom: '1px solid #334155',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 900,
  letterSpacing: '0.1em',
  textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
}));

const Header = () => {
  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <LogoText variant="h4" component="div">
            NEXUS
          </LogoText>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              ml: 2, 
              color: '#94a3b8',
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}
          >
            Intelligent Document Analysis Platform
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              fontWeight: 400,
              letterSpacing: '0.05em'
            }}
          >
            "NEXUS for your queries"
          </Typography>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;


