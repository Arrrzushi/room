import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Delete,
  CheckCircle,
  Error,
} from '@mui/icons-material';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFile = async (fileInfo) => {
    const formData = new FormData();
    formData.append('file', fileInfo.file);

    try {
      setUploadProgress(prev => ({ ...prev, [fileInfo.id]: 0 }));
      
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResults(prev => [...prev, {
          id: fileInfo.id,
          success: true,
          message: result.message,
          filename: result.filename
        }]);
        
        // Update file status
        setFiles(prev => prev.map(f => 
          f.id === fileInfo.id ? { ...f, status: 'success' } : f
        ));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResults(prev => [...prev, {
        id: fileInfo.id,
        success: false,
        message: 'Upload failed. Please try again.',
        filename: fileInfo.name
      }]);
      
      // Update file status
      setFiles(prev => prev.map(f => 
        f.id === fileInfo.id ? { ...f, status: 'error' } : f
      ));
    } finally {
      setUploadProgress(prev => ({ ...prev, [fileInfo.id]: 100 }));
    }
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadResults([]);
    
    // Upload files sequentially to avoid overwhelming the server
    for (const fileInfo of files) {
      if (fileInfo.status === 'pending') {
        await uploadFile(fileInfo);
        // Small delay between uploads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setUploading(false);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadResults(prev => prev.filter(r => r.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const clearAll = () => {
    setFiles([]);
    setUploadResults([]);
    setUploadProgress({});
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <Description color="error" />;
    if (fileType.includes('text') || fileType.includes('txt')) return <Description color="primary" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <Description color="info" />;
    return <Description color="action" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      default:
        return null;
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
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📚 Upload Documents
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upload documents to chat with them. Supported formats: PDF, TXT, DOC, DOCX
        </Typography>

        {/* File Selection */}
        <Box sx={{ mb: 3 }}>
          <input
            accept=".pdf,.txt,.doc,.docx"
            style={{ display: 'none' }}
            id="file-upload"
            multiple
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
              sx={{ mb: 2 }}
            >
              Choose Files
            </Button>
          </label>
        </Box>

        {/* File List */}
        {files.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Selected Files ({files.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleUploadAll}
                  disabled={uploading || files.every(f => f.status !== 'pending')}
                  startIcon={<CloudUpload />}
                >
                  {uploading ? 'Uploading...' : 'Upload All'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearAll}
                  disabled={uploading}
                >
                  Clear All
                </Button>
              </Box>
            </Box>

            <List>
              {files.map((fileInfo) => (
                <ListItem
                  key={fileInfo.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'background.paper',
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(fileInfo.status)}
                      <IconButton
                        edge="end"
                        onClick={() => removeFile(fileInfo.id)}
                        disabled={uploading}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getFileIcon(fileInfo.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={fileInfo.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatFileSize(fileInfo.size)}
                        </Typography>
                        <Chip
                          label={fileInfo.status}
                          size="small"
                          color={
                            fileInfo.status === 'success' ? 'success' :
                            fileInfo.status === 'error' ? 'error' : 'default'
                          }
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Upload Progress */}
            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Upload Progress
                </Typography>
                {files.map((fileInfo) => (
                  <Box key={fileInfo.id} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">{fileInfo.name}</Typography>
                      <Typography variant="caption">
                        {uploadProgress[fileInfo.id] || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress[fileInfo.id] || 0}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Upload Results
            </Typography>
            {uploadResults.map((result) => (
              <Alert
                key={result.id}
                severity={result.success ? 'success' : 'error'}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  <strong>{result.filename}:</strong> {result.message}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}

        {/* Instructions */}
        {files.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <CloudUpload sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">
              No files selected
            </Typography>
            <Typography variant="body2">
              Click "Choose Files" to select documents to upload
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FileUpload;


