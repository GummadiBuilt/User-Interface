import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
export interface State {
  flag: string;
  name: string;
}
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
  address!: FormGroup;

  stateCtrl = new FormControl('');
  states: State[] = [
    {
      name: 'Arkansas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg',
    },
    {
      name: 'California',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
    },
    {
      name: 'Florida',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    },
    {
      name: 'Texas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
    },
    {
      name: 'Arkansas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg',
    },
    {
      name: 'California',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
    },
    {
      name: 'Florida',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    },
    {
      name: 'Texas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
    },
    {
      name: 'Arkansas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg',
    },
    {
      name: 'California',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
    },
    {
      name: 'Florida',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    },
    {
      name: 'Texas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
    },
    {
      name: 'Arkansas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg',
    },
    {
      name: 'California',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
    },
    {
      name: 'Florida',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    },
    {
      name: 'Texas',
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
    }
  ];
  filteredStates!: Observable<State[]>;

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
    if (!this.typeOfEstablishments.includes(event.option.viewValue)) {
      this.typeOfEstablishments.push(event.option.viewValue);
    }
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

    //states
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.states.slice())),
    );
  }

  ngOnInit(): void {
    this.companyDetails = this._formBuilder.group({
      users: ['', Validators.required],
      company_name: ['', [Validators.required, Validators.maxLength(50)]],
      year_of_establishment: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      type_of_establishment: ['', Validators.required],
      // address: ['', Validators.required],
      address: this._formBuilder.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required]
      }),
    });
    this.personalDetails = this._formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
    this.projectDetails = this._formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
    });
  }
  //state
  private _filterStates(valueState: string): State[] {
    const filterState = valueState.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().includes(filterState));
  }
}
