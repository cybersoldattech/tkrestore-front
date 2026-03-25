import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cgu } from './cgu';

describe('Cgu', () => {
  let component: Cgu;
  let fixture: ComponentFixture<Cgu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cgu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cgu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
