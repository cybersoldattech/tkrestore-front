import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dpa } from './dpa';

describe('Dpa', () => {
  let component: Dpa;
  let fixture: ComponentFixture<Dpa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dpa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dpa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
