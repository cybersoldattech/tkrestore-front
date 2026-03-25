export interface CountryOption {
  code: string;  // ISO 3166-1 alpha-2 (e.g. 'FR')
  name: string;  // Full name (e.g. 'France')
  flag?: string; // Optional unicode flag emoji
  dialCode?:string; // Optional international dialing code (e.g. '+33')
}

export const COUNTRIES: CountryOption[] = [
  { code: 'CMR', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237' },
  { code: 'BEN', name: 'Benin', flag: '🇧🇯', dialCode: '+229' },
  { code: 'BFA', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
  { code: 'CIV', name: 'Côte d\'Ivoire', flag: '🇨🇮', dialCode: '+225' },
  { code: 'COD', name: 'Congo (RDC)', flag: '🇨🇩', dialCode: '+243' },
  { code: 'ETH', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
  { code: 'GAB', name: 'Gabon', flag: '🇬🇦', dialCode: '+241' },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'KEN', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'LSO', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266' },
  { code: 'MWI', name: 'Malawi', flag: '🇲🇼', dialCode: '+265' },
  { code: 'MOZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258' },
  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'COG', name: 'Republic of the Congo', flag: '🇨🇬', dialCode: '+242' },
  { code: 'RWA', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250' },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'SLE', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232' },
  { code: 'TZA', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
  { code: 'UGA', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
  { code: 'ZMB', name: 'Zambia', flag: '🇿🇲', dialCode: '+260' },
];

// Sorted alphabetically by name
COUNTRIES.sort((a, b) => a.name.localeCompare(b.name));
