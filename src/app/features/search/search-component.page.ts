import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DocumentService } from '../../core/services/document.service';
import { DocumentDeclaration, ItemType, SubCategory } from '../../core/services/models/document.models';
import { NotificationService } from '../../core/services/notification.service';
 
@Component({
 selector: 'app-search-component.page',
 imports: [RouterLink, ReactiveFormsModule],
 templateUrl: './search-component.page.html',
 changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponentPage {
  readonly lang           = inject(LanguageService);
  readonly auth           = inject(AuthService);
  private readonly docSvc = inject(DocumentService);
  private readonly notif  = inject(NotificationService);
  private readonly fb     = inject(FormBuilder);
 
  // ── État ─────────────────────────────────────────────────────────
  readonly query          = signal('');
  readonly activeFilter   = signal<string>('all'); // 'all' ou sub_category.id
  readonly sortBy         = signal<'created_at' | 'event_date'>('created_at');
  readonly isLoading      = signal(false);
  readonly isLoadingMore  = signal(false);
  readonly loadingSubCats = signal(true);
 
  // ── Résultats ─────────────────────────────────────────────────────
  readonly results     = signal<DocumentDeclaration[]>([]);
  readonly totalCount  = signal(0);
  readonly currentPage = signal(1);
  readonly hasMore     = computed(() => this.results().length < this.totalCount());
 
  // ── Sous-catégories chargées depuis l'API (catégorie "Document") ──
  readonly subCategories = signal<SubCategory[]>([]);
 
  // Onglets : "Tous" + sous-catégories réelles
  readonly filters = computed(() => [
    { id: 'all', name: this.lang.t().search.filterAll },
    ...this.subCategories().map((s) => ({ id: s.id, name: s.name })),
  ]);
 
  // ── country_id résolu automatiquement ────────────────────────────
 
  private get resolvedCountryId(): string | undefined {
    const user = this.auth.currentUser();
    if (user?.country?.id) return user.country.id;
 
    // Guest : country stocké lors de la saisie dans la modal
    const stored = (sessionStorage.getItem('tkrestore.guest_country_id')) ? sessionStorage.getItem('tkrestore.guest_country_id') : undefined;
    return stored ?? undefined;
  }
 
  // ── Modal identification (non-authentifié) ────────────────────────
  readonly showIdentModal = signal(false);
  private pendingQuery    = '';
 
  readonly identForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{8,15}$/)]],
  });
 
  ngOnInit(): void {
     if (typeof window !== 'undefined') {
          // 1. Charger les sous-catégories de "Document"
      this.loadSubCategories();
      // 2. Afficher les documents trouvés du pays de l'utilisateur
      this.doSearch('', false);
     }

  }
 
  // ── Charger sous-catégories "Document" depuis l'API ───────────────
  private loadSubCategories(): void {
    this.loadingSubCats.set(true);
 
    this.docSvc.getCategories().subscribe({
      next: (res) => {
        const documentCat = res.data.find(
          (c) => c.name.toLowerCase() === 'document'
        );
        if (!documentCat) {
          this.loadingSubCats.set(false);
          return;
        }
        this.docSvc.getSubCategories(documentCat.id).subscribe({
          next: (subRes) => {
            this.subCategories.set(subRes.data);
            this.loadingSubCats.set(false);
          },
          error: () => this.loadingSubCats.set(false),
        });
      },
      error: () => this.loadingSubCats.set(false),
    });
  }
 
  // ── Gestion de la recherche ───────────────────────────────────────
  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
 
  onKeyEnter(): void {
    this.triggerSearch();
  }
 
  triggerSearch(): void {
    const q = this.query().trim();
 
    // Non authentifié et pas encore identifié → ouvrir la modal
    if (!this.auth.isLoggedIn() && !sessionStorage.getItem('tkrestore.guest_email')) {
      this.pendingQuery = q;
      this.showIdentModal.set(true);
      return;
    }
 
    this.doSearch(q, false);
  }
 
  // ── Filtre par sous-catégorie — déclenche une nouvelle recherche ──
  setFilter(id: string): void {
    this.activeFilter.set(id);
    // Le filtre déclenche toujours une requête API (pas de filtrage côté client)
    this.doSearch(this.query().trim(), false);
  }
 
  onSort(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as 'created_at' | 'event_date';
    this.sortBy.set(val);
    this.doSearch(this.query().trim(), false);
  }
 
  loadMore(): void {
    this.doSearch(this.query().trim(), true);
  }
 
  // ── Requête API ───────────────────────────────────────────────────
  private doSearch(q: string, append: boolean): void {
    if (!append) {
      this.isLoading.set(true);
      this.currentPage.set(1);
    } else {
      this.isLoadingMore.set(true);
    }
 
    const page          = append ? this.currentPage() + 1 : 1;
    const activeFilter  = this.activeFilter();
    const countryId     = this.resolvedCountryId;
 
    const searchParams = {
      q:               q || undefined,
      type:            ItemType.Found,
      guest_email:     !this.auth.isLoggedIn() ? sessionStorage.getItem('tkrestore.guest_email') ?? undefined : undefined,
      guest_phone:     !this.auth.isLoggedIn() ? sessionStorage.getItem('tkrestore.guest_phone') ?? undefined : undefined,
      // Filtre sous-catégorie uniquement si une est sélectionnée
      sub_category_id: activeFilter !== 'all' ? activeFilter : undefined,
      // country_id injecté automatiquement — filtre géographique implicite
      country_id:      countryId,
      per_page:        12,
      page,
      sort_by:         this.sortBy(),
    };

    if (!this.auth.isLoggedIn()) {
      const guestEmail = sessionStorage.getItem('tkrestore.guest_email');
      const guestPhone = sessionStorage.getItem('tkrestore.guest_phone');
      if (guestEmail) searchParams.guest_email = guestEmail;
      if (guestPhone) searchParams.guest_phone = guestPhone;
    }

    this.docSvc.search(searchParams).subscribe({
      next: (res) => {
        if (append) {
          this.results.update((prev) => [...prev, ...res.data]);
          this.currentPage.set(page);
        } else {
          this.results.set(res.data);
        }
        this.totalCount.set(res.meta.total);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
        this.notif.error('Erreur lors de la recherche. Réessayez.');
      },
    });
  }
 
  // ── Modal identification ──────────────────────────────────────────
  submitIdent(): void {
    if (this.identForm.invalid) {
      this.identForm.markAllAsTouched();
      return;
    }
 
    const { email, phone } = this.identForm.getRawValue();
    sessionStorage.setItem('tkrestore.guest_email', email);
    sessionStorage.setItem('tkrestore.guest_phone', phone);
 
    this.showIdentModal.set(false);
    this.identForm.reset();
    this.doSearch(this.pendingQuery, false);
  }
 
  closeModal(): void {
    this.showIdentModal.set(false);
    this.identForm.reset();
  }
 
  // ── Helpers ───────────────────────────────────────────────────────
  categoryClass(subCategoryName: string): string {
    const n = subCategoryName?.toLowerCase() ?? '';
    if (n.includes('passport'))                        return 'bg-[#FF7A00]/10 text-[#FF7A00]';
    if (n.includes('cni') || n.includes('national'))   return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    if (n.includes('permis') || n.includes('license')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (n.includes('acte') || n.includes('birth'))     return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
    return 'bg-slate-500/10 text-slate-500 dark:text-slate-400';
  }
 
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
}
