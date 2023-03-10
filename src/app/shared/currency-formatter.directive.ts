import { Directive, HostListener, Self, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Directive({
  selector: '[currencyFormatter]'
})
export class CurrencyFormatterDirective implements OnInit,AfterViewInit, OnDestroy {

  private formatter: Intl.NumberFormat;
  private destroy$ = new Subject();

  constructor(@Self() private ngControl: NgControl) {
    this.formatter = new Intl.NumberFormat('en-IN', { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.ngControl.control?.value) {
        this.setValue(this.formatPrice(this.ngControl.control?.value))
        this.ngControl
          .control?.
          valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(this.updateValue.bind(this));
      }
      
    },1000);

  }
  ngAfterViewInit(){
    if (this.ngControl.control?.value) {
      this.setValue(this.formatPrice(this.ngControl.control?.value))
      this.ngControl
        .control?.
        valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.updateValue.bind(this));
    }
  }

  updateValue(value: any) {
    let inputVal = value.toString() || '';
   // console.log('if', this.ngControl.control?.value)
    this.setValue(!!inputVal ?
      this.validateDecimalValue(inputVal.replace(/[^0-9.]/g, '')) : '');
  }
  @HostListener('focus') onFocus() {
    this.setValue(this.unformatValue(this.ngControl.value));
  }

  @HostListener('blur') onBlur() {
    let value = this.ngControl.control?.value || '';
    !!value && this.setValue(this.formatPrice(value));
  }

  formatPrice(v: number | bigint) {
    return this.formatter.format(v);
  }
  unformatValue(v:any) {
    return v?.replace(/,/g, '');
  }

  validateDecimalValue(v: any) {
    // Check to see if the value is a valid number or not
    if (Number.isNaN(Number(v))) {
      // strip out last char as this would have made the value invalid
      const strippedValue = v.slice(0, v.length - 1);

      // if value is still invalid, then this would be copy/paste scenario
      // and in such case we simply set the value to empty
      return Number.isNaN(Number(strippedValue)) ? '' : strippedValue;
    }
    return v;
  }

  setValue(v: string) {
    this.ngControl.valueAccessor?.writeValue(v);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}