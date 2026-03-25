import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { QRCodeService, QRCode } from '../../core/services/qrcode.service';
import { QrRefService } from '../../core/services/qr-ref.service';
import { CommonModule } from '@angular/common';

interface QRCodePublicResponse {
  success: boolean;
  data: QRCode;
}

@Component({
  selector: 'app-scan-qr',
  imports: [CommonModule, RouterLink],
  templateUrl: './scan-qr.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanQr {
// Injects
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly qrService = inject(QRCodeService);
  readonly authService = inject(AuthService);
  readonly t = inject(LanguageService).t;
  readonly qrRefService = inject(QrRefService);

  // Signals
  readonly qrLoading = signal(true);
  readonly qrData = signal<QRCode | null>(null);
  readonly isLoggedIn = computed(() => !!this.authService.currentUser());

  readonly routeUrl = computed(() => this.router.url);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const reference = this.route.snapshot.paramMap.get('reference')!;
      this.loadQr(reference);
    }

  }

  loadQr(reference: string): void {
    this.qrLoading.set(true);

    this.qrService.getPublicQr(reference).subscribe({
      next: (res: any) => {
        this.qrData.set(res.data);
        this.qrRefService.setRef(reference);
        this.qrLoading.set(false);
      },
      error: () => {
        this.qrLoading.set(false);
      },
    });
  }
}
