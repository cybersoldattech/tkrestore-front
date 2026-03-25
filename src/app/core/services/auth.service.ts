// src/app/core/services/auth.service.ts

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { AuthUser, RegisterRequest, AuthResponse, LoginRequest } from './models/auth.models';
import { toObservable } from '@angular/core/rxjs-interop';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http    = inject(HttpClient);
  private readonly router  = inject(Router);
  private readonly storage = inject(TokenStorageService);

  private readonly BASE = `${environment.apiUrl}/auth`;
  private readonly AUTH_BASE = `${environment.apiUrl}/auth`;


  // ── État réactif ──────────────────────────────────────────────────
  readonly currentUser = signal<AuthUser | null>(this.storage.getUser());
    readonly currentUser$ = toObservable(this.currentUser);
  readonly isLoggedIn  = computed(() => !!this.currentUser());
  readonly isAdmin     = computed(() => this.currentUser()?.role === 'ADMIN');

  // ── Register ──────────────────────────────────────────────────────
  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/register`, payload);
  }

  // ── Login ─────────────────────────────────────────────────────────
  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/login`, payload).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((err) => throwError(() => err)),
    );
  }

  // // ── OTP Verification ──────────────────────────────────────────────
  // verifyOtp(email: string, otp: string): Observable<any> {
  //   return this.http.post(`${this.BASE}/otp/verify`, { email, otp });
  // }

  verifyOtp(email: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/otp/verify`, { email, otp }).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      catchError((err) => throwError(() => err)),
    );
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.BASE}/otp/resend`, { email });
  }

  // ── Password reset flow (forgot + reset) ─────────────────────────
  forgotPassword(payload: {
    country_code?: string;
    phone: string; // backend expects E.164
    email: string;
    phone_e164?: string;
  }): Observable<{ reset_context_id: string; expires_in_seconds: number; message: string }> {
    return this.http.post<{ reset_context_id: string; expires_in_seconds: number; message: string }>(
      `${this.AUTH_BASE}/forgot-password`,
      payload,
    );
  }

  resetPassword(payload: {
    reset_context_id: string;
    otp: string;
    new_password: string;
    new_password_confirmation: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.AUTH_BASE}/reset-password`,
      payload,
    );
  }

  verifyResetOtp(payload: {
    reset_context_id: string;
    otp: string;
  }): Observable<{ message: string; reset_context_id: string }> {
    return this.http.post<{ message: string; reset_context_id: string }>(
      `${this.AUTH_BASE}/verify-reset-otp`,
      payload,
    );
  }


  // ── Logout ────────────────────────────────────────────────────────
  logout(): void {
    this.http.post(`${this.BASE}/logout`, {})
      .subscribe({ error: () => {} }); // fire-and-forget — révoque le token côté serveur
    this.clearSession();
  }

  // ── Me — recharger le profil depuis l'API ─────────────────────────
  fetchMe(): Observable<{ user: AuthUser }> {
    return this.http.get<{ user: AuthUser }>(`${this.BASE}/me`).pipe(
      tap((res) => {
        this.currentUser.set(res.user);
        this.storage.saveUser(res.user);
      }),
    );
  }

  // ── Mettre à jour le signal depuis n'importe quel service ─────────
  // Appelé par UserService après updateProfile / updateAvatar
  updateCurrentUser(user: Partial<AuthUser> | AuthUser): void {
    const current = this.currentUser();
    const updated = { ...current, ...user };
    
    // Extract country_code from country.iso_code if available
    if (updated.country?.iso_code && !updated.country_code) {
      updated.country_code = updated.country.iso_code;
    }
    
    this.currentUser.set(updated as AuthUser);
    this.storage.saveUser(updated as AuthUser);
  }

  // ── Helpers internes ──────────────────────────────────────────────
  private handleAuthSuccess(res: AuthResponse): void {
    this.storage.saveTokens(res.tokens);
    this.storage.saveUser(res.user);
    this.currentUser.set(res.user);
  }

  private clearSession(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}