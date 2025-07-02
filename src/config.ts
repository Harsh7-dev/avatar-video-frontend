// API configuration
const API_BASE_URL = 'https://avatar-video-backend-production.up.railway.app';

// API endpoints
export const API_ENDPOINTS = {
  AVATARS: `${API_BASE_URL}/avatars`,
  VOICES: `${API_BASE_URL}/voices`,
  PARSE_POLICY: `${API_BASE_URL}/parse-policy`,
  GENERATE_SCRIPT: `${API_BASE_URL}/generate-script`,
  GENERATE_VIDEO: `${API_BASE_URL}/generate-video`,
  VIDEO_STATUS: `${API_BASE_URL}/video-status`,
} as const; 