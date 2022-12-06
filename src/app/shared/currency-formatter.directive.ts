import { Directive, HostListener, Self, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Directive({
  selector: '[currencyFormatter]'
})
export class CurrencyFormatterDirective implements OnInit,OnDestroy {

  private formatter: Intl.NumberFormat;
  private destroy$ = new Subject();

  constructor(@Self() private ngControl: NgControl) {
    this.formatter = new Intl.NumberFormat('en-IN', { style: "currency",currency: "INR", maximumFractionDigits: 0 });
    
  }
  ngOnInit(): void {
    this.setValue(this.formatPrice(this.ngControl.control?.value))
    // this.ngControl
    // .control?.
    // valueChanges
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(this.updateValue.bind(this));
    // this.setValue(this.formatPrice(this.ngControl.control?.value))
  }

  ngAfterViewInit() {
    this.setValue(this.formatPrice(this.ngControl.control?.value))
    this.ngControl
      .control?.
      valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updateValue.bind(this));
  }
  ngAfterContentInit() {
    // contentChildren is set
    this.setValue(this.formatPrice(this.ngControl.control?.value))
  }

  updateValue(value: any) {
    let inputVal = value || '';
     if(typeof inputVal == 'string'){
      console.log('if',this.ngControl.control?.value)
      this.setValue(!!inputVal ?
        this.validateDecimalValue(inputVal.replace(/[^0-9.]/g, '')) : '');
       // this.ngControl.control?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.updateValue.bind(this));
    } else{
      console.log('else',this.ngControl.control?.value)
      this.setValue(this.formatPrice(this.ngControl.control?.value));
     // this.ngControl.control?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(this.updateValue.bind(this));
    }    
  }

  @HostListener('focus') onFocus() {
    this.setValue(this.unformatValue(this.ngControl.control?.value));
  }

  @HostListener('blur') onBlur() {
    let value = this.ngControl.control?.value || '';
    !!value && this.setValue(this.formatPrice(value));
  }

  formatPrice(v: number | bigint) {
    return this.formatter.format(v);
  }

  unformatValue(v: string) {
    return v.replace(/[^0-9\.-]+/g, '');
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
    this.ngControl.control?.setValue(v, { emitEvent: false })
  }

  ngOnDestroy(): void {
     console.log("ngOnDestroy - Directive");
    this.setValue(this.unformatValue(this.ngControl.control?.value));
    this.destroy$.next(true);
    this.destroy$.complete();
    console.log("ngOnDestroy - Directive");
  }

}