import React, { useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLocation } from 'react-router-dom';
import { SpeedInsightEvent, stripQueryAndHash } from './speedInsightsRouteUtils';

export const SpeedInsightsRoute: React.FC = () => {
  const { pathname } = useLocation();
  const normalizeEvent = useCallback(
    (event: SpeedInsightEvent) => ({
      ...event,
      url: stripQueryAndHash(event.url),
      route: pathname,
    }),
    [pathname],
  );

  return <SpeedInsights route={pathname} sampleRate={1} beforeSend={normalizeEvent} />;
};
