import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreValuesComponent } from './core-values.component';

describe('CoreValuesComponent', () => {
  let component: CoreValuesComponent;
  let fixture: ComponentFixture<CoreValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
