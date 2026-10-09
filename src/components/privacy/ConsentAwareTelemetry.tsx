import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useConsentStore } from '../../store/useConsentStore';

export const ConsentAwareTelemetry: React.FC = () => {
  const analyticsAllowed = useConsentStore((state) => state.hasDecided && state.analytics);

  if (!analyticsAllowed) return null;

  return (
    <>
      <Analytics mode={import.meta.env.PROD ? 'production' : 'development'} />
      <SpeedInsights sampleRate={0.2} />
    </>
  );
};
