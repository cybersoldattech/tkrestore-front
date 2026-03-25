import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponentPage } from './settings-component-page';

describe('SettingsComponentPage', () => {
  let component: SettingsComponentPage;
  let fixture: ComponentFixture<SettingsComponentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
