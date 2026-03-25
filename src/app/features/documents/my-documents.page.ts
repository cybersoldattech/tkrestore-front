import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { QRCodeService, type QRCode } from '../../core/services/qrcode.service';
import { AuthService } from '../../core/services/auth.service';
import { DocumentService } from '../../core/services/document.service';
import { LanguageService } from '../../core/services/language.service';
import { LoadingService } from '../../core/services/loading.service';
import { DocumentDeclaration, DocumentStatus } from '../../core/services/models/document.models';
import { createPaginationControl } from './pagination/pagination-control';

import { environment } from '../../../environments/environment';

import { Caroussel } from '../../shared/caroussel/caroussel';
import { PaymentService } from '../../core/services/payment.service';

import type { ConfirmRejectAction } from './my-documents-restore-actions.types';
import { NotificationService } from '../../core/services/notification.service';


@Component({
  selector: 'app-my-documents-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Caroussel],
  templateUrl: './my-documents.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDocumentsPage {

  // ── Services ─────────────────────────────────────────────────────
  readonly t                = inject(LanguageService).t;
  readonly documentService  = inject(DocumentService);
  readonly authService      = inject(AuthService);
  readonly loading          = inject(LoadingService);
  readonly qrcodeService    = inject(QRCodeService);
  private readonly notif    = inject(NotificationService);
  readonly router           = inject(Router);
  readonly environment      = environment;
  readonly paymentSvc       = inject(PaymentService);


  // ════════════════════════════════════════════════════════════════
  // TAB 1 — Déclarations
  // ════════════════════════════════════════════════════════════════

  readonly typeFilter              = new FormControl<'all' | 'lost' | 'found'>('all');
  readonly declarationStatusFilter = new FormControl<'all' | 'DRAFT' | 'ACTIVE' | 'MATCHED' | 'REFUNDED'>('all');
  readonly subCategoryFilter       = new FormControl<string | 'all'>('all');

  private readonly declarationsPagination = createPaginationControl<DocumentDeclaration>({
    perPage: 12,
    load: ({ page, per_page }) => {
      const type          = this.typeFilter.value ?? 'all';
      const status        = this.declarationStatusFilter.value ?? 'all';
      const subCategoryId = this.subCategoryFilter.value;

      const params: Record<string, any> = {
        page,
        per_page,
        type:            type === 'all' ? undefined : (type === 'lost' ? 'LOST' : 'FOUND'),
        status:          status === 'all' ? undefined : status,
        sub_category_id: subCategoryId === 'all' ? undefined : subCategoryId,
      };
      Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);

      return this.documentService.getMyDeclarations(params);
    },
  });

  readonly declarationItems      = computed(() => this.declarationsPagination.state.items());
  readonly declarationTotalItems = computed(() => this.declarationsPagination.state.total());
  readonly declarationHasMore    = computed(() => this.declarationsPagination.state.hasMore());
  readonly isLoadingMoreDeclaration = computed(() => this.declarationsPagination.state.loadingMore());

  loadDeclarations(type: 'all' | 'lost' | 'found', status: 'all' | DocumentStatus, append = false): void {
    this.typeFilter.setValue(type);
    this.declarationStatusFilter.setValue(status as any);
    this.declarationsPagination.doLoad(append);
  }

  loadMoreDeclaration(): void {
    this.declarationsPagination.loadMore();
  }

  private debugLogFilters(prefix: string): void {
    console.debug(`[MyDocuments] ${prefix}`, {
      type:          this.typeFilter.value ?? 'all',
      status:        this.declarationStatusFilter.value ?? 'all',
      subCategory_id: this.subCategoryFilter.value ?? 'all',
    });
  }

  onTab1FiltersChange(): void {
    this.debugLogFilters('filters changed → reload');
    this.declarationsPagination.doLoad(false);
  }

  statusLabel(value: string | null | undefined): string {
    if (!value) return '';
    const labels: Record<string, string> = {
      DRAFT:    'Brouillon',
      ACTIVE:   'Actif',
      MATCHED:  'Correspondance',
      REFUNDED: 'Remboursé',
    };
    return labels[value] ?? value;
  }

  subCategoryLabel(value: string | null | undefined): string {
    if (!value) return '';
    return this.subCategoryOptions().find(o => String(o.id) === String(value))?.name ?? value;
  }

  readonly subCategoryOptions = computed(() => {
    const items = this.declarationItems();
    const map   = new Map<string, string>();
    for (const doc of items) {
      const sub  = doc.sub_category as any;
      const id   = sub?.id;
      const name = sub?.name;
      if (typeof id === 'string' && id.trim().length > 0 && typeof name === 'string' && name.trim().length > 0) {
        map.set(id, name);
      }
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  });


  // ════════════════════════════════════════════════════════════════
  // [NEW] Modal — Détails du rejet (TAB 1)
  // ════════════════════════════════════════════════════════════════

  /** Document REJECTED dont on affiche le détail */
  readonly rejectDetailDoc  = signal<DocumentDeclaration | null>(null);
  readonly showRejectModal  = signal(false);

  /** Ouvre la modal de détail du rejet */
  openRejectDetailModal(doc: DocumentDeclaration, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.rejectDetailDoc.set(doc);
    this.showRejectModal.set(true);
  }

  closeRejectDetailModal(): void {
    this.showRejectModal.set(false);
    // Petit délai pour que l'animation de fermeture soit propre
    setTimeout(() => this.rejectDetailDoc.set(null), 200);
  }

  /** Retourne true si le document a une raison/description de rejet à afficher */
  hasRejectDetails(doc: DocumentDeclaration): boolean {
    return !!(doc.reject_description?.trim() || doc.reject_reason?.trim());
  }


  // ════════════════════════════════════════════════════════════════
  // TAB 2 — QR Codes
  // ════════════════════════════════════════════════════════════════

  private readonly qrPagination = createPaginationControl<QRCode>({
    perPage: 12,
    load: ({ page, per_page }) => this.qrcodeService.getMyQRCodes({ page, per_page }),
  });

  readonly qrcodes          = computed(() => this.qrPagination.state.items());
  readonly hasMoreQR        = computed(() => this.qrPagination.state.hasMore());
  readonly isLoadingMoreQR  = computed(() => this.qrPagination.state.loadingMore());

  loadQRDeclarations(append = false): void {
    this.qrPagination.doLoad(append);
  }

  loadMoreQR(): void {
    this.qrPagination.loadMore();
  }

  readonly selectedQR      = signal<QRCode | null>(null);
  readonly showQRViewModal = signal(false);

  viewQR(code: QRCode): void {
    this.selectedQR.set(code);
    this.showQRViewModal.set(true);
  }

  closeQRViewModal(): void {
    this.showQRViewModal.set(false);
    this.selectedQR.set(null);
  }



  // ════════════════════════════════════════════════════════════════
  // TAB 3 — Restaurations
  // ════════════════════════════════════════════════════════════════

  private readonly restorationPagination = createPaginationControl<DocumentDeclaration>({
    perPage: 12,
    load: ({ page, per_page }) => this.documentService.getMyRestorations({ page, per_page }),
  });

  readonly confirmRejectModalOpen  = signal(false);
  readonly confirmRejectAction     = signal<ConfirmRejectAction>('confirm');
  readonly confirmRejectDepositId  = signal<string | null>(null);
  readonly isConfirmRejectLoading  = signal(false);
  readonly isConfirmRejectPending  = computed(() => this.isConfirmRejectLoading() === true);

  readonly restorationItems           = computed(() => this.restorationPagination.state.items());
  readonly restorationHasMore         = computed(() => this.restorationPagination.state.hasMore());
  readonly isLoadingMoreRestoration   = computed(() => this.restorationPagination.state.loadingMore());

  loadMyRestorations(append = false): void {
    this.restorationPagination.doLoad(append);
  }

  loadMoreRestoration(): void {
    this.restorationPagination.loadMore();
  }

  readonly showDetailModal = signal(false);
  readonly detailItem      = signal<DocumentDeclaration | null>(null);

  getDepositId(doc: DocumentDeclaration): string | null {
    const val = doc.deposit_id ?? null;
    return typeof val === 'string' && val.trim().length > 0 ? val : null;
  }

  hasDepositId(doc: DocumentDeclaration): boolean {
    return this.getDepositId(doc) !== null;
  }

  isRestoreConfirmed(doc: DocumentDeclaration): boolean {
    return doc.payer_confirmed === true;
  }

  needsConfirmRejectAction(doc: DocumentDeclaration): boolean {
    if (!this.hasDepositId(doc)) return false;
    return doc.payer_confirmed_at === null || doc.payer_confirmed_at === undefined;
  }


  closeConfirmRejectModal(): void {
    this.confirmRejectModalOpen.set(false);
    this.confirmRejectDepositId.set(null);
  }

  confirmReject(): void {
    const depositId = this.confirmRejectDepositId();
    if (!depositId || this.isConfirmRejectLoading()) return;

    const action             = this.confirmRejectAction();
    const nextPayerConfirmed = action === 'confirm';

    this.isConfirmRejectLoading.set(true);

    const obs = action === 'confirm'
      ? this.paymentSvc.confirmPayer(depositId)
      : this.paymentSvc.rejectPayer(depositId);

    obs.subscribe({
      next: (resp) => {
        this.isConfirmRejectLoading.set(false);
        this.restorationPagination.state.items.update(prev =>
          prev.map(item => {
            const itemDepositId = item.deposit_id ?? null;
            if (!itemDepositId || itemDepositId !== depositId) return item;
            return { ...item, payer_confirmed: nextPayerConfirmed, payer_confirmed_at: new Date().toISOString() };
          })
        );
        this.closeConfirmRejectModal();
        this.restorationPagination.doLoad(false);
        this.notif.success(resp?.message ?? 'Success');
        if (action !== 'confirm') {
          this.router.navigate(['/app/documents']);
        }
      },
      error: (err) => {
        this.isConfirmRejectLoading.set(false);
        this.notif.error(err?.message ?? 'Erreur. Veuillez Réessayez.');
        console.error('[Restoration] confirm/reject error', err);
      },
    });
  }

  openDetailModal(item: DocumentDeclaration): void {
    if (this.isConfirmRejectLoading()) return;
    this.detailItem.set(item);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.detailItem.set(null);
  }

  goToChat(chatId: string): void {
    if (this.isConfirmRejectLoading()) return;
    this.router.navigate(['/app/chat', chatId]);
  }


  // ════════════════════════════════════════════════════════════════
  // Modal suppression (commun documents + QR)
  // ════════════════════════════════════════════════════════════════

  readonly showDeleteModal = signal(false);
  readonly deleteType      = signal<'document' | 'qrcode'>('document');
  readonly deleteItemId    = signal<string | null>(null);

  openDeleteModal(type: 'document' | 'qrcode', id: string): void {
    this.deleteType.set(type);
    this.deleteItemId.set(id);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deleteItemId.set(null);
  }

  confirmDeleteAction(): void {
    const id = this.deleteItemId();
    if (!id) return;
    this.deleteType() === 'document' ? this.deleteDocument(id) : this.deleteQR(id);
    this.closeDeleteModal();
  }

  private deleteDocument(id: string): void {
    this.documentService.deleteDeclaration(id).subscribe({
      next: () => {
        const type   = this.typeFilter.value ?? 'all';
        const status = this.declarationStatusFilter.value ?? 'all';
        this.loadDeclarations(type, status as any, false);
      },
      error: (err) => console.error('[Documents] Erreur suppression :', err),
    });
  }

  private deleteQR(id: string): void {
    this.qrcodeService.delete(id).subscribe({
      next:  ()    => this.loadQRDeclarations(false),
      error: (err) => console.error('[QR Codes] Erreur suppression :', err),
    });
  }



  // ════════════════════════════════════════════════════════════════
  // Helpers UI
  // ════════════════════════════════════════════════════════════════

  categoryClass(subCategoryName: string): string {
    const n = (subCategoryName ?? '').toLowerCase();
    if (n.includes('passport'))                        return 'bg-[#FF7A00]/10 text-[#FF7A00]';
    if (n.includes('cni') || n.includes('national'))   return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    if (n.includes('permis') || n.includes('license')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (n.includes('acte')   || n.includes('birth'))   return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
    return 'bg-slate-500/10 text-slate-500 dark:text-slate-400';
  }

  
  statusIcon(status: string): string {
    const map: Record<string, string> = {
      DRAFT:    'edit',
      ACTIVE:   'visibility',
      MATCHED:  'favorite',
      RETURNED: 'check_circle',
      CLOSED:   'lock',
      REJECTED: 'close',
    };
    return map[status] ?? 'help';
  }

  formatDateShort(date?: string | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  getImageUrl(path?: string | null): string {
    if (!path?.trim()) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiM5OTk5OTkiLz48L3N2Zz4=';
    }
    const base      = (this.environment as any).appUrl.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    return `${base}/storage/${cleanPath}`;
  }
}