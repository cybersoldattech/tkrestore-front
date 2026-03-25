import { Injectable } from '@angular/core';
 
import {  inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface PinInstruction {
  text: string;
  template: string;
}

export interface PinPromptChannel {
  type: string;
  displayName: { en: string; fr: string };
  variables?: { shortCode: string };
  instructions: { en: PinInstruction[]; fr: PinInstruction[] };
}

export interface PinPromptInstructions {
  channels: PinPromptChannel[];
}

export interface OperationTypeConfig {
  minAmount: string;
  maxAmount: string;
  authType: string;
  pinPrompt: string;
  pinPromptRevivable: boolean;
  pinPromptInstructions: PinPromptInstructions;
  status: string;
}

export interface ProviderCurrency {
  currency: string;
  displayName: string;
  operationTypes: {
    DEPOSIT?: OperationTypeConfig;
  };
}

export interface ProviderInfo {
  provider: string;
  displayName: string;
  nameDisplayedToCustomer?: string;
  logo: string;
  currencies?: ProviderCurrency[];
}


 
export interface CountryConfig {
  country: string;           // ISO 3166-1 alpha-3, e.g. "CMR"
  displayName: { fr: string; en: string };
  prefix: string;            // e.g. "237"
  flag: string;
  providers: ProviderInfo[];
}
 
export interface ActiveConfiguration {
  countries: CountryConfig[];
}

@Injectable({
  providedIn: 'root',
})
export class CountryProviderService {
  private readonly http = inject(HttpClient);
 
  // ── State ─────────────────────────────────────────────────────
  private readonly _config    = signal<ActiveConfiguration | null>(null);
  private readonly _loading   = signal(false);
  private readonly _userCountry = signal<string | null>(null); // ISO alpha-3
 
  readonly config     = this._config.asReadonly();
  readonly isLoading  = this._loading.asReadonly();
  readonly userCountry = this._userCountry.asReadonly();
 
  // ── Computed: providers for current country ───────────────────
  readonly currentCountryProviders = computed<ProviderInfo[]>(() => {
    const cfg     = this._config();
    const country = this._userCountry();
    if (!cfg || !country) return [];
    // console.log('Computing providers for country:', country);
    return this.getProvidersForCountry(country);
  });
 
  readonly currentCountryConfig = computed<CountryConfig | null>(() => {
    const cfg     = this._config();
    const country = this._userCountry();
    if (!cfg || !country) return null;
    return cfg.countries.find(c => c.country === country) ?? null;
  });
 
  // ─────────────────────────────────────────────────────────────
  //  Load active configuration from backend (which proxies PawaPay)
  // ─────────────────────────────────────────────────────────────
 
  loadConfiguration(): Observable<ActiveConfiguration> {
    this._loading.set(true);
    return this.http
      .get<ActiveConfiguration>(`${environment.apiUrl}/active-conf`)
      .pipe(
        tap(cfg => {
          this._config.set(cfg);
          this._loading.set(false);
        })
      );
  }
 
  // ─────────────────────────────────────────────────────────────
  //  Get providers for a given country (ISO alpha-3)
  // ─────────────────────────────────────────────────────────────
 
  getProvidersForCountry(countryCode: string): ProviderInfo[] {
    const cfg = this._config();
    if (!cfg) return [];
    
    const normalized = this.toAlpha3(countryCode); // ← conversion ici aussi
    const country = cfg.countries.find(c => c.country === normalized);
    return country?.providers ?? [];
  }
 
  // ─────────────────────────────────────────────────────────────
  //  Detect country from phone prefix
  // ─────────────────────────────────────────────────────────────
 
  detectCountryFromPhone(phone: string): CountryConfig | null {
    const cfg = this._config();
    if (!cfg) return null;
 
    const digits = phone.replace(/\D/g, '');
 
    // Sort by prefix length DESC to match longest prefix first
    const sorted = [...cfg.countries].sort(
      (a, b) => b.prefix.length - a.prefix.length
    );
 
    return sorted.find(c => digits.startsWith(c.prefix)) ?? null;
  }
 
  // ─────────────────────────────────────────────────────────────
  //  Set user's country manually (from profile or IP detection)
  // ─────────────────────────────────────────────────────────────
 
  // setUserCountry(countryCode: string): void {
  //   this._userCountry.set(countryCode);
  // }

  setUserCountry(countryCode: string): void {
    this._userCountry.set(this.toAlpha3(countryCode));
  }
 
  // ─────────────────────────────────────────────────────────────
  //  Get currency for a provider
  // ─────────────────────────────────────────────────────────────
 
 getCurrencyForProvider(provider: string): string {
  const cfg = this._config();

  if (!cfg) return 'XAF';

  for (const country of cfg.countries) {
    const found = country.providers.find(
      p => p.provider === provider
    );

    if (found?.currencies?.[0]) {
      return found.currencies[0].currency;
    }
  }

  // Fallback: infer from provider country code suffix
  const suffix = provider.split('_').pop() ?? '';

  const currencyMap: Record<string, string> = {
    // Central Africa
    CMR: 'XAF',
    COG: 'XAF',
    GAB: 'XAF',

    // West Africa
    SEN: 'XOF',
    CIV: 'XOF',
    BEN: 'XOF',
    BFA: 'XOF',

    // East Africa
    ETH: 'ETB',
    KEN: 'KES',
    UGA: 'UGX',
    TZA: 'TZS',
    RWA: 'RWF',

    // Southern Africa
    ZMB: 'ZMW',
    MWI: 'MWK',
    MOZ: 'MZN',
    LSO: 'LSL',

    // Other
    GHA: 'GHS',
    NGA: 'NGN',
    SLE: 'SLL',
    COD: 'CDF',

    // Legacy ISO2 support
    CM: 'XAF',
    SN: 'XOF',
    CI: 'XOF',
    BJ: 'XOF',
    BF: 'XOF',
    GH: 'GHS',
    KE: 'KES',
    UG: 'UGX',
    TZ: 'TZS',
    RW: 'RWF',
    ZM: 'ZMW',
    MW: 'MWK',
    MZ: 'MZN',
    LS: 'LSL',
    SL: 'SLL',
    NG: 'NGN',
    ET: 'ETB',
    CD: 'CDF',
    CG: 'XAF',
    GA: 'XAF',
  };

  return currencyMap[suffix] ?? 'XAF';
}

private readonly ISO2_TO_ISO3: Record<string, string> = {
  // West Africa
  BJ: 'BEN',
  BF: 'BFA',
  CI: 'CIV',
  GH: 'GHA',
  NG: 'NGA',
  SN: 'SEN',
  SL: 'SLE',

  // Central Africa
  CM: 'CMR',
  CG: 'COG',
  CD: 'COD',
  GA: 'GAB',

  // East Africa
  ET: 'ETH',
  KE: 'KEN',
  RW: 'RWA',
  TZ: 'TZA',
  UG: 'UGA',

  // Southern Africa
  LS: 'LSO',
  MW: 'MWI',
  MZ: 'MOZ',
  ZM: 'ZMB',
};

  private toAlpha3(code: string): string {
    // console.log('Converting country code to alpha-3:', code);
    if (code.length === 3) return code; // déjà alpha-3
    return this.ISO2_TO_ISO3[code.toUpperCase()] ?? code;
  }
  
  // ─────────────────────────────────────────────────────────────
  //  Get all countries (for a country selector)
  // ─────────────────────────────────────────────────────────────
 
  getAllCountries(): CountryConfig[] {
    return this._config()?.countries ?? [];
  }
}
