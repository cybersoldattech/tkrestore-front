// src/app/core/services/email-verification.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VerificationStatus {
  email_verified: boolean;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class EmailVerificationService {
  private readonly http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/v1/auth/otp`;

  // Renvoyer l'email de vérification
  resend(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.BASE}/resend`, {});
  }

  // Vérifier le statut (polling)
  checkStatus(): Observable<VerificationStatus> {
    return this.http.get<VerificationStatus>(`${this.BASE}/status`);
  }
}
