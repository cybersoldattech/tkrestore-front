import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import type { Country, CountryWithFlag, CountryPricing } from '../../types/country';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiUrl}`;

  private countriesSubject = new BehaviorSubject<CountryWithFlag[]>([]);
  public countries$ = this.countriesSubject.asObservable();

  getCountries(): Observable<CountryWithFlag[]> {
    return this.http.get<{ data: Country[] }>(`${this.apiBase}/countries`).pipe(
      map(res => res.data.map(this.mapFlag)),
      catchError(() => of([]))
    );
  }

  loadCountries(): void {
    if (this.countriesSubject.getValue().length > 0) return; // évite les re-chargements inutiles
    this.getCountries().subscribe(countries => {
      this.countriesSubject.next(countries);
    });
  }

  /**
   * Récupère la structure de prix pour un pays donné (par ID ou iso_code).
   * La réponse API Laravel retourne :
   * {
   *   country: Country,
   *   currency: string,
   *   categories: Array<{
   *     id, name,
   *     sub_categories: Array<{ id, name, prices: Array<{ price, currency_code }> }>
   *   }>
   * }
   * On normalise ici pour que le composant reçoive toujours CountryPricing propre.
   */
  getCountryPricing(countryId: string): Observable<CountryPricing | null> {
    return this.http.get<any>(`${this.apiBase}/countries/${countryId}/pricing`).pipe(
      map(res => this.normalizePricing(res)),
      catchError(() => of(null))
    );
  }

  private normalizePricing(res: any): CountryPricing {
    const currency = res.currency ?? res.country?.currency_code ?? '';
    const categories = (res.categories?.data ?? res.categories ?? []).map((cat: any) => {
      // Laravel Resource peut retourner sub_categories ou subCategories selon la Resource
      const rawSubs = cat.sub_categories ?? cat.subCategories ?? cat.subcategories ?? [];
      const subcategories = rawSubs.map((sub: any) => {
        // Prix : soit prix direct (sub.price), soit via relation prices[]
        const priceEntry = sub.prices?.[0] ?? null;
        return {
          id: sub.id,
          name: sub.name,
          price: sub.price ?? priceEntry?.price ?? priceEntry?.amount ?? null,
          currency: sub.currency ?? priceEntry?.currency_code ?? currency,
          founder_amount: sub.founder_amount
        };
      }).filter((sub: any) => sub.price !== null && sub.price > 0); // n'afficher que ceux avec prix

      return {
        id: cat.id,
        name: cat.name,
        subcategories,
      };
    }).filter((cat: any) => cat.subcategories.length > 0); // cacher catégories sans prix

    return {
      country: res.country,
      currency,
      categories,
    };
  }

  private mapFlag(country: Country): CountryWithFlag {
    const code = (country.iso_code || '').toLowerCase();
    const subcode = code.substr(0, 2);
    return {
      ...country,
      flag: code ? `https://flagcdn.com/w40/${subcode}.png` : ''
    };
  }
}