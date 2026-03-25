// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { BaseComponent }           from './core/layout/base-component';
import { AuthComponent }           from './core/layout/auth-component';
import { AppShellComponent }       from './core/layout/app-shell.component';
import { DashboardLayoutComponent } from './core/layout/dashboard-layout-component';
import { authGuard } from './core/services/guards/auth.guard';
import { noAuthGuard } from './core/services/guards/no-auth.guard';
import { roleGuard } from './core/services/guards/role.guard';
import { emailVerifiedGuard } from './core/services/guards/email-verified.guard';


export const routes: Routes = [

  // ── Pages publiques ──────────────────────────────────────────
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
        title: 'tkrestore — Accueil',
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search-component.page').then((m) => m.SearchComponentPage),
        title: 'Rechercher — tkrestore',
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about').then((m) => m.About),
      },

      {
        path: 'scan-qr/:reference',
        loadComponent: () => import('./features/scan-qr/scan-qr').then((m) => m.ScanQr),
        title: 'Scan QR — tkrestore',
      },
      {
        path: 'legal',
        loadComponent: () => import('./pages/cgu/cgu').then((m) => m.Cgu),
        title: 'Conditions générales — tkrestore',
      },
      {
        path: 'dpa',
        loadComponent: () => import('./pages/dpa/dpa').then((m) => m.Dpa),
        title: 'Accord de traitement des données — tkrestore',
      },
      {
        path: 'private-policy',
        loadComponent: () => import('./pages/private-policy/private-policy').then((m) => m.PrivatePolicy),
        title: 'Politique de confidentialité — tkrestore',
      },
    ],
  },

  // ── Auth (noAuthGuard = redirige si déjà connecté) ──────────
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
        title: 'Connexion — tkrestore',
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPage),
        title: 'Inscription — tkrestore',
      },
       {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/verity-otp.page').then(m => m.VerifyOtpPage),
        title: 'Vérification email — tkrestore',
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/reset-password/reset-password').then((m) => m.ResetPassword),
        title: 'Réinitialisation — tkrestore',
      },

    ],
  },

  // ── App authentifiée (authGuard obligatoire) ─────────────────
  {
    path: 'app',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],          // emailVerifiedGuard ← Bloque si non connecté
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
        title: 'Tableau de bord — tkrestore',
      },
       {
        path: 'documents',
        loadComponent: () =>
          import('./features/documents/my-documents.page').then((m) => m.MyDocumentsPage),
        title: 'Tableau de bord — tkrestore',
      },
       {
        path: 'secure-entity',
        loadComponent: () =>
          import('./features/secure-object/secure-object').then((m) => m.SecureObject),
      },
      {
        path: 'declare-found',
        loadComponent: () =>
          import('./features/documents/declare-document.page').then((m) => m.DeclareDocumentPage),
        title: 'Déclarer une trouvaille — tkrestore',
        data: { mode: 'found' },
      },
      {
        path: 'restore/:id',
        loadComponent: () =>
          import('./features/documents/restore-document.page').then((m) => m.RestoreDocumentPage),
        title: 'Restauration — tkrestore',
      },
      {
        path: 'chat',
        loadComponent: () => import('./features/chat/chat.page').then((m) => m.ChatPage),
        title: 'Messagerie — tkrestore',
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings-component-page').then((m) => m.SettingsComponentPage),
        title: 'Parametres — tkrestore',
      },



      // // ── Route admin (double protection) ──────────────────────
      // {
      //   path: 'dashboard',
      //   canActivate: [roleGuard],
      //   data: { roles: ['user'] },
      //   loadComponent: () =>
      //     import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      //   title: 'Administration — tkrestore',
      // },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────
  { path: '**', redirectTo: '' },
];
