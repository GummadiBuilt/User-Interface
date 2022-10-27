import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditApprovalsComponent } from './audit-approvals.component';

describe('AuditApprovalsComponent', () => {
  let component: AuditApprovalsComponent;
  let fixture: ComponentFixture<AuditApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditApprovalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
