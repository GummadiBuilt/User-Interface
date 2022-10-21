import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class SignupComponent implements OnInit {
  companyDetails!: FormGroup;
  personalDetails!: FormGroup;
  projectDetails!: FormGroup;
  // typeOfEstablishmentsList: string[] = ['Private Limited Company', 'Public Limited Company', 'Partnership',
  //   'Limited Liability Partnership', 'One Person Company'];

  myControl = new FormControl('');
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
  ];
  filteredStates!: Observable<string[]>;


  countries: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
  ];
  typeOfEstablishmentList: string[] = [
    'Civil',
    'Electrical',
    'Mechanical'
  ];

  //matchips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  typeOfEstablishmentCtrl = new FormControl('');
  filteredTypeOfEstablishments: Observable<string[]>;
  typeOfEstablishments: string[] = [];
  allTypeOfEstablishments: string[] = ['Civil', 'Electrical', 'Mechanical'];

  @ViewChild('typeOfEstablishmentInput') typeOfEstablishmentInput!: ElementRef<HTMLInputElement>;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our typeOfEstablishment
    if (value) {
      this.typeOfEstablishments.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.typeOfEstablishmentCtrl.setValue(null);
  }

  remove(typeOfEstablishment: string): void {
    const index = this.typeOfEstablishments.indexOf(typeOfEstablishment);

    if (index >= 0) {
      this.typeOfEstablishments.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.typeOfEstablishments.push(event.option.viewValue);
    this.typeOfEstablishmentInput.nativeElement.value = '';
    this.typeOfEstablishmentCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTypeOfEstablishments.filter(typeOfEstablishment => typeOfEstablishment.toLowerCase().includes(filterValue));
  }



  stepperOrientation!: Observable<StepperOrientation>;
  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    //mtachips
    this.filteredTypeOfEstablishments = this.typeOfEstablishmentCtrl.valueChanges.pipe(
      startWith(null),
      map((typeOfEstablishment: string | null) => (typeOfEstablishment ? this._filter(typeOfEstablishment) : this.allTypeOfEstablishments.slice())),
    );
  }

  ngOnInit(): void {
    this.companyDetails = this._formBuilder.group({
      users: ['', Validators.required],
      company_name: ['', [Validators.required, Validators.maxLength(20)]],
      year_of_establishment: ['', Validators.required],
      type_of_establishment: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(200)]],
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

    //states
    this.filteredStates = this.myControl.valueChanges.pipe(
      startWith(''),
      map(valueState => this._filteredStates(valueState || '')),
    );
  }
  //state
  private _filteredStates(valueState: string): string[] {
    const filterState = valueState.toLowerCase();
    return this.states.filter(state => state.toLowerCase().includes(filterState));
  }
}
