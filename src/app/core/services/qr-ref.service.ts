import { Injectable, inject, signal, computed, effect } from '@angular/core';

interface StoredRef {
  ref: string;
  timestamp: number; // ms
  expiryMs: number;  // 1h = 3600000
}

@Injectable({ providedIn: 'root' })
export class QrRefService {
  private readonly STORAGE_KEY = 'tkrestore.qrRef';

  // Signals
  private readonly _storedRef = signal<StoredRef | null>(null);

  // Public computed: valid ref or null
  readonly qrRef = computed(() => {
    const stored = this._storedRef();
    if (!stored || Date.now() > stored.timestamp + stored.expiryMs) {
      this.clear();
      return null;
    }
    return stored.ref;
  });

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      // Auto-clear effect
      effect(() => {
        const ref = this.qrRef();
        if (ref === null) this.clear();
      });
    }
  }

  /** Set QR ref with 1h expiry */
  setRef(ref: string): void {
    if (!ref?.trim()) return;

    const stored: StoredRef = {
      ref: ref.trim(),
      timestamp: Date.now(),
      expiryMs: 60 * 60 * 1000, // 1h
    };

    this._storedRef.set(stored);
    this.saveToStorage(stored);
  }

  /** Get valid ref or null */
  getRef(): string | null {
    return this.qrRef();
  }

  /** Clear ref */
  clear(): void {
    this._storedRef.set(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private loadFromStorage(): void {
    try {
      const json = window.localStorage.getItem(this.STORAGE_KEY);
      if (json) {
        const stored: StoredRef = JSON.parse(json);
        // Validate before setting
        if (stored.ref && stored.timestamp && Date.now() < stored.timestamp + stored.expiryMs) {
          this._storedRef.set(stored);
        } else {
          this.clear();
        }
      }
    } catch {
      this.clear();
    }
  }

  private saveToStorage(stored: StoredRef): void {
    try {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
    } catch {
      console.warn('Failed to save QR ref to localStorage');
    }
  }
}

