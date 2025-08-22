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
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import { Send as SendIcon, Upload as UploadIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)(({ theme }) => ({
  background: '#242424',
  border: '1px solid #374151',
  borderRadius: '12px',
  height: '80vh', // Use viewport height to make it much bigger
  minHeight: '600px', // Minimum height fallback
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  background: '#1F1F1F',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#242424',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#374151',
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
  borderRadius: '12px',
  background: isUser ? 'white' : '#374151',
  color: isUser ? 'black' : 'white',
  border: isUser ? 'none' : '1px solid #4B5563',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: '#1F1F1F',
  borderTop: '1px solid #374151',
  display: 'flex',
  gap: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#374151',
    },
    '&:hover fieldset': {
      borderColor: '#6B7280',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9CA3AF',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: '#9CA3AF',
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

  // Function to format AI responses for better readability
  const formatAIResponse = (text) => {
    if (!text) return text;
    
    // Add line breaks before bullet points and numbered lists
    let formatted = text
      .replace(/(\d+\.\s)/g, '\n$1') // Add line break before numbered lists
      .replace(/([-•]\s)/g, '\n$1') // Add line break before bullet points
      .replace(/(\*\*[^*]+\*\*)/g, '\n$1') // Add line break before bold text
      .replace(/(##\s)/g, '\n\n$1') // Add double line break before headers
      .replace(/(\n\s*\n)/g, '\n\n') // Clean up multiple line breaks
      .trim();
    
    return formatted;
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
      <Box sx={{ p: 2, background: '#1F1F1F', borderBottom: '1px solid #374151' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Document Analysis
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.5, fontSize: '0.875rem' }}>
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
                  background: 'white',
                  color: 'black',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <MessagesContainer>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#9CA3AF', mb: 1 }}>
              Welcome to NEXUS
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Upload documents and start asking questions to get intelligent insights.
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ padding: 0 }}>
                <MessageBubble isUser={message.isUser}>
                  <MessageContent isUser={message.isUser}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: '0.875rem', whiteSpace: 'pre-line' }}>
                      {message.isUser ? message.text : formatAIResponse(message.text)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: message.isUser ? 'rgba(0,0,0,0.6)' : '#9CA3AF',
                        mt: 1,
                        display: 'block',
                        fontSize: '0.75rem',
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
                    <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
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
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{
            background: 'white',
            color: 'black',
            px: 3,
            minWidth: 'auto',
            borderRadius: '8px',
            '&:hover': {
              background: '#E5E7EB',
            },
            '&:disabled': {
              background: '#374151',
              color: '#6B7280',
            },
          }}
        >
          ➤
        </Button>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;


