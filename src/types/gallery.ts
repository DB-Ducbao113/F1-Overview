import { SeasonYear } from './common';
import { TeamId } from './team';

export type CollectionCategory = 'all' | 'team' | 'driver' | 'car' | 'race';

export type SubmissionStatus = 'approved' | 'pending' | 'rejected';

export interface CollectionItem {
  id: string;
  teamId: TeamId;
  season?: SeasonYear | number | string;
  publishedAt?: string;
  race?: string;
  category: 'team' | 'driver' | 'car' | 'race';
  imageUrl: string;
  thumbnailUrl?: string;
  titleVi: string;
  titleEn: string;
  captionVi: string;
  captionEn: string;
  photographer: string;
  source: string;
  license: string;
  creditRequired: boolean;
  accentColor: string;
  carId?: string;
  driver?: string;
  sku?: string;
  badge?: string;
  featured?: boolean;
  tags?: string[];
  likes?: number;

  // ── Community F1 Collection & Copyright Fields ──
  uploadedBy?: string;           // e.g. '@baobungbu', '@f1fan'
  status?: SubmissionStatus;     // 'approved' | 'pending' | 'rejected'
  licenseType?: string;          // 'Personal photograph' | 'CC BY 4.0' | 'Editorial Share'
  copyrightConfirmed?: boolean;  // User confirmed ownership/permission
  createdAt?: string;            // Timestamp of submission
  contributorNotes?: string;     // Notes from contributor or admin
  rejectionReason?: string;      // Reason provided by admin when rejecting
}


// Legacy alias kept for backward compatibility (HomeView still imports CuratedImage)
export type CuratedImage = CollectionItem;
export type GalleryCategory = CollectionCategory;

