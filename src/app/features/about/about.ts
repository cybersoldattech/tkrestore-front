import {
  Component, inject, signal, OnInit, OnDestroy, DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CountryService } from '../../core/services/country.service';
import { CountryFlagPipe } from '../../pipes/country-flag.pipe';
import type { CountryWithFlag, CountryPricing } from '../../types/country';
import { LanguageService } from '../../core/services/language.service';

// ── Modèle d'une vidéo tutoriel ─────────── ─────────────────────────────
export interface TutorialVideo {
  /** ID YouTube (ex: dQw4w9WgXcQ) — remplacer les PLACEHOLDER par les vrais IDs */
  youtubeId: string;
  /** Clé de catégorie pour le filtre */
  category: 'start' | 'payment' | 'handover' | 'features' | 'settings';
  /** Durée affichée (ex: "5:30") */
  duration: string;
  /** Traductions titre/description */
  i18n: {
    fr: { title: string; description: string };
    en: { title: string; description: string };
    es: { title: string; description: string };
  };
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, CountryFlagPipe],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements OnInit, OnDestroy {

  private countryService = inject(CountryService);
  readonly lang          = inject(LanguageService);
  private destroyRef     = inject(DestroyRef);

  // ── Pays & tarifs ───────────────────────────────────────────────────
  countries             = signal<CountryWithFlag[]>([]);
  selectedCountryPricing = signal<CountryPricing | null>(null);
  selectedCountryId     = signal<string | null>(null);
  loading               = signal(false);
  error                 = signal<string | null>(null);
  openCategories        = signal<Set<string>>(new Set());

  // ── Tutoriels ───────────────────────────────────────────────────────
  activeVideoIndex      = signal<number>(0);
  modalOpen             = signal<boolean>(false);
  modalVideoIndex       = signal<number>(0);
  activeCategory        = signal<string>('all');

  private keyHandler = (e: KeyboardEvent) => {
    if (!this.modalOpen()) return;
    if (e.key === 'Escape')      this.closeModal();
    if (e.key === 'ArrowRight')  this.navigateModal(1);
    if (e.key === 'ArrowLeft')   this.navigateModal(-1);
  };

  // ── Données statiques des vidéos ─────────────────────────────────────
  // INSTRUCTIONS : remplacez chaque youtubeId par le vrai ID de vos vidéos YouTube.
  // L'ID se trouve dans l'URL : youtube.com/watch?v=VOTRE_ID
  readonly tutorials: TutorialVideo[] = [
    {
      youtubeId: 'PLACEHOLDER_1',
      category: 'start',
      duration: '5:20',
      i18n: {
        fr: { title: 'Comment déclarer un document perdu', description: 'Suivez le processus complet de déclaration d\'un document perdu sur TKRestore.' },
        en: { title: 'How to declare a lost document',    description: 'Follow the complete process for declaring a lost document on TKRestore.' },
        es: { title: 'Cómo declarar un documento perdido', description: 'Sigue el proceso completo para declarar un documento perdido en TKRestore.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_2',
      category: 'start',
      duration: '4:10',
      i18n: {
        fr: { title: 'Signaler un document trouvé',           description: 'Comment publier un document trouvé et aider son propriétaire à le récupérer.' },
        en: { title: 'Report a found document',              description: 'How to publish a found document and help its owner recover it.' },
        es: { title: 'Reportar un documento encontrado',     description: 'Cómo publicar un documento encontrado y ayudar a su propietario a recuperarlo.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_3',
      category: 'features',
      duration: '6:45',
      i18n: {
        fr: { title: 'Le système de matching automatique',    description: 'Comprendre comment TKRestore rapproche automatiquement les déclarations perdues et trouvées.' },
        en: { title: 'The automatic matching system',        description: 'Understand how TKRestore automatically matches lost and found declarations.' },
        es: { title: 'El sistema de emparejamiento automático', description: 'Entiende cómo TKRestore empareja automáticamente las declaraciones de perdidos y encontrados.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_4',
      category: 'payment',
      duration: '5:05',
      i18n: {
        fr: { title: 'Payer via Mobile Money (MTN, Orange…)', description: 'Guide complet du paiement sécurisé par Mobile Money pour récupérer votre document.' },
        en: { title: 'Pay via Mobile Money (MTN, Orange…)',  description: 'Complete guide to secure Mobile Money payment to recover your document.' },
        es: { title: 'Pagar via Mobile Money (MTN, Orange…)', description: 'Guía completa de pago seguro por Mobile Money para recuperar tu documento.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_5',
      category: 'handover',
      duration: '7:30',
      i18n: {
        fr: { title: 'Le processus de remise (handover)',     description: 'Étape par étape : générer le code OTP, valider la remise et débloquer le paiement.' },
        en: { title: 'The handover process step by step',    description: 'Step by step: generate the OTP code, validate the handover and unlock the payment.' },
        es: { title: 'El proceso de entrega paso a paso',   description: 'Paso a paso: generar el código OTP, validar la entrega y desbloquear el pago.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_6',
      category: 'features',
      duration: '3:20',
      i18n: {
        fr: { title: 'Utiliser le chat temps réel',          description: 'Communiquer en toute sécurité avec le trouveur ou le propriétaire via la messagerie intégrée.' },
        en: { title: 'Using the real-time chat',             description: 'Communicate securely with the finder or owner via the integrated messaging system.' },
        es: { title: 'Usar el chat en tiempo real',          description: 'Comunícate de forma segura con el encontrador o el propietario a través de la mensajería integrada.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_7',
      category: 'settings',
      duration: '3:55',
      i18n: {
        fr: { title: 'Notifications push — rester informé',  description: 'Configurer et comprendre les notifications push pour suivre vos déclarations en temps réel.' },
        en: { title: 'Push notifications — stay informed',   description: 'Set up and understand push notifications to track your declarations in real time.' },
        es: { title: 'Notificaciones push — mantente informado', description: 'Configura y comprende las notificaciones push para seguir tus declaraciones en tiempo real.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_8',
      category: 'features',
      duration: '2:50',
      i18n: {
        fr: { title: 'Scanner un QR Code',                   description: 'Comment utiliser le scanner QR Code pour signaler un objet trouvé instantanément.' },
        en: { title: 'Scanning a QR Code',                   description: 'How to use the QR Code scanner to report a found item instantly.' },
        es: { title: 'Escanear un código QR',                description: 'Cómo usar el escáner de código QR para reportar un objeto encontrado al instante.' },
      },
    },
    {
      youtubeId: 'PLACEHOLDER_9',
      category: 'settings',
      duration: '4:00',
      i18n: {
        fr: { title: 'Créer et gérer votre profil',          description: 'Personnalisez votre compte, sécurisez votre mot de passe et configurez vos préférences.' },
        en: { title: 'Create and manage your profile',       description: 'Customize your account, secure your password and configure your preferences.' },
        es: { title: 'Crear y gestionar tu perfil',          description: 'Personaliza tu cuenta, asegura tu contraseña y configura tus preferencias.' },
      },
    },
  ];

  // ── Catégories de filtre ─────────────────────────────────────────────
  get filterCategories(): Array<{ key: string; label: Record<string, string> }> {
    return [
      { key: 'all',      label: { fr: 'Tous', en: 'All', es: 'Todos' } },
      { key: 'start',    label: { fr: 'Démarrage', en: 'Getting started', es: 'Inicio' } },
      { key: 'payment',  label: { fr: 'Paiement', en: 'Payment', es: 'Pago' } },
      { key: 'handover', label: { fr: 'Remise', en: 'Handover', es: 'Entrega' } },
      { key: 'features', label: { fr: 'Fonctionnalités', en: 'Features', es: 'Funciones' } },
      { key: 'settings', label: { fr: 'Paramètres', en: 'Settings', es: 'Ajustes' } },
    ];
  }

  get filteredVideos(): TutorialVideo[] {
    const cat = this.activeCategory();
    return cat === 'all' ? this.tutorials : this.tutorials.filter(v => v.category === cat);
  }

  get activeVideo(): TutorialVideo {
    const idx = Math.min(this.activeVideoIndex(), this.filteredVideos.length - 1);
    return this.filteredVideos[idx] ?? this.tutorials[0];
  }

  get modalVideo(): TutorialVideo {
    return this.filteredVideos[this.modalVideoIndex()] ?? this.tutorials[0];
  }

  // ── Helpers i18n vidéo ──────────────────────────────────────────────
  videoTitle(v: TutorialVideo): string {
    const code = this.lang.currentCode() as 'fr' | 'en' | 'es';
    return v.i18n[code]?.title ?? v.i18n.fr.title;
  }

  videoDescription(v: TutorialVideo): string {
    const code = this.lang.currentCode() as 'fr' | 'en' | 'es';
    return v.i18n[code]?.description ?? v.i18n.fr.description;
  }

  thumbUrl(youtubeId: string): string {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  }

  embedUrl(youtubeId: string): string {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  }

  categoryLabel(cat: string): string {
    const code = this.lang.currentCode();
    const found = this.filterCategories.find(c => c.key === cat);
    return found?.label[code] ?? cat;
  }

  // ── Actions tutoriels ───────────────────────────────────────────────
  selectVideo(index: number): void {
    this.activeVideoIndex.set(index);
  }

  setFilter(cat: string): void {
    this.activeCategory.set(cat);
    this.activeVideoIndex.set(0);
  }

  openModal(index: number): void {
    this.modalVideoIndex.set(index);
    this.modalOpen.set(true);

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.modalOpen.set(false);

    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  navigateModal(dir: number): void {
    const next = this.modalVideoIndex() + dir;
    const max  = this.filteredVideos.length - 1;
    if (next >= 0 && next <= max) {
      this.modalVideoIndex.set(next);
    }
  }

  handleOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  // ── Pays ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', this.keyHandler);
      this.countryService.loadCountries();
      this.countryService.countries$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(countries => this.countries.set(countries));
    }
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.keyHandler);
      document.body.style.overflow = '';
    }
  }

  onSelectCountry(countryId: string): void {
    if (this.selectedCountryId() === countryId) return;
    this.selectedCountryId.set(countryId);
    this.loading.set(true);
    this.error.set(null);
    this.selectedCountryPricing.set(null);
    this.openCategories.set(new Set());

    this.countryService.getCountryPricing(countryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pricing) => {
          this.selectedCountryPricing.set(pricing ?? null);
          if (pricing?.categories?.[0]) {
            this.openCategories.set(new Set([pricing.categories[0].id]));
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.lang.t().about.loadingErrorMessage);
          this.loading.set(false);
        },
      });
  }

  toggleCategory(categoryId: string): void {
    const current = new Set(this.openCategories());
    current.has(categoryId) ? current.delete(categoryId) : current.add(categoryId);
    this.openCategories.set(current);
  }

  isCategoryOpen(categoryId: string): boolean {
    return this.openCategories().has(categoryId);
  }

  onFlagError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}