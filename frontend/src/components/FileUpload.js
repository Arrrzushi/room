import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const FileUpload = ({ onUpload, isUploading }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      onUpload(file);
      await axios.post(`${API_URL}/upload`, formData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  return (
    <Paper
      {...getRootProps()}
      elevation={1}
      sx={{
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {isUploading ? (
          <CircularProgress size={40} />
        ) : (
          <CloudUploadIcon
            sx={{
              fontSize: 40,
              color: 'primary.main',
            }}
          />
        )}
        <Typography variant="h6" color="textSecondary">
          {isDragActive
            ? "Drop your file here..."
            : "Drag & drop a file here, or click to select"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supports PDF and TXT files
        </Typography>
      </Box>
    </Paper>
  );
};

export default FileUpload;


