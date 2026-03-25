import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { DocumentService } from '../../core/services/document.service';
import { DocumentDeclaration, SubCategory, ItemType } from '../../core/services/models/document.models';

type DocumentCard = { id: string; title: string; location: string; foundAtLabel: string };

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly lang = inject(LanguageService);
  private readonly docSvc = inject(DocumentService);
 
  // ── État ─────────────────────────────────────────────────────────
  readonly isLoading       = signal(true);
  readonly hasError        = signal(false);
  readonly loadingSubCats  = signal(true);

  // ── Stats Home ─────────────────────────────────────────────────────
  readonly homeStatsLoading = signal(true);
  readonly homeStatsError   = signal(false);
  readonly homeStats = signal({
    countries_count: 0,
    users_count: 0,
    items_active_matched_count: 0,
    documents_refunded_count: 0,
  });

  // ── Données ───────────────────────────────────────────────────────
  readonly items       = signal<DocumentDeclaration[]>([]);

  // Sous-catégories de "Document" chargées depuis l'API
  readonly subCategories = signal<SubCategory[]>([]);
  readonly activeTab     = signal<string>('all'); // 'all' ou sub_category.id
  readonly recent24hItems = signal<DocumentDeclaration[]>([]);
  readonly recent24hLoading = signal(false);
 
  // ── Onglet "Tous" + sous-catégories pour les onglets ─────────────
  readonly tabs = computed(() => [
    { id: 'all', name: 'Tous' },
    ...this.subCategories().map((s) => ({ id: s.id, name: s.name })),
  ]);
 
  // ── Items filtrés selon l'onglet actif ────────────────────────────
  readonly filteredItems = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all') return this.items();
    return this.items().filter((item) => item.sub_category?.id === tab);
  });
 
 private readonly init = afterNextRender(() => {
    this.loadSubCategories();
    this.loadRecentItems();
    this.loadRecent24hItems();
    this.loadHomeStats();
  });

 
  // ── Charger les sous-catégories de "Document" ─────────────────────
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
 
  // ── Charger les déclarations FOUND récentes ───────────────────────
  loadRecentItems(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
 
    this.docSvc.search({
      type:     ItemType.Found,
      per_page: 8,
      sort_by:  'created_at',
    }).subscribe({
      next: (res) => {
        this.items.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  loadRecent24hItems(): void {
    this.recent24hLoading.set(true);

    this.docSvc.recent().subscribe({
      next: (res) => {
        this.recent24hItems.set(res.data);
        this.recent24hLoading.set(false);
      },
      error: () => {
        this.recent24hLoading.set(false);
      },
    });
  }
 
  setTab(id: string): void {
    this.activeTab.set(id);
  }
 
 
  private loadHomeStats(): void {
    this.homeStatsLoading.set(true);
    this.homeStatsError.set(false);

    this.docSvc.getHomeStats().subscribe({
      next: (res) => {
        this.homeStats.set(res.data);
        this.homeStatsLoading.set(false);
      },
      error: () => {
        this.homeStatsError.set(true);
        this.homeStatsLoading.set(false);
      },
    });
  }

}

