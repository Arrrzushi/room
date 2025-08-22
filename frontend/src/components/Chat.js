import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import { Send as SendIcon, Upload as UploadIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  background: '#1a1a2e',
  border: '1px solid #334155',
  borderRadius: '12px',
  overflow: 'hidden',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  background: '#0f0f23',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#1a1a2e',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#334155',
    borderRadius: '4px',
  },
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2),
}));

const MessageContent = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  borderRadius: '16px',
  background: isUser 
    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
    : '#1a1a2e',
  color: isUser ? 'white' : '#f8fafc',
  border: isUser ? 'none' : '1px solid #334155',
  boxShadow: isUser 
    ? '0 4px 20px rgba(99, 102, 241, 0.3)' 
    : '0 2px 10px rgba(0, 0, 0, 0.2)',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: '#1a1a2e',
  borderTop: '1px solid #334155',
  display: 'flex',
  gap: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#334155',
    },
    '&:hover fieldset': {
      borderColor: '#6366f1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputBase-input': {
    color: '#f8fafc',
  },
  '& .MuiInputLabel-root': {
    color: '#94a3b8',
  },
}));

const Chat = ({ uploadedFiles }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setMessages([
        {
          id: Date.now(),
          text: `Welcome to NEXUS! I've processed ${uploadedFiles.length} document(s). Ask me anything about your documents.`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [uploadedFiles]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          language: language,
          use_voice: false,
        }),
      });

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
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
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <Box sx={{ p: 2, background: '#1a1a2e', borderBottom: '1px solid #334155' }}>
        <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 600 }}>
          Document Analysis
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          Ask NEXUS about your uploaded documents
        </Typography>
        
        {uploadedFiles.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {uploadedFiles.map((file, index) => (
              <Chip
                key={index}
                icon={<UploadIcon />}
                label={file.name}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <MessagesContainer>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
              Welcome to NEXUS
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Upload documents and start asking questions to get intelligent insights.
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ padding: 0 }}>
                <MessageBubble isUser={message.isUser}>
                  <MessageContent isUser={message.isUser}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {message.text}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: message.isUser ? 'rgba(255,255,255,0.7)' : '#64748b',
                        mt: 1,
                        display: 'block'
                      }}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </MessageContent>
                </MessageBubble>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ padding: 0 }}>
                <MessageBubble isUser={false}>
                  <MessageContent isUser={false}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      NEXUS is analyzing your request...
                    </Typography>
                  </MessageContent>
                </MessageBubble>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        )}
      </MessagesContainer>

      <InputContainer>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Ask NEXUS about your documents..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          multiline
          maxRows={3}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            px: 3,
            minWidth: 'auto',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            },
            '&:disabled': {
              background: '#334155',
              color: '#64748b',
            },
          }}
        >
          <SendIcon />
        </Button>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;


