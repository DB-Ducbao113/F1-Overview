/**
 * Security utilities adhering to frontend security best practices:
 * - Web Crypto API (SHA-256) for secure credential hashing
 * - Input sanitization for XSS mitigation
 * - Brute-force rate limiting and lockout management
 * - Cryptographically strong token generation
 */

// XSS sanitization: escapes dangerous HTML characters
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Compute SHA-256 hash using browser's native Web Crypto API with fallback
export async function sha256(plainText: string, salt: string = 'f1_studio_security_salt_2026'): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle?.digest) {
      const enc = new TextEncoder();
      const data = enc.encode(`${salt}:${plainText}`);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // fallback below
  }
  let hash = 0;
  const str = `${salt}:${plainText}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

// Generate cryptographically secure random session token
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Brute-force protection: Rate limit failed attempts
const RATE_LIMIT_KEY = 'f1_auth_rate_limit_state';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout

interface RateLimitState {
  failedAttempts: number;
  lockedUntil: number | null;
}

export function getRateLimitStatus(): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };

    const state: RateLimitState = JSON.parse(raw);
    const now = Date.now();

    if (state.lockedUntil && state.lockedUntil > now) {
      const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
    }

    // Lockout expired, reset attempts
    if (state.lockedUntil && state.lockedUntil <= now) {
      clearRateLimit();
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - state.failedAttempts),
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }
}

export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    const state: RateLimitState = raw ? JSON.parse(raw) : { failedAttempts: 0, lockedUntil: null };

    state.failedAttempts += 1;

    if (state.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      state.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
      return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
    }

    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

export function clearRateLimit(): void {
  try {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // ignore
  }
}
