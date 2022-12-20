import { DatePipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Renderer2, OnInit, OnDestroy, Self, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appDate]'
})

export class DateDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  private formattedDate!: string;
  constructor(@Self() private ngControl: NgControl,
    private datePipe: DatePipe) {

  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.ngControl.control?.value) {
        this.setValue(this.updateValue(this.ngControl.control?.value))
        this.ngControl
          .control?.
          valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(this.formatdate.bind(this));
      }
    }, 1000);
    // this.control.valueChanges?.subscribe((x) => {
    //   this.formattedDate = this.datePipe.transform(x, 'dd/MM/yyyy') || '';
    // });
  }
  formatdate(v:any) {
    console.log('formatdate',v)
    this.formattedDate =  this.datePipe.transform(v, 'dd/MM/yyyy') || '';
    console.log('format date afterr',this.formattedDate)
    return this.formattedDate;
  }
  updateValue(value:any){
    
      const date = value;
      const [day, month, year] = date.split('/');
      const convertedDate = new Date(+year, +month - 1, +day);
      return convertedDate;
    

  }
  @HostListener('dateChange', ['$event']) onChange(event: any) {
    let value = this.ngControl.control?.value || '';
    !!value && this.setValue(this.formatdate(value));
    console.log('click',value)
  }
  setValue(v: any) {
    console.log('before',v)
    this.ngControl.control?.setValue(v, { emitEvent: false })
    console.log('after',v)
    console.log('after',this.ngControl.control?.value)

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  
}