import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureObject } from './secure-object';

describe('SecureObject', () => {
  let component: SecureObject;
  let fixture: ComponentFixture<SecureObject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureObject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecureObject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
