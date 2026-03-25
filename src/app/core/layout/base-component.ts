import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { UiThemeService } from '../theme/ui-theme.service';
import { LanguageService, LANGUAGES } from '../services/language.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxSonnerToaster } from 'ngx-sonner';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { SeoHeadComponent } from '../seo/seo-head.component';


@Component({
  selector: 'app-base-component',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgxSonnerToaster, NgIf, SeoHeadComponent],
  templateUrl: './base-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent {
  private readonly theme = inject(UiThemeService);
  private readonly notif    = inject(NotificationService);
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  readonly auth           = inject(AuthService);

  
  readonly isDark = computed(() => this.theme.mode() === 'dark');
  readonly year = new Date().getFullYear();
  readonly languages = LANGUAGES;
  readonly langMenuOpen = signal(false);
  readonly userMenuOpen   = signal(false);

  readonly isLoggedIn = computed(() => !!this.auth.currentUser());
 
 readonly userInitials = computed(() => {
  const user = this.auth.currentUser();

  if (!user?.full_name) {
    return '?';
  }

  return user.full_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n: string) => n.charAt(0).toUpperCase())
    .join('');
});
 
  readonly userName = computed(() => this.auth.currentUser()?.full_name ?? '');
  readonly userEmail = computed(() => this.auth.currentUser()?.email ?? '');
readonly userAvatar = computed(() => this.auth.currentUser()?.avatar_url ?? null);

  readonly userCountryIsoCode = computed(() => {
    const user = this.auth.currentUser();
    // On ne doit pas utiliser country_id (UUID) ici, uniquement l'iso_code
    return user?.country?.iso_code ?? null;
  });

  readonly userCountryFlagUrl = computed(() => {
    const iso = this.userCountryIsoCode();
    if (!iso) return '';
    return `https://flagcdn.com/w40/${iso.toLowerCase().substr(0, 2)}.png`;
  });

  // Backward compat: certaines templates utilisent l'ancienne propriété "userCountryFlagEmoji".
  // On la garde mais elle renvoie désormais la URL de l'image.
  readonly userCountryFlagEmoji = computed(() => this.userCountryFlagUrl() || '🌍');

  toggleTheme(): void { this.theme.toggle(); }
  toggleLangMenu(): void { this.langMenuOpen.update((v) => !v); }
  selectLang(code: string): void { this.lang.setLanguage(code); this.langMenuOpen.set(false); }


  getCurrentFlagSvg(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.lang.currentLang().flagSvg
    );
  }
   // ── Menu utilisateur ──────────────────────────────────────────────
  toggleUserMenu(): void { this.userMenuOpen.update((v) => !v); }
  closeUserMenu(): void  { this.userMenuOpen.set(false); }
 
  goToProfile(): void {
    this.userMenuOpen.set(false);
    this.router.navigate(['/app/settings']);
  }
 
  logout(): void {
    this.userMenuOpen.set(false);
    this.auth.logout();
    this.notif.success('Success', 'A bientot.');
    this.router.navigate(['/']);
  }
}
