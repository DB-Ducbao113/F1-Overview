import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsightsRoute } from './components/analytics/SpeedInsightsRoute';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Analytics mode={import.meta.env.PROD ? 'production' : 'development'} />
        <SpeedInsightsRoute />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
