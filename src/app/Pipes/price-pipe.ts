import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true 
})
export class PricePipe implements PipeTransform {
  transform(amount?: number, currency: string = 'XAF'): string {
    if (!amount) return '';

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  }
}
