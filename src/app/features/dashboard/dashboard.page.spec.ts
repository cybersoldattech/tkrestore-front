import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { LanguageService } from '../../../core/services/language.service';
import { DocumentService } from '../../../core/services/document.service';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let mockDocumentService: jasmine.SpyObj<DocumentService>;
  let mockLanguageService: jasmine.SpyObj<LanguageService>;

  beforeEach(async () => {
    mockDocumentService = jasmine.createSpyObj('DocumentService', ['getUserStats', 'getUserTransactions']);
    mockLanguageService = jasmine.createSpyObj('LanguageService', [], {
      t: signal({
        dashboard: {
          gains: 'Gains',
          expenses: 'Expenses',
          restored: 'Restored',
          declared: 'Declared',
          // ... other translations
        }
      })
    });

    mockDocumentService.getUserStats.and.returnValue(of({
      stats: { earned: 10000, spent: 5000, restored: 5, declared: 10 }
    }));

    await TestBed.configureTestingModule({
      imports: [DashboardPage, FormsModule, RouterTestingModule],
      providers: [
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: LanguageService, useValue: mockLanguageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch view monthly/yearly', () => {
    const selectEvent = { target: { value: 'yearly' } };
    component.setView(selectEvent);
    expect(component.view()).toBe('yearly');
  });

  it('should switch year', () => {
    const selectEvent = { target: { value: '2027' } };
    component.setYear(selectEvent);
    expect(component.selectedYear()).toBe(2027);
  });

  it('should format amount with FCFA', () => {
    expect(component.formatAmount(10000)).toBe('10,000 FCFA');
  });

  it('should show chart type line for monthly', () => {
    component.view.set('monthly');
    expect(component.chartType()).toBe('line');
  });

  it('should show chart type bar for yearly', () => {
    component.view.set('yearly');
    expect(component.chartType()).toBe('bar');
  });
});

