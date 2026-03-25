// src/app/core/services/user.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { AuthUser } from './models/auth.models';


export interface UpdateProfileRequest {
  full_name: string;
  username:  string;
  phone?:    string;
  language?: string;
  country_code?: string;  // NEW: ISO2 code (e.g. 'FR')
}

export interface UpdatePasswordRequest {
  current_password:       string;
  password:               string;
  password_confirmation:  string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly BASE = `${environment.apiUrl}/users`;

  // ── Mettre à jour le profil ───────────────────────────────────────
  updateProfile(payload: UpdateProfileRequest): Observable<{ data: AuthUser }> {
    return this.http
      .put<{ data: AuthUser }>(`${this.BASE}/profile`, payload)
      .pipe(
        tap((res) => {
          // Mettre à jour le signal currentUser en temps réel
          this.auth.updateCurrentUser(res.data);
        }),
      );
  }

  // ── Changer le mot de passe ───────────────────────────────────────
  updatePassword(payload: UpdatePasswordRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.BASE}/password`, payload);
  }

  // ── Uploader un avatar ────────────────────────────────────────────
  requestDeactivation(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.BASE}/deactivation-request`, {});
  }

  deleteAccount(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.BASE}/delete-account`, {});
  }

  // Uploader un avatar
  updateAvatar(file: File): Observable<{ avatar_url: string }> { 
    const form = new FormData();
    form.append('avatar', file);
    return this.http
      .post<{ avatar_url: string }>(`${this.BASE}/avatar`, form)
      .pipe(
        tap((res) => {
          const user = this.auth.currentUser();
          if (user) {
            this.auth.updateCurrentUser({ ...user, avatar_url: res.avatar_url });
          }
        }),
      );
  }
}