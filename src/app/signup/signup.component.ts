import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  companyDetails!: FormGroup;
  personalDetails!: FormGroup;
  projectDetails!: FormGroup;
  typeOfEstablishmentsList: string[] = ['Private Limited Company', 'Public Limited Company', 'Partnership',
    'Limited Liability Partnership', 'One Person Company'];
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
  ];
  countries: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
  ];
  typeOfWorksList: string[] = [
    'Civil',
    'Electrical',
  ];

  stepperOrientation!: Observable<StepperOrientation>;
  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.companyDetails = this._formBuilder.group({
      users: ['', Validators.required],
      company_name: ['', [Validators.required, Validators.maxLength(20)]],
      year_of_establishment: ['', Validators.required],
      type_of_establishment: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      type_of_work: ['', Validators.required],
    });
    this.personalDetails = this._formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
    this.projectDetails = this._formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

}
