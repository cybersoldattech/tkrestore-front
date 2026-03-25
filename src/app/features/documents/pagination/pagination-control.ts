import { computed, signal, Signal } from '@angular/core';

import { Observable } from 'rxjs';

export type PaginationLoadFn<T> = (params: {
  page: number;
  per_page: number;
}) => Observable<{ data: T[]; meta?: { total?: number } }>;


export interface PaginationState<T> {
  /** Writable reference to allow deterministic local UI updates */
  items: import('@angular/core').WritableSignal<T[]>;
  total: Signal<number>;
  page: Signal<number>;
  loadingInitial: Signal<boolean>;
  loadingMore: Signal<boolean>;
  hasMore: Signal<boolean>;
}


/**
 * Helper pagination: même structure d'état que SearchComponent.
 * Ne fait aucune logique métier (juste append/reset + hasMore + flags).
 */
export function createPaginationControl<T>(opts: {
  perPage: number;
  load: PaginationLoadFn<T>;
  // Optional: clé pour empêcher doublons si besoin, mais ici on s'aligne sur SearchComponent
}): {
  state: PaginationState<T>;
  loadInitial: () => void;
  loadMore: () => void;

  /**
   * Charger en contrôlant append/reset.
   * - append=false => reset page=1, remplacer items
   * - append=true  => page+1, concat items
   */
  doLoad: (append: boolean) => void;
  /** Reset explicite (rare) */
  reset: () => void;
} {
  const items = signal<T[]>([]);
  const total = signal(0);
  const page = signal(1);

  const loadingInitial = signal(false);
  const loadingMore = signal(false);

  const hasMore = computed(() => items().length < total());

  const reset = () => {
    page.set(1);
    items.set([]);
    total.set(0);
    loadingInitial.set(false);
    loadingMore.set(false);
  };

  const doLoad = (append: boolean) => {
    if (append) {
      if (loadingInitial() || loadingMore()) return;
      loadingMore.set(true);
    } else {
      if (loadingInitial() || loadingMore()) return;
      loadingInitial.set(true);
      page.set(1);
      items.set([]);
      total.set(0);
    }

    const nextPage = append ? page() + 1 : 1;

    opts.load({ page: nextPage, per_page: opts.perPage }).subscribe({
      next: (res) => {
        const data = res.data ?? [];
        const newTotal = res.meta?.total ?? 0;

        total.set(newTotal);
        if (append) {
          items.update((prev) => [...prev, ...data]);
          page.set(nextPage);
        } else {
          items.set(data);
          page.set(1);
        }

        loadingInitial.set(false);
        loadingMore.set(false);
      },
      error: () => {
        loadingInitial.set(false);
        loadingMore.set(false);
      },
    });
  };

  const loadInitial = () => doLoad(false);
  const loadMore = () => doLoad(true);

  return {
    state: {
      items,
      total,
      page,
      loadingInitial,
      loadingMore,
      hasMore,
    },
    loadInitial,
    loadMore,
    doLoad,
    reset,
  };
}

