import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalFinancialBidComponent } from './technical-financial-bid.component';

describe('TechnicalFinancialBidComponent', () => {
  let component: TechnicalFinancialBidComponent;
  let fixture: ComponentFixture<TechnicalFinancialBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalFinancialBidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalFinancialBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
