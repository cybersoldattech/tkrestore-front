import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router ,RouterOutlet, RouterLink, } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { LanguageService }        from '../../core/services/language.service';
import { DocumentService }        from '../../core/services/document.service';
import { NotificationService }    from '../../core/services/notification.service';
import { AuthService }            from '../../core/services/auth.service';
import { PaymentService }         from '../../core/services/payment.service';
import { CountryProviderService, PinPromptChannel, ProviderInfo } from '../../core/services/country-provider.service';
import { PricePipe }              from '../../Pipes/price-pipe';

import {
  DocumentDeclaration,
} from '../../core/services/models/document.models';

@Component({
  selector: 'app-restore-document-page',
  imports: [ReactiveFormsModule , RouterLink],
  providers: [PricePipe],
  templateUrl: './restore-document.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestoreDocumentPage implements OnInit, OnDestroy {

  // ── DI ───────────────────────────────────────────────────────
  private readonly route      = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly fb         = inject(FormBuilder);
  private readonly pricePipe  = inject(PricePipe);
  private readonly docSvc     = inject(DocumentService);
  private readonly notif      = inject(NotificationService);
  private readonly auth       = inject(AuthService);
  private readonly cdr        = inject(ChangeDetectorRef);
  readonly         lang       = inject(LanguageService);

  // 🆕 New services
  readonly paymentSvc         = inject(PaymentService);
  readonly countryProviderSvc = inject(CountryProviderService);

  private readonly destroy$ = new Subject<void>();


  // ── Document state ───────────────────────────────────────────
  readonly item         = signal<DocumentDeclaration | null>(null);
  readonly isLoadingDoc = signal(true);
  readonly loadError    = signal(false);

  // ── Providers for this item's country ───────────────────────
  readonly availableProviders = computed<ProviderInfo[]>(() => {
    const item = this.item();
    if (!item?.country?.iso_code) return [];
    return this.countryProviderSvc.getProvidersForCountry(item.country.iso_code);
  });

  // ── Document computed ────────────────────────────────────────
  readonly itemTitle    = computed(() => this.item()?.name_on_item || this.item()?.title || '—');
  readonly itemSubCat   = computed(() => this.item()?.sub_category?.name ?? 'Document');
  readonly itemLocation = computed(() => this.item()?.location ?? '—');

  // Le provider sélectionné complet (pour récupérer nameDisplayedToCustomer + instructions)
  readonly selectedProvider = computed<ProviderInfo | null>(() => {
    const code = this.form.controls.mobileOperator.value;
    if (!code) return null;
    return this.availableProviders().find(p => p.provider === code) ?? null;
  });

  // Instructions PIN du provider sélectionné
  readonly pinInstructions = computed<PinPromptChannel[]>(() => {
    const provider = this.selectedProvider();
    if (!provider?.currencies?.[0]?.operationTypes?.DEPOSIT) return [];
    return provider.currencies[0].operationTypes.DEPOSIT
      .pinPromptInstructions?.channels ?? [];
  });

  // Contrôle l'affichage de la modal
  readonly showPinModal = signal(false);

  readonly itemBasePrice = computed(() =>
    this.pricePipe.transform(this.item()?.price, this.item()?.price_currency)
  );
  readonly itemSubCatPrice = computed(() =>
    this.pricePipe.transform(
      this.item()?.final_price ?? this.item()?.price,
      this.item()?.price_currency
    )
  );
  readonly hasDiscount = computed(() => {
    const d = this.item()?.discount;
    return d !== null && d?.type !== 'full';
  });

  readonly discountLabel = computed(() => this.item()?.discount?.formatted_value ?? null);
  
  readonly Userphone = computed(() => { return this.auth.currentUser()?.phone ?? null });

  readonly isOwner = computed(() => {
    const user = this.auth.currentUser();
    return user?.id === this.item()?.owner?.id;
  });


  // ── Payment state ────────────────────────────────────────────
  readonly paymentStarted  = signal(false);
  readonly isSubmitting    = signal(false);
  readonly serverError     = signal<string | null>(null);

  readonly paymentStatus   = this.paymentSvc.currentPayment;
  readonly isPolling       = this.paymentSvc.isPolling;

  readonly payerConfirmStep = signal(false);
  readonly payerConfirming = signal(false);
  readonly payerConfirmed = signal<boolean | null>(null);
  readonly showRejectModal = signal(false); 

  private paymentDepositId: string | null = null;
  readonly cleanUrl = signal<string>('');
  // ── Form ─────────────────────────────────────────────────────
  readonly form = this.fb.nonNullable.group({
    phoneNumber:    ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{8,15}$/)]],
    mobileOperator: ['', [Validators.required]],  // stores provider code: "MTN_MOMO_CMR"
    acceptClarity:  [false, [Validators.requiredTrue]],
    acceptOneTime:  [false, [Validators.requiredTrue]],
    acceptDpa:      [false, [Validators.requiredTrue]],
  });

  readonly formValue = signal(this.form.getRawValue());

  readonly canSubmit = computed(() => {
    if (this.isOwner()) return false;
    const v = this.formValue();
    return v.acceptClarity && v.acceptOneTime && v.acceptDpa
        && this.form.controls.phoneNumber.valid
        && this.form.controls.mobileOperator.valid;
  });

  // ────────────────────────────────────────────────────────────
  //  Lifecycle
  // ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const itemId = this.id();
    if (!itemId) { this.router.navigate(['/']); return; }

    // Pre-fill phone from user profile
    const userPhone = this.auth.currentUser()?.phone;
    if (userPhone) this.form.controls.phoneNumber.setValue(userPhone);

    // Sync form values to signal for computed()
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.formValue.set({ ...this.formValue(), ...v }));


    this.loadDocument(itemId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.paymentSvc.clearPayment();
  }

  // ────────────────────────────────────────────────────────────
  //  Document loading
  // ────────────────────────────────────────────────────────────

  private loadDocument(id: string): void {
    this.isLoadingDoc.set(true);
    this.loadError.set(false);

    this.docSvc.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.item.set(res.data);
          //  console.log('Document loaded:', res.data);
          this.isLoadingDoc.set(false);
          if (res.data?.country?.iso_code) {
            this.countryProviderSvc.setUserCountry(res.data.country.iso_code);
          }
        },
        error: () => {
          this.loadError.set(true);
          this.isLoadingDoc.set(false);
          this.notif.error('Document introuvable.');
        },
      });
  }

  // ────────────────────────────────────────────────────────────
  //  Submit payment
  // ────────────────────────────────────────────────────────────

  submit(): void {
    if (this.isOwner()) {
      this.notif.warning('Vous ne pouvez pas payer vos propres documents.');
      return;
    }

    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.serverError.set(null);

    const { phoneNumber, mobileOperator } = this.form.getRawValue();

    this.paymentSvc.initiatePayment({
      item_id: this.id(),
      phone_number: phoneNumber,
      provider: mobileOperator,
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: res => {
        this.isSubmitting.set(false);
        this.paymentStarted.set(true);
        this.notif.success('Paiement soumis ! Confirmez sur votre téléphone.');
      
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.paymentStarted.set(false); 
        this.showPinModal.set(false);
        this.serverError.set(this.mapError(err));
        this.notif.error(this.mapError(err));
      },
    });
  }


  // ────────────────────────────────────────────────────────────
  //  Helpers
  // ────────────────────────────────────────────────────────────

  private mapError(err: HttpErrorResponse): string {
    switch (err.status) {
      case 402: return 'Solde insuffisant. Rechargez votre compte Mobile Money.';
      case 403: return 'Action non autorisée.';
      case 404: return 'Document introuvable.';
      case 422: return err.error?.message ?? 'Informations invalides.';
      default:  return 'Erreur lors du paiement. Réessayez.';
    }
  }

  confirmPayer(): void {
    if (!this.paymentDepositId) return;
    this.payerConfirming.set(true);
    this.serverError.set(null);

    this.paymentSvc.confirmPayer(this.paymentDepositId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.payerConfirming.set(false);
          this.payerConfirmed.set(true);
          this.payerConfirmStep.set(false);
          this.notif.success('Restauration confirmée ! Le propriétaire a été notifié.');
          this.cdr.markForCheck();
          // Pas de navigation immédiate : on affiche l'état de succès in-page
          // L'utilisateur peut naviguer lui-même via le bouton "Retour à l'accueil"
        },
        error: (err: HttpErrorResponse) => {
          this.payerConfirming.set(false);
          this.serverError.set(this.mapError(err));
          this.cdr.markForCheck();
        },
      });
  }

  rejectPayer(): void {
  if (!this.paymentDepositId) return;
  this.payerConfirming.set(true);
  this.serverError.set(null);
 
  this.paymentSvc.rejectPayer(this.paymentDepositId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.payerConfirming.set(false);
        this.payerConfirmStep.set(false);
        this.payerConfirmed.set(null);
        
        this.showRejectModal.set(true);
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.payerConfirming.set(false);
        this.serverError.set(this.mapError(err));
        this.cdr.markForCheck();
      },
    });
}

closeRejectModal(): void {
  this.showRejectModal.set(false);
  this.router.navigate(['/app/search']);
}

  goBack(): void { this.router.navigate(['/']); }
  goToChat(): void { this.router.navigate(['/app/chat']); }
}