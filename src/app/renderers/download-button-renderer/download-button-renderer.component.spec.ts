import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadButtonRendererComponent } from './download-button-renderer.component';

describe('DownloadButtonRendererComponent', () => {
  let component: DownloadButtonRendererComponent;
  let fixture: ComponentFixture<DownloadButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadButtonRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
