import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// InfraLens Japan — frontend build config.
// Kept minimal for now; adjusted later if deployment (S3 + CloudFront) needs a base path.
export default defineConfig({
  plugins: [react()],
});
