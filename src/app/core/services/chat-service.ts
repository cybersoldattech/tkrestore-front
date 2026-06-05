import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiChatThread {
  id: string;
  reference: string;
  status: 'OPEN' | 'ACTIVE' | 'ARCHIVED';
  item: { id: string; title: string; type: string; status: string };
  other_user: { id: string; username: string; full_name: string; avatar_url: string | null };
  last_message: ApiMessage | null;
  last_message_at: string | null;
  is_loser: boolean;
  lost_id: string; 
  found_id: string;
  unread_count: number;
}

export interface ApiMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  sent_at: string;
  sender: { id: string; username: string; full_name: string; avatar_url: string | null };
  attachments?: ApiAttachment[];
}

export interface ApiAttachment {
  id: string;
  message_id?: string;
  type: string;
  mime_type: string;
  file_size: number;
  file_size_formatted: string;
  file_name: string;
  url: string;
  is_image: boolean;
  is_pdf: boolean;
  sender: { id: string; username: string; full_name: string; avatar_url: string | null };
  created_at: string;
}

export interface AttachmentUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: ApiAttachment;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getChats(): Observable<{ data: ApiChatThread[]; meta: { total: number } }> {
    return this.http.get<any>(`${this.base}/chats`);
  }

  getMessages(chatId: string, page = 1): Observable<{ data: ApiMessage[]; meta: any }> {
    return this.http.get<any>(`${this.base}/chats/${chatId}/messages`, {
      params: { page: page.toString() },
    });
  }

  sendMessageWithAttachments(
    chatId: string,
    body: string,
    files: File[],
    onProgress?: (pct: number) => void
  ): Observable<{ data: ApiMessage }> {
    const form = new FormData();
    form.append('body', body);
    for (const f of files) {
      form.append('files[]', f);
    }

    return new Observable(observer => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable && onProgress) {
          const pct = Math.round((event.loaded / event.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            observer.next(response);
            observer.complete();
          } catch {
            observer.error(new Error('Invalid JSON response'));
          }
        } else {
          observer.error(new Error(`HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => observer.error(new Error('Network error'));
      xhr.ontimeout = () => observer.error(new Error('Request timeout'));

      const token = this.getAccessToken();
      xhr.open('POST', `${this.base}/chats/${chatId}/messages`);
      xhr.setRequestHeader('Accept', 'application/json');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.timeout = 30000;
      xhr.send(form);

      return () => xhr.abort();
    });
  }

  markRead(chatId: string): Observable<{ data: { updated: number } }> {
    return this.http.patch<any>(`${this.base}/chats/${chatId}/read`, {});
  }

 
  getHandoverState(itemId: string): Observable<{ handover: any } | null> {
    return this.http.get<any>(`${this.base}/items/${itemId}/handover`);
  }

  initiateHandover(itemId: string): Observable<{ otp_code: string; handover: any }> {
    return this.http.post<any>(`${this.base}/items/${itemId}/handover/initiate`, {});
  }

  confirmHandover(itemId: string, otpCode: string): Observable<{ message: string }> {
    return this.http.post<any>(`${this.base}/items/${itemId}/handover/confirm`, {
      otp_code: otpCode,
    });
  }

  regenerateHandover(itemId: string): Observable<{ otp_code: string; handover: any }> {
    return this.http.post<any>(`${this.base}/items/${itemId}/handover/regenerate`, {});
  }

  // ── Attachments ─────────────────────────────────────────────────────────────

  uploadAttachment(chatId: string, file: File): Observable<AttachmentUploadProgress> {
    const formData = new FormData();
    formData.append('file', file);

    return new Observable(observer => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          observer.next({ file, progress, status: 'uploading' });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            observer.next({ file, progress: 100, status: 'success', result: response.data });
          } catch {
            observer.next({ file, progress: 100, status: 'error', error: 'Invalid response' });
          }
          observer.complete();
        } else {
          let errorMessage = 'Upload failed';
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.message || errorMessage;
          } catch {
            // ignore
          }
          observer.next({ file, progress: 0, status: 'error', error: errorMessage });
          observer.complete();
        }
      };

      xhr.onerror = () => {
        observer.next({ file, progress: 0, status: 'error', error: 'Network error' });
        observer.complete();
      };

      const token = this.getAccessToken();
      xhr.open('POST', `${this.base}/chats/${chatId}/attachments`);
      xhr.setRequestHeader('Accept', 'application/json');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);

      return () => xhr.abort();
    });
  }

  getAttachments(chatId: string): Observable<ApiAttachment[]> {
    return this.http
      .get<any>(`${this.base}/chats/${chatId}/attachments`)
      .pipe(map(response => response.data || []));
  }

  deleteAttachment(chatId: string, attachmentId: string): Observable<boolean> {
    return this.http
      .delete<any>(`${this.base}/chats/${chatId}/attachments/${attachmentId}`)
      .pipe(map(() => true));
  }

  getAttachmentDownloadUrl(chatId: string, attachmentId: string): string {
    return `${this.base}/chats/${chatId}/attachments/${attachmentId}/download`;
  }

  private getAccessToken(): string | null {
    try {
      const win = window as unknown as {
        __TOKEN_STORAGE__?: { getAccessToken?: () => string; accessToken?: string };
      };
      const tokenStorage = win.__TOKEN_STORAGE__;
      if (tokenStorage) {
        return tokenStorage.getAccessToken?.() || tokenStorage.accessToken || null;
      }
      return localStorage.getItem('tkrestore.access_token');
    } catch {
      return null;
    }
  }
}