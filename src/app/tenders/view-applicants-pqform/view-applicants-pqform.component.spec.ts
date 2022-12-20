import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicantsPQFormComponent } from './view-applicants-pqform.component';

describe('ViewApplicantsPQFormComponent', () => {
  let component: ViewApplicantsPQFormComponent;
  let fixture: ComponentFixture<ViewApplicantsPQFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApplicantsPQFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApplicantsPQFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
