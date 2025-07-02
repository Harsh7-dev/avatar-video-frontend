import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

interface Metadata {
  name: string;
  position: string;
  company_name: string;
  manager_name: string;
}

interface MetadataStepProps {
  onComplete: (metadata: Metadata) => void;
  initial?: Metadata;
}

const MetadataStep: React.FC<MetadataStepProps> = ({ onComplete, initial }) => {
  const [fields, setFields] = useState<Metadata>(
    initial || { name: '', position: '', company_name: '', manager_name: '' }
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.position || !fields.company_name || !fields.manager_name) {
      setError('All fields are required');
      return;
    }
    setError(null);
    onComplete(fields);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>Enter Metadata</Typography>
      <TextField
        label="Name"
        name="name"
        value={fields.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Position"
        name="position"
        value={fields.position}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Company Name"
        name="company_name"
        value={fields.company_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Manager Name"
        name="manager_name"
        value={fields.manager_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Continue</Button>
    </Box>
  );
};

export default MetadataStep; 