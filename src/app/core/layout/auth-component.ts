import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';   
import { RouterOutlet } from '@angular/router';
import { UiThemeService } from '../theme/ui-theme.service';
import { LanguageService, LANGUAGES } from '../services/language.service';
import { NgxSonnerToaster } from 'ngx-sonner';
import { filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UnreadService } from '../services/unread-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-component',
  imports: [RouterOutlet , NgxSonnerToaster, CommonModule],
  templateUrl: './auth-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly theme = inject(UiThemeService);
  readonly lang = inject(LanguageService);
  private readonly unread = inject(UnreadService);
  private readonly auth   = inject(AuthService);

  constructor(private sanitizer: DomSanitizer) {}

 
  ngOnInit(): void {
    // Initialiser le badge dès que l'utilisateur est authentifié
    this.auth.currentUser$.pipe(
    filter(user => !!user),
      take(1)
    ).subscribe(() => this.unread.init());
  }
  readonly isDark = computed(() => this.theme.mode() === 'dark');
  readonly languages = LANGUAGES;
  readonly langMenuOpen = signal(false);

  toggleTheme(): void { this.theme.toggle(); }
  toggleLangMenu(): void { this.langMenuOpen.update((v) => !v); }
  selectLang(code: string): void { this.lang.setLanguage(code); this.langMenuOpen.set(false); }

  getCurrentFlagSvg(): SafeHtml {
    return this.lang.currentLang().flagSvg;
  }
  
}
