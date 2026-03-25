// src/app/core/services/document.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, SubCategory, DocumentSearchParams, PaginatedResponse, DocumentDeclaration, CreateDeclarationRequest, RestorePaymentRequest, RestorePaymentResponse } from './models/document.models';

export interface ChartDataset {
  key: string;
  label: string;
  data: number[];
  color: string;
}
 
export interface ChartDataResponse {
  view: 'monthly' | 'yearly';
  year?: number;
  available_years: number[];
  labels: string[];
  datasets: ChartDataset[];
  currency: string;
}

export interface HomeStatsResponse {
  data: {
    countries_count: number;
    users_count: number;
    items_active_matched_count: number;
    documents_refunded_count: number;
  };
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/items`;

  // ── Catégories ────────────────────────────────────────────────────
  getCategories(): Observable<{ data: Category[] }> {
    return this.http.get<{ data: Category[] }>(`${environment.apiUrl}/categories`);
  }

  getSubCategories(categoryId: string): Observable<{ data: SubCategory[] }> {
    return this.http.get<{ data: SubCategory[] }>(
      `${environment.apiUrl}/categories/${categoryId}/subs`
    );
  }

  // ── Recherche publique ────────────────────────────────────────────
search(params: DocumentSearchParams): Observable<PaginatedResponse<DocumentDeclaration>> {
    let httpParams = new HttpParams();
    if (params.q)              httpParams = httpParams.set('q',              params.q);
    if (params.type)           httpParams = httpParams.set('type',           params.type);
    if (params.category_id)    httpParams = httpParams.set('category_id',    params.category_id);
    if (params.sub_category_id)httpParams = httpParams.set('sub_category_id',params.sub_category_id);
    if (params.country_id)     httpParams = httpParams.set('country_id',     params.country_id);
    if (params.guest_email)    httpParams = httpParams.set('guest_email',    params.guest_email);
    if (params.guest_phone)    httpParams = httpParams.set('guest_phone',    params.guest_phone);
    if (params.sort_by)        httpParams = httpParams.set('sort_by',        params.sort_by);
    if (params.page)           httpParams = httpParams.set('page',           String(params.page));
    if (params.per_page)       httpParams = httpParams.set('per_page',       String(params.per_page ?? 12));


    return this.http.get<PaginatedResponse<DocumentDeclaration>>(this.BASE, { params: httpParams });
  }

  getById(id: string): Observable<{ data: DocumentDeclaration }> {
    return this.http.get<{ data: DocumentDeclaration }>(`${this.BASE}/${id}`);
  }

  // ── Déclaration (authentifiée) ────────────────────────────────────
  declare(request: CreateDeclarationRequest): Observable<{ data: DocumentDeclaration; message: string }> {
    const formData = new FormData();

    formData.append('type',             request.type);
    formData.append('title',            request.title);
    formData.append('event_date',       request.event_date);
    formData.append('location',         request.location);
    formData.append('category_id',      request.category_id);
    formData.append('sub_category_id',  request.sub_category_id);
    formData.append('country_id',       request.country_id);

    if (request.name_on_item)     formData.append('name_on_item',     request.name_on_item);
    if (request.reference_number) formData.append('reference_number', request.reference_number);
    if (request.description)      formData.append('description',      request.description);

    // Photos
    request.photos?.forEach((file) => formData.append('photos[]', file, file.name));

    return this.http.post<{ data: DocumentDeclaration; message: string }>(this.BASE, formData);
  }

  // Mes déclarations
  getMyDeclarations(
    params: Partial<{ type?: string; status?: string; page?: number; per_page?: number }> = {}
  ): Observable<PaginatedResponse<DocumentDeclaration>> {
    let httpParams = new HttpParams();
    if (params.type)                   httpParams = httpParams.set('type',     params.type);
    if (params.status)                 httpParams = httpParams.set('status',   params.status);
    if (params.page !== undefined)     httpParams = httpParams.set('page',     String(params.page));
    if (params.per_page !== undefined) httpParams = httpParams.set('per_page', String(params.per_page));
    return this.http.get<PaginatedResponse<DocumentDeclaration>>(`${this.BASE}/mine`, { params: httpParams });
  }

  getUserStats(): Observable<{stats: any}> {
    return this.http.get<{stats: any}>(`${this.BASE}/stats`);
  }

   
getChartData(view: 'monthly' | 'yearly', year?: number): Observable<ChartDataResponse> {
  const params: Record<string, string> = { view };
  if (year) params['year'] = year.toString();
 
  return this.http.get<ChartDataResponse>(
    `${this.BASE}/chart-data`,
    { params }
  );
}


  getUserTransactions(year?: number) {
    return this.http.get<{ transactions: any[] }>(`${this.BASE}/transactions`, {
      params: year ? { year } : {}
    });
  }


  deleteDeclaration(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }

  // User's paid restorations (SUCCESS payments)
  getMyRestorations(params: Partial<{page?: number, per_page?: number}> = {}): Observable<PaginatedResponse<DocumentDeclaration>> {
    let httpParams = new HttpParams();
    if (params.page !== undefined) httpParams = httpParams.set('page', String(params.page));
    if (params.per_page !== undefined) httpParams = httpParams.set('per_page', String(params.per_page));
    return this.http.get<PaginatedResponse<DocumentDeclaration>>(`${this.BASE}/restored`, { params: httpParams });
  }

  // ── Paiement mobile ───────────────────────────────────────────────
  initiateRestorePayment(
    request: RestorePaymentRequest
  ): Observable<RestorePaymentResponse> {
    return this.http.post<RestorePaymentResponse>(
      `${environment.apiUrl}/payments`,
      {
        item_id:      request.item_id,
        phone_number: request.phone_number,
        provider:     request.provider,
      },
    );
  }

  getPaymentStatus(paymentId: string): Observable<RestorePaymentResponse> {
    return this.http.get<RestorePaymentResponse>(
      `${environment.apiUrl}/payments/${paymentId}/status`
    );
  }

  // ── Home stats (public) ───────────────────────────────────────────
  getHomeStats(): Observable<HomeStatsResponse> {
    return this.http.get<HomeStatsResponse>(`${environment.apiUrl}/home/stats`);
  }

  // Recent found items <24h
  recent(): Observable<{data: DocumentDeclaration[]}> {
    return this.http.get<{data: DocumentDeclaration[]}>(`${this.BASE}/recent`);
  }
}