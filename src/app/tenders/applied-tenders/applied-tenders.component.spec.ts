import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedTendersComponent } from './applied-tenders.component';

describe('AppliedTendersComponent', () => {
  let component: AppliedTendersComponent;
  let fixture: ComponentFixture<AppliedTendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedTendersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedTendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
