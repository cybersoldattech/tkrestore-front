import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UiThemeService } from '../theme/ui-theme.service';
import { LanguageService, LANGUAGES } from '../services/language.service';
import { AuthService } from '../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UnreadService } from '../services/unread-service';
import { UserNotificationService } from '../services/user-notification-service';
import { toSignal } from '@angular/core/rxjs-interop';
 
interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}


@Component({
  selector: 'app-dashboard-layout-component',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, CommonModule, DatePipe],
  templateUrl: './dashboard-layout-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private readonly theme = inject(UiThemeService);
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  readonly auth  = inject(AuthService);
 
  readonly isDark = computed(() => this.theme.mode() === 'dark');

  private readonly unread     = inject(UnreadService);
  readonly notifSvc           = inject(UserNotificationService);

  // Signal mis à jour automatiquement, compatible OnPush
  readonly totalUnread = toSignal(this.unread.total$, { initialValue: 0 });

  // Panneau notification
  readonly notifOpen = signal(false);
 
  // Desktop: sidebar réduite/étendue (persiste)
  readonly sidebarCollapsed = signal(false);
  // Mobile: drawer ouvert/fermé (fermé par défaut)
  readonly mobileDrawerOpen = signal(false);
 
  readonly langMenuOpen = signal(false);
  readonly languages = LANGUAGES;
 
  readonly navItems = computed<NavItem[]>(() => [
    { label: this.lang.t().sidebar.dashboard,    icon: 'dashboard',       route: '/app/dashboard'      },
    { label: this.lang.t()?.sidebar?.secureEntity ,  icon: 'qr_code_2',   route: '/app/secure-entity'   },
    { label: this.lang.t().sidebar.declareBrowse,icon: 'where_to_vote',   route: '/app/declare-found' },
    { label: this.lang.t().sidebar.chat,         icon: 'chat_bubble',     route: '/app/chat',badge: this.totalUnread() || undefined  },
    { label: this.lang.t().sidebar.documents,    icon: 'folder_open',      route: '/app/documents'      },
    { label: this.lang.t().sidebar.settings, icon: 'settings', route: '/app/settings' },
  ]);

  readonly bottomItems = computed<NavItem[]>(() => [
    { label: this.lang.t().sidebar.settings, icon: 'settings', route: '/app/settings' },
  ]);
 
  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
 
  openMobileDrawer(): void {
    this.mobileDrawerOpen.set(true);
  }
 
  closeMobileDrawer(): void {
    this.mobileDrawerOpen.set(false);
  }
 
  toggleTheme(): void {
    this.theme.toggle();
  }
 
  toggleLangMenu(): void {
    this.langMenuOpen.update((v) => !v);
  }
 
  selectLang(code: string): void {
    this.lang.setLanguage(code);
    this.langMenuOpen.set(false);
  }

 
  readonly userName  = computed(() => this.auth.currentUser()?.full_name ?? '');
  readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '');
  readonly userAvatar = computed(() => this.auth.currentUser()?.avatar_url ?? null);

  toggleNotif(): void {
    const wasOpen = this.notifOpen();
    this.notifOpen.update(v => !v);
    // Charger les notifs à la première ouverture
    if (!wasOpen) {
      this.notifSvc.load();
    }
  }

  closeNotif(): void {
    this.notifOpen.set(false);
  }


  logout(): void {
    this.auth.logout();
    // toast.success('Déconnexion réussie');
    this.router.navigate(['/auth/login']);
  }
}