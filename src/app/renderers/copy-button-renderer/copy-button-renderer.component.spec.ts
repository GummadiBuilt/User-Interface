import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyButtonRendererComponent } from './copy-button-renderer.component';

describe('CopyButtonRendererComponent', () => {
  let component: CopyButtonRendererComponent;
  let fixture: ComponentFixture<CopyButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyButtonRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
