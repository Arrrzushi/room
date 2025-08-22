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
  padding: theme.spacing(3),
  background: '#1a1a2e',
  border: '2px dashed #334155',
  borderRadius: '12px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#6366f1',
    background: '#16213e',
  },
  '&.drag-active': {
    borderColor: '#8b5cf6',
    background: '#16213e',
    transform: 'scale(1.02)',
  },
}));

const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: '4rem',
  color: '#6366f1',
  marginBottom: theme.spacing(2),
}));

const FileList = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: '#1a1a2e',
  border: '1px solid #334155',
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
    if (fileType.includes('pdf')) return <DescriptionIcon sx={{ color: '#ef4444' }} />;
    if (fileType.includes('word') || fileType.includes('document')) return <DescriptionIcon sx={{ color: '#3b82f6' }} />;
    return <DescriptionIcon sx={{ color: '#10b981' }} />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon sx={{ color: '#10b981' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#ef4444' }} />;
      default:
        return <CircularProgress size={20} sx={{ color: '#6366f1' }} />;
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
        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 1, fontWeight: 600 }}>
          {isDragActive ? 'Drop files here' : 'Upload Documents'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
          Drag & drop your documents here, or click to browse
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          Supported formats: PDF, TXT, DOC, DOCX
        </Typography>
        
        {uploading && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CircularProgress size={20} sx={{ color: '#6366f1' }} />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Processing documents...
            </Typography>
          </Box>
        )}
      </UploadContainer>

      {uploadedFiles.length > 0 && (
        <FileList>
          <Box sx={{ p: 2, background: '#16213e', borderBottom: '1px solid #334155' }}>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 600 }}>
              Uploaded Documents
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              {uploadedFiles.filter(f => f.status === 'success').length} document(s) ready for analysis
            </Typography>
          </Box>
          
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  borderBottom: index < uploadedFiles.length - 1 ? '1px solid #334155' : 'none',
                  '&:hover': {
                    background: '#16213e',
                  },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(file.name)}
                    sx={{ color: '#64748b' }}
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
                    <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {formatFileSize(file.size)}
                      </Typography>
                      <Chip
                        label={file.status === 'success' ? 'Ready' : 'Failed'}
                        size="small"
                        icon={getStatusIcon(file.status)}
                        sx={{
                          background: file.status === 'success' 
                            ? 'linear-gradient(135deg, #10b981, #059669)' 
                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
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
            background: '#1e293b',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            '& .MuiAlert-icon': {
              color: '#ef4444',
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


