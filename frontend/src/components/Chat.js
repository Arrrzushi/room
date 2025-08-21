import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Chat = ({ messages, onNewMessage, isVoiceMode }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    onNewMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ask`, {
        text: input,
        use_voice: isVoiceMode,
      });

      const aiMessage = {
        type: 'ai',
        content: response.data.text,
        audio_url: response.data.audio_url,
        timestamp: new Date(),
      };

      onNewMessage(aiMessage);

      if (isVoiceMode && response.data.audio_url) {
        const audio = new Audio(response.data.audio_url);
        audio.play();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      onNewMessage({
        type: 'error',
        content: 'Sorry, I had trouble processing that request.',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks);
        const formData = new FormData();
        formData.append('audio', audioBlob);

        setIsLoading(true);
        try {
          const response = await axios.post(`${API_URL}/voice`, formData);
          onNewMessage({
            type: 'ai',
            content: response.data.text,
            audio_url: response.data.audio_url,
            timestamp: new Date(),
          });

          if (response.data.audio_url) {
            const audio = new Audio(response.data.audio_url);
            audio.play();
          }
        } catch (error) {
          console.error('Error processing voice:', error);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const MessageBubble = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        mb: 2,
        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
      }}
    >
      {message.type === 'ai' && (
        <Avatar
          src="/roomy-avatar.png"
          alt="Roomy"
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
          }}
        />
      )}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: message.type === 'user' ? 'primary.light' : 'background.paper',
          borderRadius: 4,
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
      {message.type === 'user' && (
        <Avatar sx={{ bgcolor: 'secondary.main' }}>You</Avatar>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading || isRecording}
        />
        {isVoiceMode && (
          <IconButton
            color={isRecording ? 'error' : 'primary'}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
          >
            {isRecording ? <StopIcon /> : <MicIcon />}
          </IconButton>
        )}
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={isLoading || isRecording || !input.trim()}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
};

export default Chat;


