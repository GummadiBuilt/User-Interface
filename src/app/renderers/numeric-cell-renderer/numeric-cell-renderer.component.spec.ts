import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericCellRendererComponent } from './numeric-cell-renderer.component';

describe('NumericCellRendererComponent', () => {
  let component: NumericCellRendererComponent;
  let fixture: ComponentFixture<NumericCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
