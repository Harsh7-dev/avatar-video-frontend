import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Card, AppBar, Toolbar, CssBaseline, ThemeProvider, createTheme, Fade } from '@mui/material';
import UploadStep from './components/UploadStep';
import MetadataStep from './components/MetadataStep';
import AvatarVoiceStep from './components/AvatarVoiceStep';
import ScriptStep from './components/ScriptStep';
import GenerateStep from './components/GenerateStep';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import FaceIcon from '@mui/icons-material/Face';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import type { StepIconProps } from '@mui/material';

const steps = [
  { label: 'Upload Policy Document', icon: <CloudUploadIcon /> },
  { label: 'Enter Metadata', icon: <InfoIcon /> },
  { label: 'Select Avatar & Voice', icon: <FaceIcon /> },
  { label: 'Script & Scene Instructions', icon: <EditNoteIcon /> },
  { label: 'Generate Video', icon: <MovieCreationIcon /> },
];

const theme = createTheme({
  palette: {
    primary: { main: '#5b21b6' }, // deep purple
    secondary: { main: '#06b6d4' }, // cyan
    background: { default: '#f4f7fa' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h3: { fontWeight: 800 },
    h5: { fontWeight: 700 },
  },
});

function StepIconComponent(props: StepIconProps) {
  const { active, completed, icon } = props;
  const stepIdx = Number(icon) - 1;
  return (
    <Box color={active || completed ? 'primary.main' : 'grey.400'}>
      {steps[stepIdx].icon}
    </Box>
  );
}

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [policySummary, setPolicySummary] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [avatarId, setAvatarId] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [script, setScript] = useState('');
  const [sceneInstructions, setSceneInstructions] = useState('');

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const stepComponents = [
    <UploadStep key={0} onParsed={(parsed) => { setPolicySummary(parsed); handleNext(); }} />,
    <MetadataStep key={1} onComplete={(data) => { setMetadata(data); handleNext(); }} initial={metadata} />,
    <AvatarVoiceStep key={2} onComplete={(a, v) => { setAvatarId(a); setVoiceId(v); handleNext(); }} initial={{ avatarId, voiceId }} />,
    <ScriptStep
      key={3}
      metadata={metadata}
      policySummary={policySummary}
      onComplete={(s, si) => { setScript(s); setSceneInstructions(si); handleNext(); }}
      initial={{ script, sceneInstructions }}
    />,
    <GenerateStep
      key={4}
      metadata={metadata}
      avatarId={avatarId}
      voiceId={voiceId}
      script={script}
      sceneInstructions={sceneInstructions}
      policySummary={policySummary}
    />,
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 100%)', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ background: 'none', boxShadow: 'none', pt: 2 }}>
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'primary.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                <MovieCreationIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography variant="h4" fontWeight={800} color="primary.main" letterSpacing={1}>
                AI Avatar Video Generator
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', minHeight: '90vh' }}>
          <Card elevation={8} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 6, width: '100%', maxWidth: 500, background: 'rgba(255,255,255,0.97)', boxShadow: '0 8px 32px rgba(90, 90, 200, 0.10)' }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                Welcome to the Future of Personalized Video
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Instantly generate AI avatar videos from your policy documents. Upload, customize, and get a professional video in minutes.
              </Typography>
            </Box>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((step, idx) => (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={StepIconComponent}>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Fade in timeout={400} key={activeStep}>
              <Box sx={{ flex: 1, mb: 3, minHeight: { xs: 240, md: 320 } }}>{stepComponents[activeStep]}</Box>
            </Fade>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button fullWidth disabled={activeStep === 0} onClick={handleBack} variant="outlined" color="primary" sx={{ fontWeight: 700, py: 1.5, mr: 2 }}>
                Back
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
