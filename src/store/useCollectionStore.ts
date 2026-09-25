import { create } from 'zustand';
import { TeamId, CollectionCategory, CollectionItem, SubmissionStatus } from '../types';
import { COLLECTION_ITEMS } from '../data/collections';

// LocalStorage Keys for persistence
const STORAGE_APPROVED_KEY = 'f1_community_approved_items_v1';
const STORAGE_PENDING_KEY = 'f1_community_pending_items_v1';
const STORAGE_LIKES_KEY = 'f1_community_user_likes_v1';

// Seed sample approved community contributors onto default items if missing
const INITIAL_APPROVED_ITEMS: CollectionItem[] = COLLECTION_ITEMS.map((item, idx) => {
  const sampleContributors = ['@baobungbu', '@f1fan', '@racingarchive', '@paddocklens', '@speedhunter'];
  return {
    ...item,
    uploadedBy: item.uploadedBy || sampleContributors[idx % sampleContributors.length],
    status: item.status || 'approved',
    licenseType: item.licenseType || 'CC BY 4.0 (Community Editorial)',
    copyrightConfirmed: true,
    createdAt: item.createdAt || '2026-09-25',
  };
});

// Seed sample pending items for Admin Moderation preview
const SAMPLE_PENDING_ITEMS: CollectionItem[] = [
  {
    id: 'pending-ferrari-monza-fan',
    teamId: 'ferrari',
    season: 2026,
    publishedAt: '25/09/2026',
    category: 'race',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    titleVi: 'Ferrari SF-24 Xuất Phát Tại Monza',
    titleEn: 'Ferrari SF-24 Launch at Monza Paddock',
    captionVi: 'Ảnh góc nhìn từ khán đài Rettifilo Tribuna do tôi tự chụp trong chuyến đi Monza vừa qua.',
    captionEn: 'Personal photo taken from Rettifilo grandstand during my Monza GP weekend trip.',
    photographer: 'Bao Duc (Personal Archive)',
    source: 'Personal Photography Submission',
    license: 'CC BY 4.0',
    licenseType: 'Personal photograph',
    creditRequired: true,
    accentColor: '#e80020',
    uploadedBy: '@baobungbu',
    status: 'pending',
    copyrightConfirmed: true,
    createdAt: '25/09/2026 14:15',
    contributorNotes: 'Camera: Sony A7IV + 70-200mm f/2.8 GM',
    likes: 12,
  },
  {
    id: 'pending-mclaren-singapore-night',
    teamId: 'mclaren',
    season: 2026,
    publishedAt: '25/09/2026',
    category: 'car',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    titleVi: 'McLaren Papaya Rực Lửa Trong Gara Đêm',
    titleEn: 'McLaren Papaya Glow in Singapore Night Pitlane',
    captionVi: 'Góc chụp kỹ thuật cánh gió trước McLaren dưới dàn đèn led cực quang.',
    captionEn: 'High-contrast garage capture of front wing carbon weave under stadium lights.',
    photographer: 'Markus K.',
    source: 'Fan Community Upload',
    license: 'CC BY 4.0',
    licenseType: 'CC BY 4.0',
    creditRequired: true,
    accentColor: '#ff8000',
    uploadedBy: '@f1fan',
    status: 'pending',
    copyrightConfirmed: true,
    createdAt: '25/09/2026 13:40',
    contributorNotes: 'Raw DNG available upon request',
    likes: 8,
  },
];

// Helper to validate and normalize loaded items with safe defaults
const sanitizeLoadedItem = (item: any): CollectionItem | null => {
  if (!item || typeof item !== 'object' || typeof item.id !== 'string') return null;
  return {
    ...item,
    teamId: item.teamId || 'ferrari',
    category: item.category || 'car',
    titleVi: item.titleVi || 'Ảnh Đóng Góp F1',
    titleEn: item.titleEn || item.titleVi || 'Community F1 Photo',
    captionVi: item.captionVi || item.titleVi || '',
    captionEn: item.captionEn || item.titleEn || item.captionVi || '',
    photographer: item.photographer || item.uploadedBy || 'Community',
    source: item.source || 'Community Contributor',
    license: item.license || 'CC BY 4.0',
    licenseType: item.licenseType || 'CC BY 4.0',
    creditRequired: item.creditRequired ?? true,
    accentColor: item.accentColor || '#e80020',
    status: item.status || 'approved',
    publishedAt: item.publishedAt || '25/09/2026',
    createdAt: item.createdAt || '25/09/2026',
    likes: Number(item.likes) || 1,
  };
};

// Helper to load user-approved items safely without serializing the whole static collection
const loadUserApprovedItems = (): CollectionItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_APPROVED_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any built-in static items that may have been bundled in legacy storage
        const defaultIds = new Set(INITIAL_APPROVED_ITEMS.map((i) => i.id));
        return parsed
          .map(sanitizeLoadedItem)
          .filter((p): p is CollectionItem => p !== null && !defaultIds.has(p.id));
      }
    }
  } catch {
    try {
      localStorage.removeItem(STORAGE_APPROVED_KEY);
    } catch {
      // ignore
    }
  }
  return [];
};

const loadSavedItems = (): CollectionItem[] => {
  const userApproved = loadUserApprovedItems();
  const userApprovedIds = new Set(userApproved.map((i) => i.id));
  const filteredDefaults = INITIAL_APPROVED_ITEMS.filter((i) => !userApprovedIds.has(i.id));
  return [...userApproved, ...filteredDefaults];
};

const loadPendingItems = (): CollectionItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_PENDING_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map(sanitizeLoadedItem)
          .filter((p): p is CollectionItem => p !== null);
      }
    }
  } catch {
    try {
      localStorage.removeItem(STORAGE_PENDING_KEY);
    } catch {
      // ignore
    }
  }
  return SAMPLE_PENDING_ITEMS;
};

export interface ContributorStats {
  username: string;
  count: number;
  avatarColor: string;
}

interface CollectionStoreState {
  // Navigation & Filtering
  selectedTeamId: TeamId | null;
  activeSeason: number | 'all';
  activeCategory: CollectionCategory;
  selectedContributor: string | null;

  // Collection Data State
  items: CollectionItem[];
  pendingItems: CollectionItem[];

  // Actions
  selectTeam: (teamId: TeamId) => void;
  clearTeam: () => void;
  setActiveSeason: (season: number | 'all') => void;
  setActiveCategory: (category: CollectionCategory) => void;
  setSelectedContributor: (contributor: string | null) => void;

  // Community Submissions & Moderation
  submitCommunityImage: (submission: Omit<CollectionItem, 'id' | 'status' | 'createdAt'>) => string;
  approveSubmission: (id: string) => void;
  rejectSubmission: (id: string, reason: string) => void;
  rejectedItems: CollectionItem[];
  likeItem: (id: string) => void;

  // Derived helpers
  getContributors: () => ContributorStats[];
}

export const useCollectionStore = create<CollectionStoreState>((set, get) => ({
  selectedTeamId: null,
  activeSeason: 'all',
  activeCategory: 'all',
  selectedContributor: null,

  items: loadSavedItems(),
  pendingItems: loadPendingItems(),
  rejectedItems: (() => {
    try {
      const raw = localStorage.getItem('f1_collection_rejected');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })(),

  selectTeam: (teamId) =>
    set({ selectedTeamId: teamId, activeSeason: 'all', activeCategory: 'all' }),

  clearTeam: () =>
    set({ selectedTeamId: null, activeSeason: 'all', activeCategory: 'all' }),

  setActiveSeason: (season) => set({ activeSeason: season }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  setSelectedContributor: (contributor) => set({ selectedContributor: contributor }),

  submitCommunityImage: (submission) => {
    const newId = `community-img-${Date.now()}`;
    const todayStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const teamPrefix = (submission.teamId || 'F1').toUpperCase().slice(0, 3);

    const newItem: CollectionItem = {
      ...submission,
      id: newId,
      sku: `COM-${teamPrefix}-${Date.now().toString().slice(-4)}`,
      titleVi: submission.titleVi || 'Ảnh Đóng Góp F1',
      titleEn: submission.titleEn || submission.titleVi || 'Community F1 Photo',
      captionVi: submission.captionVi || submission.titleVi || '',
      captionEn: submission.captionEn || submission.titleEn || submission.captionVi || '',
      status: 'pending',
      publishedAt: todayStr,
      createdAt: todayStr,
      likes: 1,
    };

    const nextPending = [newItem, ...get().pendingItems.filter((i) => i.id !== newId)];
    try {
      localStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify(nextPending));
    } catch {
      // ignore
    }

    set({ pendingItems: nextPending });
    return newId;
  },

  approveSubmission: (id) => {
    const pending = get().pendingItems;
    const target = pending.find((i) => i.id === id);
    if (!target) return;

    const todayStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const teamPrefix = (target.teamId || 'F1').toUpperCase().slice(0, 3);

    const approvedItem: CollectionItem = {
      ...target,
      status: 'approved',
      sku: target.sku || `COM-${teamPrefix}-${Date.now().toString().slice(-4)}`,
      publishedAt: target.publishedAt || todayStr,
      likes: target.likes || 1,
    };

    const nextPending = pending.filter((i) => i.id !== id);
    const currentUserApproved = loadUserApprovedItems().filter((i) => i.id !== id);
    const nextUserApproved = [approvedItem, ...currentUserApproved];

    try {
      localStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify(nextPending));
      localStorage.setItem(STORAGE_APPROVED_KEY, JSON.stringify(nextUserApproved));
    } catch {
      // ignore
    }

    set({
      pendingItems: nextPending,
      items: [approvedItem, ...get().items.filter((i) => i.id !== id)],
    });
  },

  rejectSubmission: (id, reason) => {
    const pending = get().pendingItems;
    const target = pending.find((i) => i.id === id);
    const nextPending = pending.filter((i) => i.id !== id);

    if (target) {
      const rejectedItem: CollectionItem = {
        ...target,
        status: 'rejected',
        rejectionReason: reason,
      };
      // Persist rejected items so contributors can see notification
      const STORAGE_REJECTED_KEY = 'f1_collection_rejected';
      let existingRejected: CollectionItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_REJECTED_KEY);
        existingRejected = raw ? JSON.parse(raw) : [];
      } catch { existingRejected = []; }
      const nextRejected = [rejectedItem, ...existingRejected.filter((i) => i.id !== id)];
      try {
        localStorage.setItem(STORAGE_REJECTED_KEY, JSON.stringify(nextRejected));
        localStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify(nextPending));
      } catch {
        // ignore
      }
      set({ pendingItems: nextPending, rejectedItems: nextRejected });
    } else {
      try {
        localStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify(nextPending));
      } catch { /* ignore */ }
      set({ pendingItems: nextPending });
    }
  },

  likeItem: (id) => {
    const updated = get().items.map((item) => {
      if (item.id === id) {
        return { ...item, likes: (item.likes || 0) + 1 };
      }
      return item;
    });

    const userApproved = loadUserApprovedItems();
    if (userApproved.some((i) => i.id === id)) {
      const nextUserApproved = userApproved.map((i) =>
        i.id === id ? { ...i, likes: (i.likes || 0) + 1 } : i
      );
      try {
        localStorage.setItem(STORAGE_APPROVED_KEY, JSON.stringify(nextUserApproved));
      } catch {
        // ignore
      }
    }

    set({ items: updated });
  },

  getContributors: () => {
    const counts: Record<string, number> = {};
    const colors = [
      '#e80020',
      '#ff8000',
      '#0600ef',
      '#00a19c',
      '#229971',
      '#6692ff',
      '#f50537',
      '#d4af37',
      '#8b5cf6',
      '#ec4899',
    ];

    get().items.forEach((item) => {
      const handle = item.uploadedBy || '@f1contributor';
      counts[handle] = (counts[handle] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([username, count], idx) => ({
        username,
        count,
        avatarColor: colors[idx % colors.length],
      }))
      .sort((a, b) => b.count - a.count);
  },
}));
