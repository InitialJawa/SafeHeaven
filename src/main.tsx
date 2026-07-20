import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign development websocket/HMR errors behind reverse proxy
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason ? String(event.reason.message || event.reason) : '';
    if (
      reasonStr.includes('WebSocket') || 
      reasonStr.includes('websocket') || 
      reasonStr.includes('WebSocket closed') ||
      reasonStr.includes('closed without opened')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msgStr = event.message ? String(event.message) : '';
    const filename = event.filename ? String(event.filename) : '';
    if (
      msgStr.includes('WebSocket') || 
      msgStr.includes('websocket') || 
      filename.includes('vite') ||
      msgStr.includes('closed without opened')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
