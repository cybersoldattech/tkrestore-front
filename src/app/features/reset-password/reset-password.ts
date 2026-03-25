import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { COUNTRIES } from '../../core/services/models/countries';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notif = inject(NotificationService);

  readonly isLoading = signal(false);
  readonly step = signal<1 | 2>(1);
  readonly serverError = signal<string | null>(null);


  readonly countries = COUNTRIES;

  readonly requestForm = this.fb.nonNullable.group({
    country_code: ['CMR', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    phone_e164: [''],
  });

  readonly resetForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    new_password_confirmation: ['', [Validators.required]],
  });

 

  onResetPassword(): void {
    this.serverError.set(null);

    const ctx = this.resetContextId();
    if (!ctx) {
      this.notif.error('Contexte de réinitialisation manquant. Recommencez.');
      this.step.set(1);
      return;
    }

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.notif.error('Veuillez compléter le formulaire.');
      return;
    }

    const v = this.resetForm.getRawValue();

    if (v.new_password !== v.new_password_confirmation) {
      this.notif.error('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    this.isLoading.set(true);

    this.auth.resetPassword({
      reset_context_id: ctx,
      otp: v.otp,
      new_password: v.new_password,
      new_password_confirmation: v.new_password_confirmation,
    }).subscribe({
      next: () => {
        this.notif.success('Mot de passe réinitialisé avec succès.');
        this.resetForm.reset();
        this.resetContextId.set(null);
        this.step.set(1);
        // redirection vers login
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        this.serverError.set(err?.error?.message ?? 'OTP incorrect ou expiré.');

        this.notif.error(this.serverError() || 'Erreur');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }

}

