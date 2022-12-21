import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCellRendererComponent } from './unit-cell-renderer.component';

describe('UnitCellRendererComponent', () => {
  let component: UnitCellRendererComponent;
  let fixture: ComponentFixture<UnitCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
