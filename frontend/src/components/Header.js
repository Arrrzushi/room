import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Mic as MicIcon, ChatBubble as ChatBubbleIcon } from '@mui/icons-material';

const Header = ({ isVoiceMode, onVoiceToggle }) => {
  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Box
          component="img"
          src="/roomy-logo.png"
          alt="Roomy"
          sx={{
            height: 40,
            width: 40,
            mr: 2,
          }}
        />
        <Typography 
          variant="h1" 
          sx={{ 
            flexGrow: 1,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          Room
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isVoiceMode}
              onChange={onVoiceToggle}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isVoiceMode ? <MicIcon /> : <ChatBubbleIcon />}
              <Typography variant="body2">
                {isVoiceMode ? 'Voice Mode' : 'Text Mode'}
              </Typography>
            </Box>
          }
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;


