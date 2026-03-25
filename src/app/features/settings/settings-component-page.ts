// src/app/features/settings/settings-component-page.ts

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { UserService } from '../../core/services/user.service';
import { COUNTRIES } from '../../core/services/models/countries';

// ── Validateur : les deux mots de passe doivent correspondre ────────
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const newPwd = group.get('newPassword')?.value;
  const confirmPwd = group.get('password_confirmation')?.value;
  return newPwd && confirmPwd && newPwd !== confirmPwd
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-settings-component-page',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-component-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponentPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notif = inject(NotificationService);
  private readonly userSvc = inject(UserService);
  readonly lang = inject(LanguageService);

  readonly savingLanguage = signal(false);

  // Visibilité des mots de passe
  readonly showCurrent = signal(false);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);

  // État des soumissions
  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);
  readonly showDeactivate = signal(false);
  readonly showDeleteConfirm = signal(false);

  // Erreurs serveur (validation API)
  readonly profileErrors = signal<Record<string, string[]>>({});
  readonly passwordErrors = signal<Record<string, string[]>>({});

  // Préférences (toggles)
  readonly emailNotifications = signal(true);
  readonly twoFactorEnabled = signal(false);

  // Formulaire Profil — pré-rempli avec les données actuelles
  readonly profileForm = this.fb.nonNullable.group({
    full_name: [
      this.auth.currentUser()?.full_name ?? '',
      [Validators.required, Validators.minLength(2)],
    ],
    username: [
      this.auth.currentUser()?.username ?? '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_\-]+$/),
      ],
    ],
    phone: [
      this.auth.currentUser()?.phone ?? '',
      [Validators.pattern(/^\+?[0-9\s\-]{6,15}$/)],
    ],
    country_code: [
      { 
        value: this.auth.currentUser()?.country_code ??
          this.auth.currentUser()?.country?.iso_code ??
          '',
        disabled: true 
      },
      [],
    ],
    language: [
      this.auth.currentUser()?.language ?? 'fr',
      [Validators.required, Validators.pattern(/^(fr|en)$/)],
    ],
  });

  readonly countries = COUNTRIES;

  // Email affiché mais non éditable
  readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '—');

  // Formulaire Mot de passe
  readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  // Force du mot de passe (0–4)
  readonly passwordStrength = computed(() => {
    const pwd = this.passwordForm.controls.newPassword.value;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4);
  });

  readonly strengthLabel = computed(() =>
    ['', 'Faible', 'Moyen', 'Bon', 'Excellent'][this.passwordStrength()],
  );

  readonly strengthColor = computed(() =>
    ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][
      this.passwordStrength()
    ],
  );

  // Sauvegarder le profil
  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.savingProfile.set(true);
    this.profileErrors.set({});

    const { full_name, username, phone, country_code, language } =
      this.profileForm.getRawValue();

    this.userSvc
      .updateProfile({
        full_name,
        username,
        phone: phone || undefined,
        country_code: country_code || undefined,
        language,
      })
      .subscribe({
        next: () => {
          this.notif.success(
            'Profil mis à jour avec succès.',
          );

          // Sync immédiate côté frontend
          const nextLang = language;
          if (nextLang === 'fr' || nextLang === 'en') {
            this.lang.setLanguage(nextLang);
          }

          this.savingProfile.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.savingProfile.set(false);

          if (err.status === 422 && err.error?.errors) {
            // Erreurs de validation Laravel → affichage champ par champ
            this.profileErrors.set(err.error.errors);
            this.notif.error('Veuillez verifier vos champs');
          } else {
            this.notif.error('Erreur lors de la mise à jour. Réessayez.');
          }
        },
      });
  }

  // Changer le mot de passe
  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.savingPassword.set(true);
    this.passwordErrors.set({});

    const { currentPassword, newPassword, password_confirmation } =
      this.passwordForm.getRawValue();

    this.userSvc
      .updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation,
      })
      .subscribe({
        next: () => {
          this.savingPassword.set(false);
          this.passwordForm.reset();
          this.notif.success('Mot de passe modifié avec succès.');
        },
        error: (err: HttpErrorResponse) => {
          this.savingPassword.set(false);

          if (err.status === 422 && err.error?.errors) {
            this.passwordErrors.set(err.error.errors);
          } else if (err.status === 422) {
            this.notif.error(err.error?.message ?? 'Mot de passe actuel incorrect.');
          } else {
            this.notif.error('Erreur lors du changement. Réessayez.');
          }
        },
      });
  }

  // Helper : premier message d'erreur pour un champ
  fieldError(field: string, errors: Record<string, string[]>): string | null {
    return errors[field]?.[0] ?? null;
  }

  // Toggles préférences
  toggleEmailNotif(): void {
    this.emailNotifications.update((v) => !v);
    this.notif.info(
      this.emailNotifications()
        ? 'Notifications email activées.'
        : 'Notifications email désactivées.',
    );
  }

  toggle2FA(): void {
    this.twoFactorEnabled.update((v) => !v);
    this.notif.info(
      this.twoFactorEnabled()
        ? 'Authentification à deux facteurs activée.'
        : 'Authentification à deux facteurs désactivée.',
    );
  }

  readonly deactivating = signal(false);
  readonly deleting = signal(false);

  // Désactivation du compte
  requestDeactivation(): void {
    if (this.deactivating() || this.deleting()) return;
    this.deactivating.set(true);

    this.userSvc.requestDeactivation().subscribe({
      next: () => {
        this.notif.success(
          'Compte désactivé avec succès.',
          'Vous allez recevoir un email de confirmation.'
        );
        this.showDeactivate.set(false);
        this.deactivating.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.deactivating.set(false);
        this.notif.error(
          'Impossible de désactiver votre compte.',
          err.error?.message
        );
      },
    });
  }

  // Suppression du compte
  requestAccountDeletion(): void {
    if (this.deleting() || this.deactivating()) return;
    this.deleting.set(true);

    this.userSvc.deleteAccount().subscribe({
      next: () => {
        this.notif.success(
          'Compte supprimé.',
          'Vous allez recevoir un email de confirmation.'
        );
        this.showDeleteConfirm.set(false);
        this.deleting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting.set(false);
        this.notif.error(
          'Impossible de supprimer votre compte.',
          err.error?.message
        );
      },
    });
  }
}


