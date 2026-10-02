import { create } from 'zustand';
import { Language } from '../types';

interface NavigationStoreState {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

export const useNavigationStore = create<NavigationStoreState>((set) => ({
  lang: 'vi',

  setLang: (lang) => set({ lang }),
  toggleLang: () => set((state) => ({ lang: state.lang === 'vi' ? 'en' : 'vi' })),
}));
