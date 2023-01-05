import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderApplicationFormComponent } from './tender-application-form.component';

describe('TenderApplicationFormComponent', () => {
  let component: TenderApplicationFormComponent;
  let fixture: ComponentFixture<TenderApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderApplicationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
