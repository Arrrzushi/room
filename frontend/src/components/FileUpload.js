import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const UploadContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: '#242424',
  border: '2px dashed #374151',
  borderRadius: '12px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  height: '224px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    borderColor: '#6B7280',
    background: '#1F1F1F',
  },
  '&.drag-active': {
    borderColor: '#9CA3AF',
    background: '#1F1F1F',
  },
}));

const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: '3rem',
  color: '#6B7280',
  marginBottom: theme.spacing(2),
}));

const FileList = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: '#242424',
  border: '1px solid #374151',
  borderRadius: '12px',
  overflow: 'hidden',
}));

const FileUpload = ({ onFilesUploaded }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const newFiles = [];
    const newStatus = {};

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          newFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'success',
            message: result.message,
          });
          newStatus[file.name] = 'success';
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          message: 'Upload failed. Please try again.',
        });
        newStatus[file.name] = 'error';
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setUploadStatus(prev => ({ ...prev, ...newStatus }));
    setUploading(false);

    if (newFiles.some(f => f.status === 'success')) {
      onFilesUploaded(newFiles.filter(f => f.status === 'success'));
    }
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const removeFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <DescriptionIcon sx={{ color: '#EF4444' }} />;
    if (fileType.includes('word') || fileType.includes('document')) return <DescriptionIcon sx={{ color: '#3B82F6' }} />;
    return <DescriptionIcon sx={{ color: '#10B981' }} />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon sx={{ color: '#10B981' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#EF4444' }} />;
      default:
        return <CircularProgress size={20} sx={{ color: '#6B7280' }} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <UploadContainer
        {...getRootProps()}
        className={isDragActive ? 'drag-active' : ''}
        sx={{ opacity: uploading ? 0.7 : 1 }}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        <Typography variant="h6" sx={{ color: '#6B7280', mb: 1, fontWeight: 500 }}>
          {isDragActive ? 'Drop files here' : 'Drop Files Here'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          Supported formats: PDF, TXT, DOC, DOCX
        </Typography>
        
        {uploading && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CircularProgress size={20} sx={{ color: '#6B7280' }} />
            <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              Processing...
            </Typography>
          </Box>
        )}
      </UploadContainer>

      {uploadedFiles.length > 0 && (
        <FileList>
          <Box sx={{ p: 2, background: '#1F1F1F', borderBottom: '1px solid #374151' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Uploaded Documents
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.5, fontSize: '0.875rem' }}>
              {uploadedFiles.filter(f => f.status === 'success').length} document(s) ready for analysis
            </Typography>
          </Box>
          
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  borderBottom: index < uploadedFiles.length - 1 ? '1px solid #374151' : 'none',
                  '&:hover': {
                    background: '#1F1F1F',
                  },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(file.name)}
                    sx={{ color: '#6B7280' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {getFileIcon(file.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                        {formatFileSize(file.size)}
                      </Typography>
                      <Chip
                        label={file.status === 'success' ? 'Ready' : 'Failed'}
                        size="small"
                        icon={getStatusIcon(file.status)}
                        sx={{
                          background: file.status === 'success' 
                            ? '#10B981' 
                            : '#EF4444',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </FileList>
      )}

      {uploadedFiles.some(f => f.status === 'error') && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            background: '#1F1F1F',
            border: '1px solid #EF4444',
            color: '#FCA5A5',
            '& .MuiAlert-icon': {
              color: '#EF4444',
            },
          }}
        >
          Some files failed to upload. Please check the file format and try again.
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;


