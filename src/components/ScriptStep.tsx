import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, CircularProgress } from '@mui/material';
import { API_ENDPOINTS } from '../config';

interface ScriptStepProps {
  metadata: {
    name: string;
    position: string;
    company_name: string;
    manager_name: string;
  };
  policySummary: string;
  onComplete: (script: string, sceneInstructions: string) => void;
  initial?: { script: string; sceneInstructions: string };
}

const ScriptStep: React.FC<ScriptStepProps> = ({ metadata, policySummary, onComplete, initial }) => {
  const [script, setScript] = useState(initial?.script || '');
  const [sceneInstructions, setSceneInstructions] = useState(initial?.sceneInstructions || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!script) {
      setLoading(true);
      fetch(API_ENDPOINTS.GENERATE_SCRIPT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...metadata, policy_summary: policySummary }),
      })
        .then(res => res.json())
        .then(data => setScript(data.script))
        .catch(() => setError('Failed to generate script'))
        .finally(() => setLoading(false));
    }
  }, [metadata, policySummary, script]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!script) {
      setError('Script cannot be empty');
      return;
    }
    setError(null);
    onComplete(script, sceneInstructions);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>Script & Scene Instructions</Typography>
      <TextField
        label="Script"
        value={script}
        onChange={e => setScript(e.target.value)}
        fullWidth
        multiline
        minRows={4}
        margin="normal"
        required
      />
      <TextField
        label="Scene Instructions (one per line)"
        value={sceneInstructions}
        onChange={e => setSceneInstructions(e.target.value)}
        fullWidth
        multiline
        minRows={3}
        margin="normal"
        placeholder={"Scene 1: Welcome message\nScene 2: Policy summary..."}
      />
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Continue</Button>
    </Box>
  );
};

export default ScriptStep; 