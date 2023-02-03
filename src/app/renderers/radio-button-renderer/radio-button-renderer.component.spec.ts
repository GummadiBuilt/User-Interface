import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonRendererComponent } from './radio-button-renderer.component';

describe('RadioButtonRendererComponent', () => {
  let component: RadioButtonRendererComponent;
  let fixture: ComponentFixture<RadioButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioButtonRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
