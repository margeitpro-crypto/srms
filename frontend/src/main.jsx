import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './router/AppRouter';
import './styles/index.css';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { observeCoreWebVitals, addResourceHints } from './utils/performance.js';

// Performance optimizations
if (typeof window !== 'undefined') {
  observeCoreWebVitals();

  // Add resource hints for critical resources
  addResourceHints([
    { type: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { type: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { type: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      type: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: true,
    },
  ]);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnReconnect: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ToastProvider>
            <BrowserRouter
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <AppRouter />
            </BrowserRouter>
          </ToastProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
