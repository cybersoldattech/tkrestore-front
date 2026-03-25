import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';

interface QRResponse {
  success: boolean;
  message: string;
  qrcode_url?: string;
}

@Component({
  selector: 'app-secure-object',
  templateUrl: './secure-object.html',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecureObject {
  private fb     = inject(FormBuilder);
  private http   = inject(HttpClient);
  private router = inject(Router);
  readonly auth  = inject(AuthService);
  readonly lang  = inject(LanguageService);
  private readonly notif   = inject(NotificationService);

  // Accès direct aux traductions de la section secure_object
  readonly t = computed(() => this.lang.t().secure_object);

  readonly user = computed(() => this.auth.currentUser());

  readonly form = this.fb.group({
    name:        [{ value: '', disabled: true }, Validators.required],
    email:       [{ value: '', disabled: true }],
    phone:       [{ value: '', disabled: true }],
    label:       ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly submitted = signal(false);
  readonly loading   = signal(false);
  readonly error     = signal<string | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
      this.prefillUserData();
    }
  }

  private prefillUserData(): void {
    const user = this.user();
    if (user) {
      this.form.patchValue({
        name:  user.full_name ?? '',
        email: user.email    ?? '',
        phone: user.phone    ?? '', 
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.submitted.set(true);

    const payload = {
      label:       this.form.value.label!,
      description: this.form.value.description!,
    };

    this.http.post<QRResponse>(`${environment.apiUrl}/qrcodes`, payload).subscribe({
      next: (res) => {
        this.loading.set(false); 
        if (res.success) {
          this.notif.success('Qr code cree avec success.');
          this.router.navigate(['/app/documents']);
        } else {
          this.error.set(res.message || 'Erreur inconnue');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false); 
        this.notif.error('Erreur lors de la creation du Qr code.');
        this.error.set(err.error?.message || 'Erreur de connexion');
      },
    });
  }

  get f() { return this.form.controls; }
}