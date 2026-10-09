import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConsentStoreState {
  hasDecided: boolean;
  analytics: boolean;
  advertising: boolean;
  settingsOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (preferences: { analytics: boolean; advertising: boolean }) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useConsentStore = create<ConsentStoreState>()(
  persist(
    (set) => ({
      hasDecided: false,
      analytics: false,
      advertising: false,
      settingsOpen: false,
      acceptAll: () =>
        set({ hasDecided: true, analytics: true, advertising: true, settingsOpen: false }),
      rejectOptional: () =>
        set({ hasDecided: true, analytics: false, advertising: false, settingsOpen: false }),
      savePreferences: ({ analytics, advertising }) =>
        set({ hasDecided: true, analytics, advertising, settingsOpen: false }),
      openSettings: () => set({ settingsOpen: true }),
      closeSettings: () => set({ settingsOpen: false }),
    }),
    {
      name: 'podium-consent-v1',
      partialize: (state) => ({
        hasDecided: state.hasDecided,
        analytics: state.analytics,
        advertising: state.advertising,
      }),
    },
  ),
);
