import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import {
  ApiChatThread,
  ApiMessage,
  ApiAttachment,
  AttachmentUploadProgress,
  ChatService,
} from '../../core/services/chat-service';
import { ChatSocketService, WsEvent } from '../../core/services/chat-socket-service';
import { UnreadService } from '../../core/services/unread-service';
import { NotificationService } from '../../core/services/notification.service';
import { LanguageService } from '../../core/services/language.service';

export type ChatStatus = 'OPEN' | 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';

export type ChatThread = {
  id: string;
  title: string;
  itemId: string;
  lastMessage: string;
  reference: string;
  timeLabel: string;
  status: ChatStatus;
  unread: number;
  isLoser: boolean;
  lostId: string;
  foundId: string;
};

export type ChatMessage = {
  id: string;
  from: 'me' | 'them' | 'system';
  author: string;
  text: string;
  timeLabel: string;
  attachments?: ApiAttachment[];
  uploadProgress?: number;
};

export type FilterOption = {
  value: ChatStatus | 'ALL';
  label: string;
  activeClass: string;
};

type FilterValue = 'ALL' | ChatStatus;
interface ChatFilter {
  value: FilterValue;
  label: string;
  activeClass: string;
}

type HandoverState = {
  initiated: boolean;
  otpCode: string;
  confirmed: boolean;
  loserMustConfirm: boolean;
  loserConfirmed: boolean;
  otpExpiresAt: number | null;
};

function defaultHandoverState(): HandoverState {
  return {
    initiated: false,
    otpCode: '',
    confirmed: false,
    loserMustConfirm: false,
    loserConfirmed: false,
    otpExpiresAt: null,
  };
}

@Component({
  selector: 'app-chat-page',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './chat.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPage implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  // ── Injections ─────────────────────────────────────────────────────
  private readonly unreadService = inject(UnreadService);
  private readonly chatApi       = inject(ChatService);
  private readonly chatSocket    = inject(ChatSocketService);
  private readonly authService   = inject(AuthService);
  private readonly notif         = inject(NotificationService);
  private readonly cdr           = inject(ChangeDetectorRef);
  private readonly router        = inject(Router);
  private readonly destroy$      = new Subject<void>();

  readonly lang = inject(LanguageService);

  // ── Rôle utilisateur ───────────────────────────────────────────────
  readonly isLoser  = computed(() => this.activeThread()?.isLoser ?? false);
  readonly isFinder = computed(() => !this.isLoser() && !!this.activeThread());

  // ── UI ─────────────────────────────────────────────────────────────
  readonly sidebarOpen    = signal(window.innerWidth < 768);
  readonly activeFilter   = signal<ChatStatus | 'ALL'>('ALL');
  readonly isSending      = signal(false);
  readonly uploadProgress = signal<number | null>(null);
  readonly isDraggingOver = signal(false);
  isMobile = () => window.innerWidth < 768;
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly message = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });

  readonly filters = computed<ChatFilter[]>(() => [
    { value: 'ALL',      label: this.lang.t().chat.filterAll,      activeClass: 'badge-neutral'  },
    { value: 'OPEN',     label: this.lang.t().chat.filterOpen,     activeClass: 'badge-primary'  },
    { value: 'ACTIVE',   label: this.lang.t().chat.filterActive,   activeClass: 'badge-success'  },
    { value: 'ARCHIVED', label: this.lang.t().chat.filterArchived, activeClass: 'badge-warning'  },
  ]);

  // ── [NEW] Modal succès restauration ────────────────────────────────
  /**
   * Déclenché lorsqu'un CHAT_ARCHIVED ou HANDOVER_CONFIRMED arrive via WS
   * ou lorsque confirmWithOtp() réussit.
   * On stocke le titre du thread archivé pour personnaliser le message.
   */
  readonly showRestorationSuccessModal = signal(false);
  readonly restoredThreadTitle         = signal<string>('');

  /** Ouvre la modal et lance le confettis (si disponible) */
  private openRestorationSuccess(threadTitle: string): void {
    this.restoredThreadTitle.set(threadTitle);
    this.showRestorationSuccessModal.set(true);
    this.cdr.markForCheck();
  }

  /** Redirige vers l'accueil et ferme la modal */
  goHome(): void {
    this.showRestorationSuccessModal.set(false);
    this.router.navigate(['/']);
  }

  /** Reste dans le chat (ferme la modal sans naviguer) */
  closeRestorationSuccessModal(): void {
    this.showRestorationSuccessModal.set(false);
  }

  // ── Données ────────────────────────────────────────────────────────
  readonly threads        = signal<ChatThread[]>([]);
  readonly messages       = signal<ChatMessage[]>([]);
  readonly activeThreadId = signal<string>('');

  readonly activeThread = computed(() =>
    this.threads().find(t => t.id === this.activeThreadId())
  );

  readonly filteredThreads = computed(() => {
    const filter = this.activeFilter();
    const search = this.searchControl.value.toLowerCase();
    return this.threads().filter(t => {
      const matchStatus = filter === 'ALL' || t.status === filter;
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search) ||
        t.lastMessage.toLowerCase().includes(search);
      return matchStatus && matchSearch;
    });
  });

  // ── Handover state (par thread) ────────────────────────────────────
  private readonly handoverMap = signal<Map<string, HandoverState>>(new Map());

  private getHandover(threadId?: string): HandoverState {
    const id = threadId ?? this.activeThreadId();
    return this.handoverMap().get(id) ?? defaultHandoverState();
  }

  private setHandover(patch: Partial<HandoverState>, threadId?: string): void {
    const id      = threadId ?? this.activeThreadId();
    const current = this.getHandover(id);
    this.handoverMap.update(map => new Map(map).set(id, { ...current, ...patch }));
    this.cdr.markForCheck();
  }

  readonly handoverInitiated = computed(() => this.getHandover(this.activeThreadId()).initiated);
  readonly otpCode           = computed(() => this.getHandover(this.activeThreadId()).otpCode);
  readonly handoverConfirmed = computed(() => this.getHandover(this.activeThreadId()).confirmed);
  readonly loserMustConfirm  = computed(() => this.getHandover(this.activeThreadId()).loserMustConfirm);
  readonly loserConfirmed    = computed(() => this.getHandover(this.activeThreadId()).loserConfirmed);
  readonly otpExpired        = computed(() => {
    const exp = this.getHandover(this.activeThreadId()).otpExpiresAt;
    return exp !== null && Date.now() > exp;
  });

  // ── OTP ────────────────────────────────────────────────────────────
  readonly otpError        = signal(false);
  readonly isConfirmingOtp = signal(false);
  readonly otpInputs       = [0, 1, 2, 3, 4, 5];
  readonly otpValues       = signal<string[]>(['', '', '', '', '', '']);
  readonly otpComplete     = computed(() => this.otpValues().every(v => v !== ''));
  public urlUser = window.location.origin + '/assets/images/user.png';

  // ── Attachments ────────────────────────────────────────────────────
  readonly pendingAttachments = signal<AttachmentUploadProgress[]>([]);
  readonly previewAttachment  = signal<ApiAttachment | null>(null);

  private shouldScrollToBottom = false;

  private get myId(): string {
    return this.authService.currentUser()?.id ?? '';
  }

  public get myAvatar(): string | null {
    return this.authService.currentUser()?.avatar_url ?? null;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  ngOnInit(): void {
    this.chatSocket.connect();

    this.chatApi.getChats().subscribe(res => {
      const threads = res.data.map(t => this.mapThread(t));
      this.threads.set(threads);
      if (threads.length) this.selectThread(threads[0].id);
      this.cdr.markForCheck();
    });

    this.chatSocket.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => this.handleWsEvent(event));
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.messages().forEach(m =>
      (m.attachments ?? []).forEach(a => {
        if (a.url?.startsWith('blob:')) URL.revokeObjectURL(a.url);
      })
    );
  }

  // ── selectThread ───────────────────────────────────────────────────

  selectThread(id: string): void {
    if (this.activeThreadId()) {
      this.chatSocket.unsubscribeFromChat(this.activeThreadId());
    }
    if (window.innerWidth < 768) this.sidebarOpen.set(false);

    const thread = this.threads().find(t => t.id === id);
    const previousUnread = thread?.unread ?? 0;

    this.activeThreadId.set(id);
    this.messages.set([]);
    this.sidebarOpen.set(false);

    this.chatApi.getMessages(id).subscribe(res => {
      const userId = this.myId;
      this.messages.set(res.data.map(m => this.mapMessage(m, userId)));
      this.shouldScrollToBottom = true;
      this.cdr.markForCheck();
    });

    const itemId = thread?.itemId;
    if (itemId) {
      this.chatApi.getHandoverState(itemId).subscribe({
        next: (res) => {
          if (res?.handover) {
            const h = res.handover;
            const isActive    = h.status === 'OTP_SENT' || h.status === 'PENDING';
            const isCompleted = h.status === 'COMPLETED';
            this.setHandover({
              initiated:        isActive || isCompleted,
              confirmed:        isCompleted,
              otpExpiresAt:     h.otp_expires_at ? new Date(h.otp_expires_at).getTime() : null,
              loserMustConfirm: h.finder_confirmed && !h.loser_confirmed,
              loserConfirmed:   h.loser_confirmed,
            }, id);
            this.cdr.markForCheck();
          }
        },
        error: () => {},
      });
    }

    this.chatApi.markRead(id).subscribe(() => {
      if (previousUnread > 0) this.unreadService.markThreadRead(previousUnread);
      this.threads.update(list =>
        list.map(t => (t.id === id ? { ...t, unread: 0 } : t))
      );
    });

    this.chatSocket.subscribeToChat(id);
    this.cdr.markForCheck();
  }

  // ── Envoi message ──────────────────────────────────────────────────

  send(): void {
    const body = this.message.value.trim();
    if (!body || this.isSending()) return;

    const chatId = this.activeThreadId();
    if (!chatId) return;

    if (this.activeThread()?.status === 'ARCHIVED') {
      this.notif.warning(this.lang.t().chat.archivedNotice);
      return;
    }

    const currentUserId = this.myId;
    const filesToSend   = this.pendingAttachments().filter(p => p.status !== 'error').map(p => p.file);

    this.isSending.set(true);
    this.uploadProgress.set(filesToSend.length > 0 ? 0 : null);
    this.message.setValue('');

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const localAttachments: ApiAttachment[] = filesToSend.map(f => ({
      id:                  `local-${tempId}-${f.name}`,
      message_id:          tempId,
      type:                'CHAT_MESSAGE',
      mime_type:           f.type,
      file_size:           f.size,
      file_size_formatted: '',
      file_name:           f.name,
      url:                 URL.createObjectURL(f),
      is_image:            f.type.startsWith('image/'),
      is_pdf:              f.type === 'application/pdf',
      sender: {
        id:         currentUserId,
        username:   this.authService.currentUser()?.username ?? '',
        full_name:  this.authService.currentUser()?.full_name ?? '',
        avatar_url: this.authService.currentUser()?.avatar_url ?? null,
      },
      created_at: new Date().toISOString(),
    }));

    const optimisticMsg: ChatMessage = {
      id:             tempId,
      from:           'me',
      author:         this.authService.currentUser()?.full_name ?? 'Moi',
      text:           body,
      timeLabel:      this.now(),
      attachments:    localAttachments.length > 0 ? localAttachments : undefined,
      uploadProgress: filesToSend.length > 0 ? 0 : undefined,
    };

    this.messages.update(list => [...list, optimisticMsg]);
    this.shouldScrollToBottom = true;
    this.updateThreadLastMsg(chatId, body);
    this.cdr.markForCheck();

    this.chatApi.sendMessageWithAttachments(chatId, body, filesToSend, (pct) => {
      this.uploadProgress.set(pct);
      this.messages.update(list =>
        list.map(m => m.id === tempId ? { ...m, uploadProgress: pct } : m)
      );
      this.cdr.markForCheck();
    }).subscribe({
      next: (res) => {
        const realMsg = this.mapMessage(res.data, currentUserId);

        if (realMsg.attachments && realMsg.attachments.length > 0) {
          localAttachments.forEach(a => {
            if (a.url.startsWith('blob:')) URL.revokeObjectURL(a.url);
          });
        }

        this.messages.update(list => {
          const hasRealAlready = list.some(m => m.id === realMsg.id);
          if (hasRealAlready) return list.filter(m => m.id !== tempId);

          const finalAttachments =
            realMsg.attachments && realMsg.attachments.length > 0
              ? realMsg.attachments
              : localAttachments;

          return list.map(m =>
            m.id === tempId
              ? { ...realMsg, attachments: finalAttachments, uploadProgress: undefined }
              : m
          );
        });

        this.pendingAttachments.set([]);
        this.previewAttachment.set(null);
        this.uploadProgress.set(null);
        this.isSending.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[Chat] send error:', err);
        localAttachments.forEach(a => {
          if (a.url.startsWith('blob:')) URL.revokeObjectURL(a.url);
        });
        this.messages.update(list => list.filter(m => m.id !== tempId));
        this.message.setValue(body);
        this.uploadProgress.set(null);
        this.isSending.set(false);
        this.notif.error(this.lang.t().chat.sendError);
        this.cdr.markForCheck();
      },
    });
  }

  onEnter(event: Event): void {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      ke.preventDefault();
      this.send();
    }
  }

  // ── Handover — propriétaire (loser) ────────────────────────────────

  initiateHandover(): void {
    const thread = this.activeThread();
    if (!thread?.itemId) return;

    this.chatApi.initiateHandover(thread.itemId).subscribe({
      next: res => {
        const ttlMs = res.handover?.otp_expires_at
          ? new Date(res.handover.otp_expires_at).getTime()
          : Date.now() + 30 * 60 * 1000;

        this.setHandover({ initiated: true, otpCode: res.otp_code, otpExpiresAt: ttlMs });
        this.addSystemMessage(this.lang.t().chat.handoverSystemInitiated);
      },
      error: () => this.notif.error(this.lang.t().chat.handoverInitError),
    });
  }

  regenerateHandover(): void {
    const thread = this.activeThread();
    if (!thread?.itemId) return;

    this.chatApi.regenerateHandover(thread.itemId).subscribe({
      next: res => {
        const ttlMs = res.handover?.otp_expires_at
          ? new Date(res.handover.otp_expires_at).getTime()
          : Date.now() + 30 * 60 * 1000;

        this.setHandover({ initiated: true, otpCode: res.otp_code, otpExpiresAt: ttlMs });
        this.addSystemMessage(this.lang.t().chat.handoverSystemInitiated);
      },
      error: () => this.notif.error(this.lang.t().chat.handoverInitError),
    });
  }

  // ── Handover — trouveur (finder) ───────────────────────────────────

  confirmWithOtp(): void {
    const thread = this.activeThread();
    if (!thread?.itemId || this.isConfirmingOtp()) return;
    const code = this.otpValues().join('');

    this.isConfirmingOtp.set(true);
    this.otpError.set(false);

    this.chatApi.confirmHandover(thread.itemId, code).subscribe({
      next: () => {
        this.isConfirmingOtp.set(false);
        this.otpError.set(false);
        this.setHandover({ confirmed: true });

        (document.getElementById('otp_modal') as HTMLDialogElement)?.close();
        this.addSystemMessage(this.lang.t().chat.handoverSystemConfirmed);

        // Archiver le thread localement
        this.threads.update(list =>
          list.map(t =>
            t.id === this.activeThreadId()
              ? { ...t, status: 'ARCHIVED' as ChatStatus }
              : t
          )
        );

        // [NEW] Ouvrir la modal de succès côté finder (c'est lui qui saisit le code)
        const title = this.activeThread()?.title ?? '';
        this.openRestorationSuccess(title);

        this.cdr.markForCheck();
      },
      error: () => {
        this.isConfirmingOtp.set(false);
        this.otpError.set(true);
        this.cdr.markForCheck();
      },
    });
  }

  loserConfirmRecovery(): void {
    this.setHandover({ loserConfirmed: true });
    this.addSystemMessage(this.lang.t().chat.handoverSystemComplete);
  }

  // ── Attachments ────────────────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.processFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver.set(false);
    const files = event.dataTransfer?.files;
    if (!files?.length) return;
    this.processFiles(Array.from(files));
  }

  private processFiles(files: File[]): void {
    const valid = files.filter(f => this.isValidFile(f));
    if (!valid.length) return;
    this.pendingAttachments.update(list => [
      ...list,
      ...valid.map(file => ({ file, progress: 0, status: 'pending' as const })),
    ]);
    this.cdr.markForCheck();
  }

  private isValidFile(file: File): boolean {
    const types   = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 4 * 1024 * 1024;
    return types.includes(file.type) && file.size <= maxSize;
  }

  openAttachmentPreview(attachment: ApiAttachment): void {
    this.previewAttachment.set(attachment);
    (document.getElementById('attachment_preview_modal') as HTMLDialogElement)?.showModal();
  }

  closeAttachmentPreview(): void {
    this.previewAttachment.set(null);
    (document.getElementById('attachment_preview_modal') as HTMLDialogElement)?.close();
  }

  downloadAttachment(attachment: ApiAttachment): void {
    const chatId = this.activeThreadId();
    if (!chatId) return;
    window.open(this.chatApi.getAttachmentDownloadUrl(chatId, attachment.id), '_blank');
  }

  removePendingAttachment(file: File): void {
    this.pendingAttachments.update(list => list.filter(p => p.file !== file));
  }

  // ── OTP helpers ────────────────────────────────────────────────────

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val   = input.value.replace(/\D/g, '').slice(0, 1);
    input.value = val;
    this.otpValues.update(arr => {
      const next  = [...arr];
      next[index] = val;
      return next;
    });
    this.otpError.set(false);
    if (val && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
    if (this.otpComplete() && !this.isConfirmingOtp()) this.confirmWithOtp();
  }

  onOtpBackspace(event: Event, index: number): void {
    if (!this.otpValues()[index] && index > 0) {
      this.otpValues.update(arr => {
        const next      = [...arr];
        next[index - 1] = '';
        return next;
      });
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prev) { prev.value = ''; prev.focus(); }
    }
    this.otpError.set(false);
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
    const next   = ['', '', '', '', '', ''];
    pasted.split('').forEach((char, i) => {
      next[i] = char;
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) input.value = char;
    });
    this.otpValues.set(next);
    this.otpError.set(false);
    const lastIdx = Math.min(pasted.length - 1, 5);
    (document.getElementById(`otp-${lastIdx}`) as HTMLInputElement)?.focus();
    if (this.otpComplete() && !this.isConfirmingOtp()) this.confirmWithOtp();
  }

  resetOtp(): void {
    this.otpValues.set(['', '', '', '', '', '']);
    this.otpInputs.forEach(i => {
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) input.value = '';
    });
    this.otpError.set(false);
    this.isConfirmingOtp.set(false);
  }

  // ── WebSocket ──────────────────────────────────────────────────────

  private handleWsEvent(event: WsEvent): void {
    switch (event.type) {

      case 'NEW_MESSAGE': {
        if (!event.message || event.chatId !== this.activeThreadId()) return;
        const msg = this.mapMessage(event.message, this.myId);

        if (msg.from === 'me') {
          this.messages.update(list => {
            if (list.some(m => m.id === msg.id)) return list;
            const tempIdx = list.slice().reverse().findIndex(
              m => m.id.startsWith('temp-') && m.from === 'me'
            );
            if (tempIdx === -1) return [...list, msg];

            const realIdx = list.length - 1 - tempIdx;
            const bubble  = list[realIdx];

            if (msg.attachments && msg.attachments.length > 0) {
              (bubble.attachments ?? []).forEach(a => {
                if (a.url?.startsWith('blob:')) URL.revokeObjectURL(a.url);
              });
            }

            const upgraded: ChatMessage = {
              ...bubble,
              id:             msg.id,
              attachments:    msg.attachments?.length ? msg.attachments : bubble.attachments,
              uploadProgress: undefined,
            };
            return [...list.slice(0, realIdx), upgraded, ...list.slice(realIdx + 1)];
          });

          this.shouldScrollToBottom = true;
          this.cdr.markForCheck();
          return;
        }

        if (this.messages().some(m => m.id === msg.id)) return;
        this.messages.update(list => [...list, msg]);
        this.shouldScrollToBottom = true;
        this.updateThreadLastMsg(event.chatId, event.message!.body);
        this.cdr.markForCheck();
        break;
      }

      case 'HANDOVER_INITIATED':
        if (this.isFinder() && event.chatId === this.activeThreadId()) {
          this.addSystemMessage(this.lang.t().chat.handoverSystemInitiated);
        }
        break;

      case 'HANDOVER_CONFIRMED':
        if (this.isLoser()) {
          this.setHandover({ loserMustConfirm: true }, event.chatId);
          if (event.chatId === this.activeThreadId()) {
            this.addSystemMessage(this.lang.t().chat.handoverSystemConfirmed);
          }
        }
        break;

      case 'CHAT_CLOSED':
      case 'CHAT_ARCHIVED': {
        // Archiver le thread dans la liste
        this.threads.update(list =>
          list.map(t =>
            t.id === event.chatId ? { ...t, status: 'ARCHIVED' as ChatStatus } : t
          )
        );

        if (event.chatId === this.activeThreadId()) {
          this.addSystemMessage(this.lang.t().chat.archivedNotice);

          // [NEW] Ouvrir la modal de succès pour les DEUX participants
          // quand l'événement WS CHAT_ARCHIVED arrive (broadcast serveur)
          // — sauf si la modal est déjà ouverte (finder l'a déjà vue via confirmWithOtp)
          if (!this.showRestorationSuccessModal()) {
            const title = this.activeThread()?.title ?? '';
            this.openRestorationSuccess(title);
          }
        }

        this.cdr.markForCheck();
        break;
      }

      case 'MESSAGES_READ':
        this.unreadService.markThreadRead(event.unreadCount ?? 0);
        if (this.activeThreadId() === event.chatId) {
          this.threads.update(list =>
            list.map(t => (t.id === event.chatId ? { ...t, unread: 0 } : t))
          );
        }
        break;

      case 'NEW_ATTACHMENT': {
        if (!event.attachment || event.chatId !== this.activeThreadId()) return;
        const att = event.attachment as ApiAttachment & { message_id?: string };
        this.messages.update(list => {
          if (att.message_id) {
            return list.map(m => {
              if (m.id !== att.message_id) return m;
              if ((m.attachments ?? []).some(a => a.id === att.id)) return m;
              return { ...m, attachments: [...(m.attachments ?? []), att] };
            });
          }
          const last = list[list.length - 1];
          if (!last || (last.attachments ?? []).some(a => a.id === att.id)) return list;
          return [...list.slice(0, -1), { ...last, attachments: [...(last.attachments ?? []), att] }];
        });
        this.cdr.markForCheck();
        break;
      }

      default:
        console.warn('[WS] Type non géré:', event.type);
    }
  }

  // ── Helpers UI ─────────────────────────────────────────────────────

  statusDot(status: ChatStatus | undefined): string {
    return (
      { OPEN: 'bg-primary', ACTIVE: 'bg-success', ARCHIVED: 'bg-warning', COMPLETED: 'bg-info' }[
        status ?? 'OPEN'
      ] ?? 'bg-base-300'
    );
  }

  statusLabel(status: ChatStatus | undefined): string {
    const t = this.lang.t().chat;
    return (
      { OPEN: t.statusOpen, ACTIVE: t.statusActive, ARCHIVED: t.statusArchived, COMPLETED: t.statusCompleted }[
        status ?? 'OPEN'
      ] ?? ''
    );
  }

  // ── Mappers ────────────────────────────────────────────────────────

  private mapThread(t: ApiChatThread): ChatThread {
    return {
      id:          t.id,
      title:       t.other_user?.full_name ?? t.other_user?.username ?? 'Inconnu',
      itemId:      t.item?.id ?? '',
      lastMessage: t.last_message?.body ?? '',
      timeLabel:   t.last_message_at
        ? new Date(t.last_message_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : '',
      status:    t.status as ChatStatus,
      unread:    t.unread_count,
      isLoser:   t.is_loser,
      reference: t.reference,
      lostId:    t.lost_id,
      foundId:   t.found_id,
    };
  }

  private mapMessage(m: ApiMessage, currentUserId: string): ChatMessage {
    const senderId = String(m.sender_id ?? '').trim();
    const meId     = String(currentUserId ?? '').trim();
    return {
      id:          m.id,
      from:        (meId && senderId === meId) ? 'me' : 'them',
      author:      m.sender?.full_name ?? m.sender?.username ?? 'Inconnu',
      text:        m.body,
      timeLabel:   new Date(m.sent_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      attachments: m.attachments,
    };
  }

  private addSystemMessage(text: string): void {
    this.messages.update(list => [
      ...list,
      { id: `sys-${Date.now()}`, from: 'system', author: 'Système', text, timeLabel: this.now() },
    ]);
    this.shouldScrollToBottom = true;
    this.cdr.markForCheck();
  }

  private updateThreadLastMsg(chatId: string, body: string): void {
    this.threads.update(list =>
      list.map(t => t.id === chatId ? { ...t, lastMessage: body, timeLabel: this.now() } : t)
    );
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { }
  }

  private now(): string {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}