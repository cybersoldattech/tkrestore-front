import { TestBed } from '@angular/core/testing';

import { CountryProviderService } from './country-provider.service';

describe('CountryProviderService', () => {
  let service: CountryProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
