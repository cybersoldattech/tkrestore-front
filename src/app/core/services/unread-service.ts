import { Injectable } from '@angular/core';
import {  inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { ChatService } from './chat-service';

@Injectable({
  providedIn: 'root',
})
export class UnreadService {
  private readonly chatApi = inject(ChatService);

  // Source unique de vérité pour toute l'app
  private readonly _total$ = new BehaviorSubject<number>(0);
  readonly total$ = this._total$.pipe(distinctUntilChanged());

  /** Appelé une seule fois au démarrage (AppComponent ou AuthGuard) */
  init(): void {
    this.chatApi.getChats().subscribe(res => {
      const total = res.data.reduce((sum, t) => sum + (t.unread_count ?? 0), 0);
      this._total$.next(total);
    });
  }

  /** Appelé par ChatSocketService sur NEW_MESSAGE (autre utilisateur) */
  increment(chatId: string, isActiveThread: boolean): void {
    if (isActiveThread) return; // déjà visible, pas d'incrémentation
    this._total$.next(this._total$.value + 1);
  }

  /** Appelé quand on ouvre un thread ou que le serveur confirme la lecture */
  markThreadRead(count: number): void {
    this._total$.next(Math.max(0, this._total$.value - count));
  }

  /** Reset complet (ex: changement de compte) */
  reset(): void {
    this._total$.next(0);
  }
}
