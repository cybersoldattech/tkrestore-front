export interface Country {
  id: string;
  name: string;
  iso_code?: string;
  currency_code?: string;
}

export interface CountryWithFlag extends Country {
  flag: string;
}

export interface CountryWithFlag extends Country {
  flag: string;
}

export interface SubCategory {
  id: string;
  name: string;
  price?: number;
  founder_amount? : number;
  currency?: string;
}

export interface Category {
  name: string;
  subcategories: SubCategory[];
}

export interface CountryPricing {
  country: Country;
  currency: string;
  categories: Category[];
}

export interface Category {
  id:string;
  name: string;
  subcategories: SubCategory[];
}

export interface CountryPricing {
  country: Country;
  currency: string;
  categories: Category[];
}

