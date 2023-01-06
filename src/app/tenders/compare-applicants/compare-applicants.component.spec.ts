import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareApplicantsComponent } from './compare-applicants.component';

describe('CompareApplicantsComponent', () => {
  let component: CompareApplicantsComponent;
  let fixture: ComponentFixture<CompareApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareApplicantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
