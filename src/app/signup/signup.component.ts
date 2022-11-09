import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Directive, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApiServicesService } from '../shared/api-services.service';
import { registrationMasterData, registrationStatesData, registrationCitiesData, applicationRoles } from '../shared/responses';
import { typeOfEstablishment } from '../shared/responses';
import { countries } from '../shared/responses';
import { userRegistrationResopnse } from './signResponses';
import { StatementVisitor } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';
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
  countries = new Array<countries>();
  applicationRoles = new Array<applicationRoles>();
  states = new Array<registrationStatesData>();
  cities = new Array<registrationCitiesData>();
  typeOfEstablishmentList = new Array<typeOfEstablishment>();

  //matchips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  typeOfEstablishmentCtrl = new FormControl('');
  filteredTypeOfEstablishments!: Observable<string[]>;
  typeOfEstablishment: string[] = [];
  allTypeOfEstablishments: string[] = [];
  roleId: any;

  // roleTypeId: any;
  // onCategorySelected(roleTypeId: number) {
  //   if (this.roleTypeId == 2) {
  //     this.typeOfEstablishment = ['CIVIL'];
  //   }
  //   if (this.roleTypeId == 1) {
  //     this.typeOfEstablishment = [];
  //   }
  // }

  @ViewChild('typeOfEstablishmentInput') typeOfEstablishmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  countryList = new Array<countries>();;
  statesList = new Array<registrationStatesData>();
  citiesList = new Array<registrationCitiesData>();

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our typeOfEstablishment
    if (value) {
      this.typeOfEstablishment.push(value);
    }
    // Clear the input value
    event.chipInput?.clear();
    this.typeOfEstablishmentCtrl.setValue(null);
  }

  remove(typeOfEstablishment: string): void {
    const index = this.typeOfEstablishment.indexOf(typeOfEstablishment);
    if (index >= 0) {
      this.typeOfEstablishment.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.typeOfEstablishment.includes(event.option.viewValue)) {
      this.typeOfEstablishment.push(event.option.viewValue);
    }
    this.typeOfEstablishmentInput.nativeElement.value = '';
    this.typeOfEstablishmentCtrl.setValue(null);
  }




  stepperOrientation!: Observable<StepperOrientation>;
  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService, private toastr: ToastrService, private router: Router) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));


  }

  ngOnInit(): void {
    this.companyDetails = this._formBuilder.group({
      users: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      yearOfEstablishment: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      typeOfEstablishment: [this.typeOfEstablishment],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
    this.personalDetails = this._formBuilder.group({
      contactName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactDesignation: ['', Validators.required],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailAddress: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    });
    this.projectDetails = this._formBuilder.group({
      coordinatorName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      coordinatorMobileNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
    });

    this.getMasterdata();
    //mtachips
    this.filteredTypeOfEstablishments = this.typeOfEstablishmentCtrl.valueChanges.pipe(
      startWith(null),
      map((typeOfEstablishment: string | null) => (typeOfEstablishment ? this._filter(typeOfEstablishment) : this.allTypeOfEstablishments.slice())),
    );
  }

  getMasterdata() {
    this.ApiServicesService.getRegistrationMasterData().subscribe((data: registrationMasterData) => {
      this.typeOfEstablishmentList = data.typeOfEstablishments;
      this.allTypeOfEstablishments = this.typeOfEstablishmentList.map(item => item.establishmentDescription);
      this.countries = data.countries;
      this.countryList = this.countries.slice();
      this.applicationRoles = data.applicationRoles.filter(item => item.displayToAll === true);
      console.log(this.applicationRoles);
      // console.log('typeof establishment', this.allTypeOfEstablishments);
      // console.log('typeof toeestablishment', this.typeOfEstablishment);
    });

  }
  onCountrySelectEvent(id: any) {
    //console.log(id.countryIsoCode);

    this.ApiServicesService.getRegistrationStatesData(id.countryIsoCode).subscribe((data: registrationStatesData[]) => {
      this.states = data;
      this.statesList = this.states.slice();
    });
  }
  onStateSelectEvent(value: any) {
    this.ApiServicesService.getRegistrationCitiesData(value.stateIsoCode).subscribe((data: registrationCitiesData[]) => {
      this.cities = data;
      this.citiesList = this.cities.slice();
    });
  }
  onSubmit() {
    // console.log('first step', this.companyDetails.value);
    // console.log('second step', this.personalDetails.value);
    // console.log('third step', this.projectDetails.value);
    // console.log('valid form companyDetails', this.companyDetails.valid);
    // console.log('valid form personalDetails', this.personalDetails.valid);
    // console.log('valid form projectDetails', this.projectDetails.valid);
    if (this.personalDetails.valid && this.projectDetails.valid) {
      const registrationObject = Object.assign({}, this.companyDetails.value, this.personalDetails.value, this.projectDetails.value);
      const resultRegistrationObject = new userRegistrationResopnse(registrationObject);

      this.ApiServicesService.userRegistration(JSON.stringify(resultRegistrationObject)).subscribe(
        (response => {
          if (response['status'] == 200) {
            console.log(response);
            this.toastr.success('Successfully Registered');
            this.router.navigate(['/home']);
          }
        }),
        (error => {
          //console.log(error);
          this.toastr.error(error);
        })
      )
    }
    else {
      console.log('Registration Form is invalid');
    }

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTypeOfEstablishments.filter(typeOfEstablishment => typeOfEstablishment.toLowerCase().includes(filterValue));
  }
  addOnBlur(event: FocusEvent) {
    const target: HTMLElement = event.relatedTarget as HTMLElement;
    if (!target || target.tagName !== 'MAT-OPTION') {
      this.add({
        input: this.typeOfEstablishmentInput.nativeElement,
        value: this.typeOfEstablishmentInput.nativeElement.value
      } as MatChipInputEvent
      );
    }
  }
}

