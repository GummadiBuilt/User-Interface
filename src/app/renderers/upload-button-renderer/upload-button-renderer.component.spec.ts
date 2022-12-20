import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadButtonRendererComponent } from './upload-button-renderer.component';

describe('UploadButtonRendererComponent', () => {
  let component: UploadButtonRendererComponent;
  let fixture: ComponentFixture<UploadButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadButtonRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
