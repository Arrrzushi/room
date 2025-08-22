import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Send, Mic, MicOff, Language } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Chat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Roomy, your cute AI assistant! 🏠 I can help you chat with your documents. Upload a document and start asking questions!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [useVoice, setUseVoice] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          language: selectedLanguage,
          use_voice: useVoice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
          voice_url: data.voice_url,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble right now. Please try again! 😅",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setUseVoice(!useVoice);
  };

  const getLanguageLabel = (lang) => {
    return lang === 'en' ? 'English' : 'Hindi';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Language and Voice Controls */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip
          icon={<Language />}
          label={getLanguageLabel(selectedLanguage)}
          onClick={() => setSelectedLanguage(selectedLanguage === 'en' ? 'hi' : 'en')}
          color="primary"
          variant="outlined"
        />
        <IconButton
          onClick={toggleVoice}
          color={useVoice ? 'primary' : 'default'}
          title={useVoice ? 'Voice enabled' : 'Voice disabled'}
        >
          {useVoice ? <Mic /> : <MicOff />}
        </IconButton>
        {useVoice && (
          <Typography variant="caption" color="text.secondary">
            Voice features coming soon!
          </Typography>
        )}
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                backgroundColor: message.sender === 'user' 
                  ? theme.palette.primary.main 
                  : theme.palette.background.paper,
                color: message.sender === 'user' 
                  ? theme.palette.primary.contrastText 
                  : theme.palette.text.primary,
                borderRadius: 3,
                position: 'relative',
              }}
            >
              {message.sender === 'ai' && (
                <Avatar
                  src="/roomy-avatar.svg"
                  alt="Roomy"
                  sx={{
                    width: 24,
                    height: 24,
                    position: 'absolute',
                    top: -12,
                    left: -12,
                    bgcolor: 'primary.main',
                  }}
                />
              )}
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.text}
              </Typography>
              {message.voice_url && (
                <Box sx={{ mt: 1 }}>
                  <audio controls src={message.voice_url} style={{ width: '100%' }} />
                </Box>
              )}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  opacity: 0.7,
                  textAlign: 'right',
                }}
              >
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Roomy is thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me anything in ${getLanguageLabel(selectedLanguage)}...`}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            sx={{
              borderRadius: 3,
              minWidth: 56,
              height: 40,
            }}
          >
            <Send />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;


