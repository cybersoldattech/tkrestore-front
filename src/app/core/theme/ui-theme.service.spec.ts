import { TestBed } from '@angular/core/testing';
import { UiThemeService } from './ui-theme.service';

describe('UiThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('toggles mode', () => {
    const svc = TestBed.inject(UiThemeService);
    const before = svc.mode();
    svc.toggle();
    expect(svc.mode()).not.toBe(before);
  });
});

