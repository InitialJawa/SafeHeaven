import React, { StrictMode, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { auth } from './lib/firebase';

const originalFetch = window.fetch;
window.appFetch = async (...args: [RequestInfo | URL, RequestInit?]) => {
  let [resource, config] = args;
  
  let isApiCall = false;
  if (typeof resource === 'string' && resource.includes('/api/')) {
    isApiCall = true;
  } else if (resource instanceof Request && resource.url.includes('/api/')) {
    isApiCall = true;
  }
  
  if (isApiCall && auth?.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (typeof resource === 'string') {
         config = config || {};
         config.headers = {
           ...config.headers,
           'Authorization': `Bearer ${token}`
         };
         args = [resource, config];
      } else {
         const newReq = new Request(resource, config);
         newReq.headers.set('Authorization', `Bearer ${token}`);
         args = [newReq];
      }
    } catch(e) {
      console.warn('Failed to attach auth token:', e);
    }
  }
  return originalFetch(args[0], args[1]);
};

declare global {
  interface Window {
    appFetch: typeof fetch;
  }
}




interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught app error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0a10] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan Aplikasi</h1>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Aplikasi mengalami kesalahan saat memuat tampilan. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-[#ccff00] text-black font-semibold text-sm hover:bg-[#b8e600] transition-colors"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      msgStr.includes('closed without opened') ||
      msgStr.includes('ResizeObserver')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
