import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
export class VerifyOtpPage implements OnDestroy {

  private readonly _0 = inject(FormBuilder);
  private readonly _1 = inject(AuthService);
  private readonly _2 = inject(Router);
  private readonly _3 = inject(NotificationService);

  private _4?: Subscription;

  readonly _5 = signal(false);
  readonly _6 = signal(false);
  readonly _7 = signal(0);
  readonly _8 = signal('');

  readonly _9 = computed(
    () =>
      localStorage.getItem('pending_email')
      ||
      this._1.currentUser()?.email
      ||
      ''
  );

  readonly _10 = this._0.group(
    {
      otp1:['',[Validators.required,Validators.pattern(/^[0-9]$/)]],
      otp2:['',[Validators.required,Validators.pattern(/^[0-9]$/)]],
      otp3:['',[Validators.required,Validators.pattern(/^[0-9]$/)]],
      otp4:['',[Validators.required,Validators.pattern(/^[0-9]$/)]],
      otp5:['',[Validators.required,Validators.pattern(/^[0-9]$/)]],
      otp6:['',[Validators.required,Validators.pattern(/^[0-9]$/)]],
    },
    {
      validators:this._11
    }
  );

  ngOnInit(): void {

    if(typeof window==='undefined') return;

    if(
      this._1.currentUser()
      ?.email_verified_at
    ){
      this._2.navigate([
        '/app/dashboard'
      ]);
      return;
    }

    setTimeout(
      ()=>this._18(1),
      100
    );

  }

  ngOnDestroy(): void {

    localStorage.removeItem(
      'pending_email'
    );

    this._4?.unsubscribe();

  }

  _12(): void {

    if(this._10.invalid){

      this._10.markAllAsTouched();

      this._8.set(
        'Code OTP complet requis (6 chiffres)'
      );

      return;

    }

    this._5.set(true);
    this._8.set('');

    const a =
      Object.values(
        this._10.value
      ).join('');

    const b =
      this._9();

    if(!b){

      this._3.error(
        'Email non trouvé. Recommencez l\'inscription.'
      );

      this._2.navigate([
        '/auth/register'
      ]);

      this._5.set(false);

      return;

    }

    this._1.verifyOtp(
      b,
      a
    ).subscribe({

      next:()=>{

        this._3.success(
          'Email vérifié ! Redirection...'
        );

        localStorage.removeItem(
          'pending_email'
        );

        this._2.navigate([
          '/app/dashboard'
        ]);

      },

      error:e=>{

        this._5.set(false);

        this._10.reset();

        this._8.set(
          e.error?.message
          ||
          'Code OTP incorrect ou expiré'
        );

        this._3.error(
          this._8()
        );

        setTimeout(
          ()=>this._18(1),
          200
        );

      }

    });

  }

  _13(): void {

    if(
      this._7()>0
      ||
      this._6()
    ) return;

    const a =
      this._9();

    if(!a){

      this._3.error(
        'Email non trouvé.'
      );

      return;

    }

    this._6.set(true);

    this._1.resendOtp(a)
      .subscribe({

        next:()=>{

          this._3.success(
            'Nouveau code envoyé !'
          );

          this._14(60);

        },

        error:()=>{

          this._3.error(
            'Erreur lors de l\'envoi.'
          );

          this._6.set(false);

        },

        complete:()=>
          this._6.set(false)

      });

  }

  private _11(
    c:AbstractControl
  ):ValidationErrors|null{

    return Object
      .values(
        c.value||{}
      )
      .join('')
      .length===6
        ? null
        : {
            otpMismatch:true
          };

  }

  private _14(
    s:number
  ):void{

    this._7.set(s);

    this._4?.unsubscribe();

    this._4=
      interval(1000)
      .subscribe({

        next:()=>{

          const x=
            this._7()-1;

          this._7.set(x);

          x<=0 &&
            this._4
            ?.unsubscribe();

        }

      });

  }

  private _18(
    i:number
  ):void{

    (
      document.querySelector(
        `input[formControlName="otp${i}"]`
      ) as HTMLInputElement
    )?.focus();

  }

  _15(
    e:Event,
    i:number
  ):void{

    /^[0-9]$/.test(
      (
        e.target
        as HTMLInputElement
      ).value
    )
    &&
    i<6
    &&
    this._18(i+1);

  }

  _16(
    e:KeyboardEvent,
    i:number
  ):void{

    const k=e.key;

    if(
      k==='Backspace'
    ){

      (
        e.target
        as HTMLInputElement
      ).value===''

      &&

      i>1

      &&

      this._18(i-1);

    }

    else if(
      k==='ArrowLeft'
      &&
      i>1
    ){

      this._18(i-1);

    }

    else if(
      k==='ArrowRight'
      &&
      i<6
    ){

      this._18(i+1);

    }

  }

  _17(
    e:ClipboardEvent
  ):void{

    e.preventDefault();

    const p=
      (
        e.clipboardData
        ?.getData('text')
        ||''
      )
      .slice(0,6)
      .replace(/\D/g,'');

    if(!p.length) return;

    const o:
      Record<
        string,
        string
      >={};

    for(
      let i=1;
      i<=6;
      i++
    ){

      o[
        `otp${i}`
      ]=
        p[i-1]
        ||'';

    }

    this._10.patchValue(o);

    setTimeout(
      ()=>this._18(
        Math.min(
          p.length,
          6
        )
      ),
      0
    );

    this._10.markAllAsTouched();

  }

}
