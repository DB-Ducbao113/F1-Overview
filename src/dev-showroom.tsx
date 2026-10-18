import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { LegacyShowroomComparison } from './dev/LegacyShowroomComparison';

if (!import.meta.env.DEV) {
  throw new Error(
    'The legacy comparison surface is available in the Vite development server only.',
  );
}

ReactDOM.createRoot(document.getElementById('dev-showroom-root')!).render(
  <React.StrictMode>
    <LegacyShowroomComparison />
  </React.StrictMode>,
);
