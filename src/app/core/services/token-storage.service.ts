// src/app/core/services/token-storage.service.ts
// Mis à jour pour correspondre aux tokens Sanctum (access_token uniquement)

import { Injectable } from '@angular/core';
import { AuthTokens, AuthUser } from './models/auth.models';


const KEYS = {
  ACCESS_TOKEN: 'tkrestore.access_token',
  USER:         'tkrestore.user',
} as const;

@Injectable({ providedIn: 'root' })
export class TokenStorageService {

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(KEYS.ACCESS_TOKEN);
  }

  saveTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ACCESS_TOKEN, tokens.access_token);
  }

  hasValidToken(): boolean {
    return !!this.getAccessToken();
  }

  saveUser(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; }
    catch { return null; }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
}