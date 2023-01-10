import { Directive, ElementRef, HostListener, Renderer2, OnInit, OnDestroy, Self, EventEmitter, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appDate]'
})

export class DateDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  private formattedDate!: any;
  constructor(@Self() private ngControl: NgControl) {

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
  }
  formatdate(v: any) {
    const formattedDate = moment(v, 'DD/MM/YYYY');
    //const momentString = formattedDate.toDate();
   // this.ngControl.control?.get(v) = momentString;
    //.format('DD/MM/YYYY');
    return formattedDate;
  }
  updateValue(value: any) {
    const dateString = value;
    const momentVariable = moment(dateString, 'DD/MM/YYYY')
    //.format('DD/MM/YYYY'); 
    return momentVariable;


  }
  @HostListener('dateChange', ['$event']) onChange(event: any) {
    let value = this.ngControl.control?.value || '';
    !!value && this.setValue(this.formatdate(value));
  }
  setValue(v: any) {
    this.ngControl.control?.setValue(v, { emitEvent: false });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


}