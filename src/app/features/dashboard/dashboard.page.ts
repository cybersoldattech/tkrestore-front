import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DocumentService, ChartDataResponse } from '../../core/services/document.service';
import { LanguageService } from '../../core/services/language.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';



type A={
  total_items:number;
  lost_count:number;
  found_count:number;
  matched_count:number;
  restored:number;
  declared:number;
  earned:number;
  spent:number;
  balance:number;
  currency:string;
};

type B={
  id:string;
  type:'gain'|'expense'|'refund';
  label:string;
  amount:number;
  currency:string;
  date:string;
  date_iso:string;
  status:string;
  tx_type:string;
  item_title:string|null;
};

export class DashboardPage {

  readonly _0=inject(LanguageService).t;

  private readonly _1=
    inject(DocumentService);

  readonly _2=
    toSignal(
      this._1.getUserStats()
      .pipe(
        map(
          r=>r.stats as A
        )
      ),
      {
        initialValue:{
          total_items:0,
          lost_count:0,
          found_count:0,
          matched_count:0,
          restored:0,
          declared:0,
          earned:0,
          spent:0,
          balance:0,
          currency:'XAF'
        } as A
      }
    );

  readonly _3=
    signal<B[]>([]);

  readonly _4=
    signal(false);

  readonly _5=
    signal<'monthly'|'yearly'>(
      'monthly'
    );

  readonly _6=
    signal(
      new Date()
      .getFullYear()
    );

  readonly _7=
    signal(true);

  readonly _8=
    signal<ChartDataResponse|null>(
      null
    );

  readonly _9=
    computed(
      ()=>this._8()
      ?.available_years
      ??
      [
        new Date()
        .getFullYear()
      ]
    );

  readonly _10=
    computed(
      ()=>this._2()
      .currency
      ??
      'XAF'
    );

  constructor(){

    this._11(
      'monthly',
      this._6()
    );

    this._12(
      this._6()
    );

    effect(()=>{

      const a=
        this._5();

      const b=
        this._6();

      this._11(a,b);

      this._12(b);

    });

  }

  private _11(
    a:'monthly'|'yearly',
    b:number
  ):void{

    this._7.set(true);

    this._1
      .getChartData(a,b)
      .subscribe({

        next:x=>{

          this._8.set(x);

          this._7.set(false);

        },

        error:()=>
          this._7.set(false)

      });

  }

  private _12(
    a:number
  ):void{

    this._4.set(true);

    this._1
      .getUserTransactions(a)
      .pipe(
        map(
          r=>
            r.transactions
            as B[]
        )
      )
      .subscribe({

        next:x=>{

          this._3.set(x);

          this._4.set(false);

        },

        error:()=>
          this._4.set(false)

      });

  }

  _13(
    e:Event
  ):void{

    this._5.set(
      (
        e.target
        as HTMLSelectElement
      ).value
      as
      'monthly'
      |
      'yearly'
    );

  }

  _14(
    e:Event
  ):void{

    this._6.set(
      +(
        e.target
        as HTMLSelectElement
      ).value
    );

  }

  readonly _15=
    computed<
      ChartData<
        'line'
        |
        'bar'
      >
    >(
      ()=>{

        const r=
          this._8();

        return !r
          ? {
              labels:[],
              datasets:[]
            }
          : {

              labels:r.labels,

              datasets:
                r.datasets
                .map(
                  d=>({

                    label:
                      d.label,

                    data:
                      d.data,

                    ...(
                      r.view
                      ===
                      'monthly'

                      ? {

                          borderColor:
                            d.color,

                          backgroundColor:
                            d.color+
                            '33',

                          fill:true,

                          tension:0.4,

                          pointRadius:4,

                          pointHoverRadius:6,

                          pointBackgroundColor:
                            d.color

                        }

                      : {

                          backgroundColor:
                            d.color,

                          borderRadius:6,

                          borderSkipped:false

                        }

                    )

                  })
                )

            };

      }
    );

  readonly _16=
    computed<ChartType>(
      ()=>
        this._5()
        ===
        'monthly'
          ? 'line'
          : 'bar'
    );

  readonly _17=
    computed<
      ChartConfiguration[
        'options'
      ]
    >(
      ()=>{

        const c=
          this._10();

        return {

          responsive:true,

          maintainAspectRatio:true,

          interaction:{
            mode:'index',
            intersect:false
          },

          plugins:{

            legend:{
              display:true,
              position:'top'
            },

            tooltip:{

              callbacks:{

                label:x=>

                  ` ${x.dataset.label}: ${(
                    x.parsed.y
                    ??
                    0
                  ).toLocaleString(
                    'fr-FR'
                  )} ${c}`

              }

            }

          },

          scales:{

            x:{
              grid:{
                display:false
              }
            },

            y:{

              beginAtZero:true,

              ticks:{

                callback:v=>

                  `${Number(v)
                  .toLocaleString(
                    'fr-FR'
                  )} ${c}`

              }

            }

          }

        };

      }
    );

  readonly _18=
    computed(
      ()=>{

        const r=
          this._8();

        return !r
          ? {
              gains:0,
              expenses:0
            }
          : {

              gains:
                r.datasets
                .find(
                  d=>
                    d.key
                    ===
                    'gains'
                )
                ?.data
                .reduce(
                  (
                    a,
                    b
                  )=>
                    a+b,
                  0
                )
                ??
                0,

              expenses:
                r.datasets
                .find(
                  d=>
                    d.key
                    ===
                    'expenses'
                )
                ?.data
                .reduce(
                  (
                    a,
                    b
                  )=>
                    a+b,
                  0
                )
                ??
                0

            };

      }
    );

  _19(
    a:number,
    b?:string
  ):string{

    return (
      a.toLocaleString(
        'fr-FR'
      )
      +
      ' '
      +
      (
        b
        ??
        this._10()
      )
    );

  }

}
