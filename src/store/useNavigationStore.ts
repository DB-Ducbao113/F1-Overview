import { create } from 'zustand';
import { NavTab, Language, TeamId } from '../types';
import { useCollectionStore } from './useCollectionStore';

interface NavigationStoreState {
  activeTab: NavTab;
  lang: Language;

  setActiveTab: (tab: NavTab) => void;
  navigateToTeamCollection: (teamId: TeamId) => void;
  viewCarDetail: (carId: string) => void;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

export const useNavigationStore = create<NavigationStoreState>((set) => ({
  activeTab: 'home',
  lang: 'vi',

  setActiveTab: (tab) => set({ activeTab: tab }),

  navigateToTeamCollection: (teamId: TeamId) => {
    useCollectionStore.getState().selectTeam(teamId);
    set({ activeTab: 'collection' });
  },

  viewCarDetail: (carId: string) => {
    // Maps car id (e.g. 'sf24', 'rb20', 'w15', 'cadillac-ct6r') to team in collection
    const teamMap: Record<string, TeamId> = {
      sf24: 'ferrari',
      mcl38: 'mclaren',
      rb20: 'redbull',
      w15: 'mercedes',
      amr25: 'astonmartin',
      a525: 'alpine',
      vcarb02: 'racingbulls',
      vf25: 'haas',
      fw47: 'williams',
      c45: 'audi',
      'cadillac-ct6r': 'cadillac',
    };
    const teamId = teamMap[carId] || 'ferrari';
    useCollectionStore.getState().selectTeam(teamId);
    set({ activeTab: 'collection' });
  },

  setLang: (lang) => set({ lang }),
  toggleLang: () => set((state) => ({ lang: state.lang === 'vi' ? 'en' : 'vi' })),
}));

