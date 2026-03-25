import { ChangeDetectionStrategy, Component, inject, signal, OnInit, } from '@angular/core'; import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; import { ActivatedRoute, Router, RouterLink } from '@angular/router'; import { isPlatformBrowser } from '@angular/common'; import { PLATFORM_ID } from '@angular/core'; import { LanguageService } from '../../core/services/language.service'; import { NotificationService } from '../../core/services/notification.service'; import { AuthService } from '../../core/services/auth.service'; import { RecaptchaService } from '../../core/services/recaptcha.service'; import { RecaptchaAction } from '../../core/services/models/recaptcha.models'; import { HttpErrorResponse } from '@angular/common/http'; import { COUNTRIES } from '../../core/services/models/countries';

export interface A {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export class RegisterPage implements OnInit {

  private readonly _0 = inject(FormBuilder);
  readonly _1 = inject(LanguageService);
  private readonly _2 = inject(AuthService);
  private readonly _3 = inject(RecaptchaService);
  private readonly _4 = inject(Router);
  private readonly _5 = inject(ActivatedRoute);
  private readonly _6 = inject(NotificationService);
  private readonly _7 = inject(PLATFORM_ID);

  readonly _8  = signal(false);
  readonly _9  = signal(false);
  readonly _10 = signal<string | null>(null);
  readonly _11 = signal<Record<string,string[]>>({});

  readonly _12 = signal(false);
  private readonly _13 = signal('');

  readonly _14 = COUNTRIES;

  readonly _15 = [
    { icon:'encrypted',label:'Données protégées' },
    { icon:'speed',label:'Publications modérées' },
    { icon:'cloud_done',label:'Processus traçable' },
    { icon:'support_agent',label:'Assistance humaine' }
  ] as const;

  readonly _16 = this._0.nonNullable.group(
    {
      validators:g=>
        (g.get('password')?.value===g.get('password_confirmation')?.value)
          ? null
          : { passwordMismatch:true }
    }
  );

  ngOnInit(): void {
    isPlatformBrowser(this._7) && void this._17();
  }

  private async _17(): Promise<void> {

    try {

      const t =
        await this._3.execute(
          'auth_register' as RecaptchaAction
        );

      this._13.set(t);
      this._12.set(true);

    } catch {

      this._12.set(false);

    }

  }

  private async _18(): Promise<string> {

    try {

      const t =
        await this._3.execute(
          'auth_register' as RecaptchaAction
        );

      this._13.set(t);

      return t;

    } catch {

      throw new Error(
        this._1.t().auth.recaptchaError
      );

    }

  }

  _19(): void {
    this._8.update(v=>!v);
  }

  get _20(): string {

    const x =
      this._16.controls.country.value;

    return (
      this._14.find(
        y=>y.code===x
      )?.flag
    ) ?? '🌍';

  }

  _21(x:string): string | null {

    return (
      this._11()[x]?.[0]
    ) ?? null;

  }

  async _22(): Promise<void> {

    if (this._9()) return;

    this._11.set({});

    const f = this._16;

    if (f.invalid) {

      f.markAllAsTouched();

      const c = f.controls;

      c.acceptedTerms.invalid
        ? this._6.error(this._1.t().error.E_cgu)
        : c.email.invalid
          ? this._6.error(this._1.t().error.E_email)
          : c.phone.invalid
            ? this._6.error(this._1.t().error.E_phone)
            : f.errors?.['passwordMismatch']
              ? this._6.error(this._1.t().error.E_mdp)
              : this._6.error(this._1.t().error.E_400);

      return;

    }

    this._9.set(true);
    this._10.set(null);

    try {

      const r = await this._18();

      this._2.register({

        ...f.getRawValue(),

        recaptcha_token:r,

        recaptcha_action:
          'auth_register'

      }).subscribe({

        next:()=>{

          this._6.success(
            this._1.t().auth.successOtpMsg
          );

          localStorage.setItem(
            'pending_email',
            f.getRawValue().email
          );

          this._4.navigate([
            '/auth/verify-email'
          ]);

        },

        error:e=>{

          this._9.set(false);

          const a =
            e.error?.errors ?? {};

          const m =
            e.error?.message ??
            this._1.t().error.E_inscription;

          this._11.set(a);
          this._10.set(m);

          this._6.error(m);

          e.status===429 &&
            this._6.warning(
              this._1.t().error.E_429
            );

        },

        complete:()=>
          this._9.set(false)

      });

    } catch {

      this._9.set(false);

      this._6.error(
        this._1.t().error.E_recaptcha
      );

    }

  }

}
