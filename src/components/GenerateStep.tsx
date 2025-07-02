import React, { useState } from 'react';
import { Box, Button, Typography, LinearProgress, Link, FormControl, InputLabel, Select, MenuItem, TextField, Switch, FormControlLabel } from '@mui/material';
import { API_ENDPOINTS } from '../config';

interface GenerateStepProps {
  metadata: {
    name: string;
    position: string;
    company_name: string;
    manager_name: string;
  };
  avatarId: string;
  voiceId: string;
  script: string;
  sceneInstructions: string;
  policySummary: string;
}

// Add background options
const BACKGROUND_OPTIONS = [
  { value: 'green_screen', label: 'Transparent: Green Screen' },
  { value: 'off_white', label: 'Solid: Off White' },
  { value: 'warm_white', label: 'Solid: Warm White' },
  { value: 'light_pink', label: 'Solid: Light Pink' },
  { value: 'soft_pink', label: 'Solid: Soft Pink' },
  { value: 'light_blue', label: 'Solid: Light Blue' },
  { value: 'dark_blue', label: 'Solid: Dark Blue' },
  { value: 'soft_cyan', label: 'Solid: Soft Cyan' },
  { value: 'strong_cyan', label: 'Solid: Strong Cyan' },
  { value: 'light_orange', label: 'Solid: Light Orange' },
  { value: 'soft_orange', label: 'Solid: Soft Orange' },
  { value: 'white_studio', label: 'Image: White Studio' },
  { value: 'white_cafe', label: 'Image: White Cafe' },
  { value: 'luxury_lobby', label: 'Image: Luxury Lobby' },
  { value: 'large_window', label: 'Image: Large Window' },
  { value: 'white_meeting_room', label: 'Image: White Meeting Room' },
  { value: 'open_office', label: 'Image: Open Office' },
];

const GenerateStep: React.FC<GenerateStepProps> = ({ metadata, avatarId, voiceId, script, sceneInstructions, policySummary }) => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'polling' | 'done' | 'error'>('idle');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState('green_screen');
  const [title, setTitle] = useState(`Welcome Video for ${metadata.name}`);
  const [test, setTest] = useState(true);
  const [visibility, setVisibility] = useState('private');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus('generating');
    setError(null);
    try {
      // First, generate proper scenes using the script template service
      const scriptRes = await fetch(API_ENDPOINTS.GENERATE_SCRIPT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...metadata, 
          policy_summary: policySummary,
          avatar_id: avatarId,
          voice_id: voiceId
        }),
      });
      
      if (!scriptRes.ok) throw new Error('Failed to generate script');
      const scriptData = await scriptRes.json();
      
      // Use the generated script to create scenes
      const scriptLines = scriptData.script.split('\n\n').filter((line: string) => line.trim());
      const input = scriptLines.map((scriptText: string) => ({
        scriptText: scriptText.trim(),
        avatar: avatarId,
        voice: voiceId,
        background: background,
      }));
      
      if (input.length === 0) {
        setError('No script content generated.');
        setStatus('error');
        return;
      }
      
      const res = await fetch(API_ENDPOINTS.GENERATE_VIDEO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          input,
          test,
          visibility,
          aspectRatio,
          output_format: outputFormat,
        }),
      });
      if (!res.ok) throw new Error('Failed to start video generation');
      const data = await res.json();
      setVideoId(data.id);
      setStatus('polling');
      pollStatus(data.id);
    } catch (err: any) {
      setError(err.message || 'Video generation failed');
      setStatus('error');
    }
  };

  const pollStatus = async (id: string) => {
    if (!id || id === 'undefined') {
      setError('Invalid video ID received');
      setStatus('error');
      return;
    }
    
    let tries = 0;
    const poll = async () => {
      tries++;
      if (tries > 60) {
        setError('Video generation timed out');
        setStatus('error');
        return;
      }
      try {
        const res = await fetch(`${API_ENDPOINTS.VIDEO_STATUS}/${id}`);
        const data = await res.json();
        // Set thumbnail if available
        if (data.thumbnail && data.thumbnail.image) {
          setThumbnailUrl(data.thumbnail.image);
        }
        if (data.status === 'complete') {
          setDownloadUrl(data.download_url);
          setStatus('done');
        } else {
          setTimeout(poll, 5000);
        }
      } catch {
        setTimeout(poll, 5000);
      }
    };
    poll();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Generate Video</Typography>
      <TextField
        label="Video Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="background-label">Background</InputLabel>
        <Select
          labelId="background-label"
          value={background}
          label="Background"
          onChange={e => setBackground(e.target.value)}
        >
          {BACKGROUND_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="visibility-label">Visibility</InputLabel>
        <Select
          labelId="visibility-label"
          value={visibility}
          label="Visibility"
          onChange={e => setVisibility(e.target.value)}
        >
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="public">Public</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="aspect-ratio-label">Aspect Ratio</InputLabel>
        <Select
          labelId="aspect-ratio-label"
          value={aspectRatio}
          label="Aspect Ratio"
          onChange={e => setAspectRatio(e.target.value)}
        >
          <MenuItem value="16:9">16:9</MenuItem>
          <MenuItem value="1:1">1:1</MenuItem>
          <MenuItem value="9:16">9:16</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="output-format-label">Output Format</InputLabel>
        <Select
          labelId="output-format-label"
          value={outputFormat}
          label="Output Format"
          onChange={e => setOutputFormat(e.target.value)}
        >
          <MenuItem value="mp4">MP4</MenuItem>
          <MenuItem value="mov">MOV</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Switch checked={test} onChange={e => setTest(e.target.checked)} />}
        label="Test Video (free, watermark)"
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleGenerate} disabled={status === 'generating' || status === 'polling' || status === 'done'} sx={{ mt: 2 }}>
        Generate Video
      </Button>
      {(status === 'generating' || status === 'polling') && <LinearProgress sx={{ mt: 2 }} />}
      {status === 'polling' && thumbnailUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Your video is being generated...</Typography>
          <img src={thumbnailUrl} alt="Video thumbnail" style={{ maxWidth: '100%', borderRadius: 8 }} />
        </Box>
      )}
      {status === 'done' && downloadUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography>Video is ready:</Typography>
          <Link href={downloadUrl} target="_blank" rel="noopener">Download Video</Link>
        </Box>
      )}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default GenerateStep; 