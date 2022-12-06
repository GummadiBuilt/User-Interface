import { Directive, ElementRef, Host, HostListener, Input, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[onblur]'
})
export class BlurFormatDirective implements OnInit {
  @Input('onblur') transform!: any;
  @HostListener('blur') onBlur() {
    if (this.transform && this.control) {
      this.el.nativeElement.value = this.transform(this.control.value);
    }
  }
  @HostListener('focus') onFocus() {
    if (this.transform && this.control) {
      this.el.nativeElement.value = this.control.value ? this.control.value : '';
    }
  }
  constructor(
    private el: ElementRef,
    @Optional() @Host() private control: NgControl
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.onBlur()
    });
  }

}
