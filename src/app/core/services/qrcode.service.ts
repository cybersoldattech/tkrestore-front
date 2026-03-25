// Full content for QRCodeService
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { PaginatedResponse } from './models/document.models';

export interface QRCode {
  id: string;
  label?:string;
  title?: string;
  description?: string;
  image_url: string;
  blurred_url?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  reference: string;
  path?: string;
  location?: string;
  country_code?: string;
}

export interface ToggleQRStatusRequest {
  status: 'ACTIVE' | 'INACTIVE';
}

@Injectable({ providedIn: 'root' })
export class QRCodeService {
  private readonly http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/qrcodes`; // Adjust if needed

  getMyQRCodes(params?: Partial<{is_active: string; page: number; per_page: number}>): Observable<PaginatedResponse<QRCode>> {
    let httpParams = new HttpParams();
    if (params?.is_active) httpParams = httpParams.set('is_active', params.is_active);
    if (params?.page) httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page) httpParams = httpParams.set('per_page', String(params.per_page ?? 12));
    return this.http.get<PaginatedResponse<QRCode>>(`${this.BASE}/mine`, { params: httpParams });
  }

  toggleStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Observable<{ data: QRCode }> {
    return this.http.patch<{ data: QRCode }>(`${this.BASE}/${id}`, { is_active: status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }

  /**
   * Public QR lookup for scan - no auth
   */
  getPublicQr(reference: string): Observable<{ data: QRCode }> {
    return this.http.get<{ data: QRCode }>(`${this.BASE}/public/${reference}`);
  }
}

