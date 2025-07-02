import React, { useRef, useState } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import { API_ENDPOINTS } from '../config';

interface UploadStepProps {
  onParsed: (parsedText: string) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onParsed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(API_ENDPOINTS.PARSE_POLICY, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to parse document');
      const data = await res.json();
      onParsed(data.parsed_text);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Upload Policy Document</Typography>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button variant="outlined" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {file ? file.name : 'Choose File'}
      </Button>
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file || uploading}
        sx={{ ml: 2 }}
      >
        Upload & Parse
      </Button>
      {uploading && <LinearProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default UploadStep; 