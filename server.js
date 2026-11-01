import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

// Failsafe auto-build: Ensure dist/index.html exists upon container startup
if (!fs.existsSync(indexPath)) {
  console.log('[Production Server] dist/index.html not detected. Running npm run build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('[Production Server] Build completed successfully.');
  } catch (err) {
    console.error('[Production Server] Warning: Build step failed during startup:', err);
  }
}

// Health check endpoints for Google Cloud Run deployment checks
app.get(['/healthz', '/health', '/_health', '/ping'], (req, res) => {
  res.status(200).send('OK');
});

// Serve static assets from dist
app.use(express.static(distDir, {
  maxAge: '1d',
  index: false,
}));

// SPA fallback for all web routes
app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    const rootIndex = path.join(__dirname, 'index.html');
    if (fs.existsSync(rootIndex)) {
      res.sendFile(rootIndex);
    } else {
      res.status(200).send('<!doctype html><html><head><title>Atelier Jastip</title></head><body><div id="root">Atelier Jastip is starting...</div></body></html>');
    }
  }
});

// Global error handler to prevent process crashes
app.use((err, req, res, next) => {
  console.error('[Production Server Error]', err);
  if (!res.headersSent) {
    res.status(200).send('<!doctype html><html><body><div id="root">Loading Atelier Jastip...</div></body></html>');
  }
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Atelier Jastip production server listening on 0.0.0.0:${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
