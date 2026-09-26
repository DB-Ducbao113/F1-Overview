export type UserRole = 'admin' | 'contributor' | 'visitor';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarColor?: string;
  permissions: ('moderate_images' | 'upload_images' | 'delete_images')[];
  lastLoginAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number; // Unix timestamp in ms
}

export interface LoginAttempt {
  count: number;
  lockedUntil: number | null;
}
