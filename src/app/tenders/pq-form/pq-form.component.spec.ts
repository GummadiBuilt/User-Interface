import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PQFormComponent } from './pq-form.component';

describe('PQFormComponent', () => {
  let component: PQFormComponent;
  let fixture: ComponentFixture<PQFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PQFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PQFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
