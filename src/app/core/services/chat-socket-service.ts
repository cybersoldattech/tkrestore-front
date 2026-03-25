// src/app/core/services/chat-socket-service.ts
// [CORRIGÉ] BUG-02, BUG-03, BUG-05

import { Injectable, inject, OnDestroy } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { ApiMessage, ApiAttachment } from './chat-service';
import { AuthService } from './auth.service';
import { UnreadService } from './unread-service';

export interface WsEvent {
  type: 'NEW_MESSAGE' | 'MESSAGES_READ' | 'HANDOVER_INITIATED' | 'HANDOVER_CONFIRMED' | 'CHAT_CLOSED' | 'NEW_ATTACHMENT' | 'CHAT_ARCHIVED';
  chatId: string;
  message?: ApiMessage;
  attachment?: ApiAttachment;
  unreadCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService implements OnDestroy {
  private tokenStorage = inject(TokenStorageService);
  private activeThreadId = '';
  private client!: Client;
  private subscriptions = new Map<string, StompSubscription>();
  private connected = false;
  private readonly auth   = inject(AuthService);
  private readonly unread = inject(UnreadService);

  // Observables publics
  private readonly _status$ = new BehaviorSubject<'disconnected' | 'connecting' | 'connected'>('disconnected');
  readonly status$ = this._status$.asObservable();

  // [FIX BUG-05] Une seule source d'émission — dans handleUnreadLogic()
  private readonly _events$ = new Subject<WsEvent>();
  readonly events$: Observable<WsEvent> = this._events$.asObservable();

  connect(): void {
    if (this.connected) return;

    const token = this.tokenStorage.getAccessToken();
    if (!token) return;

    this._status$.next('connecting');

    this.client = new Client({
      webSocketFactory: () => {
        if (typeof WebSocket === 'undefined') {
          throw new Error('WebSocket not available (SSR)');
        }

        // Convertir https → wss et http → ws
        // Le serveur Spring Boot expose un endpoint WebSocket pur (sans SockJS) sur /ws
        // URL finale : ws://host/chat/ws  ou  wss://host/chat/ws en prod
        const wsUrl = environment.chatUrl
          .replace(/^https:\/\//i, 'wss://')
          .replace(/^http:\/\//i, 'ws://');

        // Supprimer le /ws en fin de chatUrl si déjà présent, puis ajouter proprement
        const baseUrl = wsUrl.replace(/\/ws\/?$/, '');
        const url = `${baseUrl}/ws`;

        console.log('[WS] Connecting to:', url);
        return new WebSocket(url);
      },
      connectHeaders: { Authorization: `Bearer ${token}` },
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      reconnectDelay: 5000,
      onConnect: () => {
        this.connected = true;
        this._status$.next('connected');
        console.log('[WS] Connecté');
      },
      onDisconnect: () => {
        this.connected = false;
        this._status$.next('disconnected');
        console.log('[WS] Déconnecté');
      },
      onWebSocketError: (error) => {
        console.error('[WS] WebSocket error:', error);
        this._status$.next('disconnected');
      },
      onStompError: (frame) => console.error('[WS] STOMP error', frame),
    });

    this.client.activate();
  }

  subscribeToChat(chatId: string): void {
    if (this.subscriptions.has(chatId)) return;

    // [FIX BUG-02] Timeout de sécurité — 40 × 300ms = 12s max
    const MAX_ATTEMPTS = 40;
    let attempts = 0;

    const trySubscribe = () => {
      if (attempts++ > MAX_ATTEMPTS) {
        console.error(`[WS] subscribeToChat(${chatId}) timeout après ${MAX_ATTEMPTS} tentatives`);
        return;
      }

      if (this.client?.connected) {
        // [FIX BUG-02] Stocker la subscription IMMÉDIATEMENT (pas dans le callback)
        const sub = this.client.subscribe(
          `/topic/chat.${chatId}`,
          (frame: IMessage) => {
            try {
              const rawData = JSON.parse(frame.body);

              const normalizedMessage = rawData.message ? {
                ...rawData.message,
                sender_id:
                  rawData.message.senderId ??
                  rawData.message.sender_id ??
                  rawData.message.senderID ??
                  rawData.message.sender?.id,
                chat_id:
                  rawData.message.chatId ??
                  rawData.message.chat_id ??
                  rawData.message.chatID,
                is_read: rawData.message.isRead ?? rawData.message.is_read ?? false,
                sent_at: rawData.message.sentAt ?? rawData.message.sent_at,
                read_at: rawData.message.readAt ?? rawData.message.read_at,
                attachments:
                  rawData.message.attachments ??
                  rawData.message.Images ??
                  rawData.message.images,
              } : undefined;

              const data: WsEvent = {
                ...rawData,
                message: normalizedMessage,
                chatId: rawData.chatId || rawData.chat_id,
                attachment: rawData.attachment ?? rawData.message?.attachment,
              };

              // [FIX BUG-05] Émettre UNE SEULE FOIS ici
              // handleUnreadLogic() ne réémet plus
              this._events$.next(data);
              this.handleUnreadLogic(data);
            } catch (e) {
              console.error('[WS] Parse error:', e, frame.body);
            }
          }
        );

        // [FIX BUG-02] Enregistrement immédiat dans la Map
        this.subscriptions.set(chatId, sub);
        console.log(`[WS] Abonné au topic chat.${chatId}`);

      } else {
        setTimeout(trySubscribe, 300);
      }
    };

    trySubscribe();
  }

  unsubscribeFromChat(chatId: string): void {
    this.subscriptions.get(chatId)?.unsubscribe();
    this.subscriptions.delete(chatId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.client?.deactivate();
  }

  setActiveThread(chatId: string): void {
    this.activeThreadId = chatId;
  }

  disconnect(): void {
    this.client?.deactivate();
  }

  // [FIX BUG-05] Ne plus émettre sur _events$ ici — seulement gérer la logique unread
  private handleUnreadLogic(event: WsEvent): void {
    if (event.type === 'NEW_MESSAGE') {
      const isActive = event.chatId === this.activeThreadId;
      this.unread.increment(event.chatId, isActive);
    }

    if (event.type === 'MESSAGES_READ') {
      this.unread.markThreadRead(event.unreadCount ?? 0);
    }   
    // Propagation vers ChatPage via l'observable
   // this._events$.next(event);
  }
}