import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { API_ENDPOINTS } from '../config';

interface AvatarVoiceStepProps {
  onComplete: (avatarId: string, voiceId: string) => void;
  initial?: { avatarId: string; voiceId: string };
}

const AvatarVoiceStep: React.FC<AvatarVoiceStepProps> = ({ onComplete, initial }) => {
  const [avatars, setAvatars] = useState<{ id: string; name: string }[]>([]);
  const [voices, setVoices] = useState<{ id: string; name: string }[]>([]);
  const [avatarId, setAvatarId] = useState(initial?.avatarId || '');
  const [voiceId, setVoiceId] = useState(initial?.voiceId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [avatarsRes, voicesRes] = await Promise.all([
          fetch(API_ENDPOINTS.AVATARS),
          fetch(API_ENDPOINTS.VOICES),
        ]);
        const avatarsData = await avatarsRes.json();
        const voicesData = await voicesRes.json();
        setAvatars(avatarsData.avatars || []);
        setVoices(voicesData.voices || []);
      } catch (err: any) {
        setError('Failed to fetch avatars or voices');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarId || !voiceId) {
      setError('Please select both avatar and voice');
      return;
    }
    setError(null);
    onComplete(avatarId, voiceId);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>Select Avatar & Voice</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="avatar-label">Avatar</InputLabel>
        <Select
          labelId="avatar-label"
          value={avatarId}
          label="Avatar"
          onChange={e => setAvatarId(e.target.value)}
          required
        >
          {avatars.map(a => (
            <MenuItem key={a.id} value={a.id}>{a.name || a.id}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="voice-label">Voice</InputLabel>
        <Select
          labelId="voice-label"
          value={voiceId}
          label="Voice"
          onChange={e => setVoiceId(e.target.value)}
          required
        >
          {voices.map(v => (
            <MenuItem key={v.id} value={v.id}>{v.name || v.id}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Continue</Button>
    </Box>
  );
};

export default AvatarVoiceStep; 