import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#1B1B1B',
  borderBottom: '1px solid #374151',
  boxShadow: 'none',
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const Logo = styled('img')({
  height: '32px',
  width: 'auto',
});

const Header = () => {
  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar sx={{ px: 5, py: 3 }}>
        <LogoContainer sx={{ flexGrow: 1 }}>
          <Logo src="/LOGO.jpg" alt="NEXUS" />
          <Typography 
            variant="h4" 
            component="div"
            sx={{ 
              color: 'white',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            NEXUS
          </Typography>
        </LogoContainer>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9CA3AF',
              fontWeight: 400,
              cursor: 'pointer',
              '&:hover': { color: 'white' },
              transition: 'color 0.2s ease',
            }}
          >
            About
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9CA3AF',
              fontWeight: 400,
              cursor: 'pointer',
              '&:hover': { color: 'white' },
              transition: 'color 0.2s ease',
            }}
          >
            Features
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9CA3AF',
              fontWeight: 400,
              cursor: 'pointer',
              '&:hover': { color: 'white' },
              transition: 'color 0.2s ease',
            }}
          >
            Docs
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9CA3AF',
              fontWeight: 400,
              cursor: 'pointer',
              '&:hover': { color: 'white' },
              transition: 'color 0.2s ease',
            }}
          >
            Contact
          </Typography>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;


