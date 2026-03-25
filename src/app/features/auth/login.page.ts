import { ChangeDetectionStrategy, Component, inject, signal, OnInit, } from '@angular/core'; import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; import { ActivatedRoute, Router, RouterLink } from '@angular/router'; import { isPlatformBrowser } from '@angular/common'; import { PLATFORM_ID } from '@angular/core'; import { LanguageService } from '../../core/services/language.service'; import { NotificationService } from '../../core/services/notification.service'; import { AuthService } from '../../core/services/auth.service'; import { RecaptchaService } from '../../core/services/recaptcha.service'; import { RecaptchaAction } from '../../core/services/models/recaptcha.models'; import { HttpErrorResponse } from '@angular/common/http'; import { COUNTRIES } from '../../core/services/models/countries';

export class LoginPage implements OnInit {

  private readonly _0 = inject(FormBuilder);
  private readonly _1 = inject(AuthService);
  private readonly _2 = inject(Router);
  private readonly _3 = inject(ActivatedRoute);
  private readonly _4 = inject(NotificationService);
  private readonly _5 = inject(RecaptchaService);
  private readonly _6 = inject(PLATFORM_ID);

  readonly _7 = inject(LanguageService);

  readonly _8 = signal(false);
  readonly _9 = signal(false);
  readonly _10 = signal<string | null>(null);
  readonly _11 = signal(false);

  private readonly _12 = signal('');

  readonly _13 = this._0.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true],
  });

  readonly _14 = computed(() => {

    const v = this._13.controls.email.value ?? '';

    return v.includes('@')
      ? 'email'
      : /^[0-9+\s()\-]{7,}$/.test(v)
        ? 'phone'
        : 'username';

  });

  readonly _15 = computed(() =>
    ({
      email: 'mail',
      phone: 'phone',
      username: 'person'
    } as const)[this._14()]
  );

  ngOnInit(): void {

    if (!isPlatformBrowser(this._6)) {
      return;
    }

    void this._16();

  }

  private async _16(): Promise<void> {

    try {

      const t =
        await this._5.execute(
          'auth_login' as RecaptchaAction
        );

      this._12.set(t);
      this._11.set(true);

    } catch {

      this._11.set(false);

    }

  }

  private async _17(): Promise<string> {

    try {

      const x =
        await this._5.execute(
          'auth_login' as RecaptchaAction
        );

      this._12.set(x);

      return x;

    } catch {

      throw new Error(
        this._7.t().auth.recaptchaError
      );

    }

  }

  _18(): void {

    this._8.update(
      a => !a
    );

  }

  async _19(): Promise<void> {

    if (this._9()) {
      return;
    }

    const f = this._13;

    if (f.invalid) {

      f.markAllAsTouched();

      f.controls.email.invalid
        ? this._4.error(
            this._7.t().auth.loginIdentifierRequired
          )
        : f.controls.password.invalid &&
          this._4.error(
            this._7.t().auth.passwordMin
          );

      return;

    }

    this._9.set(true);
    this._10.set(null);

    try {

      const r = await this._17();

      const {
        email: e,
        password: p,
        remember: m
      } = f.getRawValue();

      this._1.login({
        login: e,
        email: e,
        password: p,
        remember: m ? '1' : '0',
        recaptcha_token: r,
        recaptcha_action: 'auth_login',
      } as any).subscribe({

        next: () => {

          this._4.success(
            this._7.t().auth.loginSuccess
          );

          this._2.navigateByUrl(
            this._3.snapshot
              .queryParamMap
              .get('returnUrl')
              ?? '/app/dashboard'
          );

        },

        error: z => {

          this._9.set(false);
          this._20(z);

        },

        complete: () =>
          this._9.set(false),

      });

    } catch {

      this._9.set(false);

      this._4.error(
        this._7.t().auth.recaptchaError
      );

    }

  }

  private _20(e: HttpErrorResponse): void {

    if (e.error?.email_not_verified) {

      localStorage.setItem(
        'pending_email',
        this._13.getRawValue().email
      );

      this._4.warning(
        this._7.t().auth.emailNotVerified
      );

      this._2.navigate([
        '/auth/verify-email'
      ]);

      return;

    }

    const m = this._21(e);

    this._10.set(m);

    this._4.error(m);

  }

  private _21(e: HttpErrorResponse): string {

    const b = e.error?.message;

    return ({
      401: b ?? this._7.t().auth.invalidCredentials,
      403: b ?? this._7.t().auth.accountInactive,
      422: b ?? this._7.t().auth.invalidCredentials,
      429: b ?? this._7.t().auth.tooManyAttempts,
    } as Record<number, string>)[e.status]
      ?? b
      ?? this._7.t().auth.serverError;

  }

}
