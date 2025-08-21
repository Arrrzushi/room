import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './theme';
import Chat from './components/Chat';
import Header from './components/Header';
import FileUpload from './components/FileUpload';

function App() {
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleNewMessage = (message) => {
    setMessages([...messages, message]);
  };

  const handleFileUpload = (file) => {
    setIsUploading(true);
    // Handle file upload logic here
    setIsUploading(false);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <Header 
          isVoiceMode={isVoiceMode} 
          onVoiceToggle={toggleVoiceMode}
        />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            gap: 2,
          }}
        >
          <FileUpload 
            onUpload={handleFileUpload}
            isUploading={isUploading}
          />
          <Chat 
            messages={messages}
            onNewMessage={handleNewMessage}
            isVoiceMode={isVoiceMode}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;


