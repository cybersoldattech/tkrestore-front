// src/app/core/services/payment.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  interval,
  switchMap,
  takeWhile,
  tap,
  distinctUntilKeyChanged,
} from 'rxjs';
import { environment } from '../../../environments/environment';

// ── Models ────────────────────────────────────────────────────

export interface InitiatePaymentPayload {
  item_id:      string | number;
  phone_number: string;
  provider:     string;        // e.g. "MTN_MOMO_CMR"
}

export type PaymentStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'COMPLETED'
  | 'FAILED'
  | 'PROCESSING'
  | 'REJECTED'
  | 'SUBMITTED'
  | 'IN_RECONCILIATION'
  | 'REFUNDED';
  

export interface PaymentResponse {
  deposit_id:     string;
  status:         PaymentStatus;
  amount:         string;
  currency:       string;
  provider:       string;
  successfulUrl?:  string;
  cleanUrl?:       string;
  failureUrl?:      string;
  phone_number:   string;
  created_at:     string;
  completed_at:   string | null;
  failure_reason: string | null;
  payer: Payer;
}

export interface Payer {
  type:     string;
  accountDetails: accountDetails;
}


export interface accountDetails {
  phoneNumber:     string;
  provider:  string;
}


export interface InitiatePaymentResponse {
  message:  string;
  payment:  PaymentResponse;
}

export interface StatusResponse {
  payment: PaymentResponse;
  clearUrl?:string;
}

// ── Service ───────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/payments`;

  // ── State ─────────────────────────────────────────────────
  readonly currentPayment = signal<PaymentResponse | null>(null);
  readonly isPolling      = signal(false);

  // ─────────────────────────────────────────────────────────
  //  Initiate a deposit
  // ─────────────────────────────────────────────────────────

  initiatePayment(payload: InitiatePaymentPayload): Observable<InitiatePaymentResponse> {
    return this.http.post<InitiatePaymentResponse>(this.BASE, payload).pipe(
      tap(res => this.currentPayment.set(res.payment))
    );
  }

  checkNumber(phoneNumber: string): Observable<{ valid: boolean; provider: string; country: string }> {
    return this.http.post<{ valid: boolean; provider: string; country: string }>(
      `${this.BASE}/check-number`,
      { phone_number: phoneNumber }
    );
  }
  // ─────────────────────────────────────────────────────────
  //  Check deposit status (single call)
  // ─────────────────────────────────────────────────────────

  checkStatus(depositId: string): Observable<StatusResponse> {
    return this.http
      .get<StatusResponse>(`${this.BASE}/${depositId}/status`)
      .pipe(tap(res => this.currentPayment.set(res.payment)));
  }

  // ─────────────────────────────────────────────────────────
  //  Poll status until terminal state
  //
  //  Usage:
  //    this.paymentService
  //      .pollStatus(depositId)
  //      .subscribe(res => console.log(res.payment.status));
  // ─────────────────────────────────────────────────────────

  pollStatus(
    depositId:        string,
    intervalMs:       number = 3000,
    maxAttempts:      number = 40        // 2 minutes max
  ): Observable<StatusResponse> {
    this.isPolling.set(true);
    let attempts = 0;

    return interval(intervalMs).pipe(
      switchMap(() => this.checkStatus(depositId)),
      tap(res => this.currentPayment.set(res.payment)),
      distinctUntilKeyChanged('payment' as any),
      takeWhile(res => {
        attempts++;
        const terminal = this.isTerminalStatus(res.payment.status);
        if (terminal || attempts >= maxAttempts) {
          this.isPolling.set(false);
          return false;
        }
        return true;
      }, true /* emit last value */)
    );
  }

  // ─────────────────────────────────────────────────────────
  //  Initiate a refund
  // ─────────────────────────────────────────────────────────

  // initiateRefund(depositId: string): Observable<{ message: string; refund_id: string; status: string }> {
  //   return this.http.post<{ message: string; refund_id: string; status: string }>(
  //     `${this.BASE}/${depositId}/refund`,
  //     {}
  //   );
  // }


  // ─────────────────────────────────────────────────────────
  //  Payer confirmation workflow
  // ─────────────────────────────────────────────────────────

  confirmPayer(depositId: string): Observable<{ message: string; payment: PaymentResponse }> {
    return this.http.post<{ message: string; payment: PaymentResponse }>(
      `${this.BASE}/${depositId}/confirm-payer`,
      {}
    );
  }

  rejectPayer(depositId: string): Observable<{ message: string; payment: PaymentResponse }> {
    return this.http.post<{ message: string; payment: PaymentResponse }>(
      `${this.BASE}/${depositId}/reject-payer`,
      {}
    );
  }


  // ─────────────────────────────────────────────────────────
  //  Helpers
  // ─────────────────────────────────────────────────────────

  isTerminalStatus(status: PaymentStatus): boolean {
    return ['COMPLETED', 'FAILED', 'REJECTED', 'REFUNDED'].includes(status);
  }

  isSuccessStatus(status: PaymentStatus): boolean {
    return status === 'COMPLETED';
  }

  clearPayment(): void {
    this.currentPayment.set(null);
    this.isPolling.set(false);
  }
}