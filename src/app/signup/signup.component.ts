import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Directive, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  //projectDetails!: FormGroup;
  countries = new Array<countries>();
  applicationRoles = new Array<applicationRoles>();
  states = new Array<registrationStatesData>();
  cities = new Array<registrationCitiesData>();

  //matchips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  
  filteredTypeOfEstablishments!: Observable<String[]>;
  typeOfEstablishment: typeOfEstablishment[] = [];
  allTypeOfEstablishments: typeOfEstablishment[] = [];
  typeOfEstablishmentCtrl =  new FormControl('',Validators.required);
  private allowFreeTextAddTypeOfEst = false;
  roleId: any;

  @ViewChild('typeOfEstablishmentInput') typeOfEstablishmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  countryList = new Array<countries>();
  statesList = new Array<registrationStatesData>();
  citiesList = new Array<registrationCitiesData>();

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
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      yearOfEstablishment: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      typeOfEstablishmentCtrl: [this.typeOfEstablishment,Validators.required],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
    this.personalDetails = this._formBuilder.group({
      contactFirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactDesignation: ['', Validators.required],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailAddress: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    });
     this.getMasterdata();
     //mtachips
    this.filteredTypeOfEstablishments = this.typeOfEstablishmentCtrl.valueChanges.pipe(
      startWith(null),
      map(typeOfEstb => this.filterOnValueChange(typeOfEstb))
    );
  }

  getMasterdata() {
    this.ApiServicesService.getRegistrationMasterData().subscribe((data: registrationMasterData) => {
      this.allTypeOfEstablishments = data.typeOfEstablishments;
      this.countries = data.countries;
      this.countryList = this.countries.slice();
      this.applicationRoles = data.applicationRoles.filter(item => item.displayToAll === true);
    });
  }
  onCountrySelectEvent(id: any) {
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
  onRegisterValueChange(){
    debugger;
    const registerValueSelected = this.companyDetails.get('users')?.value
    debugger;
    if(registerValueSelected !== 2){
      this.companyDetails.get('typeOfEstablishmentCtrl')?.disable()           
  } else {                
      this.companyDetails.get('typeOfEstablishmentCtrl')?.enable();               
  }
  }

  add(event: MatChipInputEvent): void {
    // Clear the input value
    if (!this.allowFreeTextAddTypeOfEst) {
      // only allowed to select from the filtered autocomplete list
     // console.log('allowFreeTextAddTypeOfEst is false');
      return;
    }
    // Only add when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (this.matAutocomplete.isOpen) {
      return;
    }

    // Add TYPE OF ESTAB
    const value = event.value;
    if ((value || '').trim()) {
      this.selectTypeOfEstByName(value.trim());
    }

    this.resetInputs();
  }

  remove(typeOfEstab: typeOfEstablishment): void {
    const index = this.typeOfEstablishment.indexOf(typeOfEstab);
    if (index >= 0) {
      this.typeOfEstablishment.splice(index, 1);
      this.resetInputs();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectTypeOfEstByName(event.option.value);
    this.resetInputs();
  }
  private resetInputs() {
    // clear input element
    this.typeOfEstablishmentInput.nativeElement.value = '';
    // clear control value and trigger typeOfEstablishmentCtrl.valueChanges event 
    this.typeOfEstablishmentCtrl.setValue(null);
  }

  // Compute a new autocomplete list each time control value changes
  private filterOnValueChange(establishmentDescription: string | null): String[] {
    let result: String[] = [];
    // Remove the typeOfEstab we have already selected from all typeOfEstab to
    // get a starting point for the autocomplete list.
    let alltypeOfEstLessSelected = this.allTypeOfEstablishments.filter(toe => this.typeOfEstablishment.indexOf(toe) < 0);
    if (establishmentDescription) {
      result = this.filterTypeOfEstablish(alltypeOfEstLessSelected, establishmentDescription);
    } else {
      result = alltypeOfEstLessSelected.map(type => type.establishmentDescription);
    }
    return result;
  }

  private filterTypeOfEstablish(typeOfEstabList: typeOfEstablishment[], establishmentDescription: String): String[] {
    let filteredtypeOfEstablishmentList: typeOfEstablishment[] = [];
    const filterValue = establishmentDescription.toLowerCase();
    let typeOfEstablishmentMatchingName = typeOfEstabList.filter(val => val.establishmentDescription.toLowerCase().indexOf(filterValue) === 0);
    if (typeOfEstablishmentMatchingName.length || this.allowFreeTextAddTypeOfEst) {
      //
      // either the TypeOfEstablish name matched some autocomplete options 
      // or the name didn't match but we're allowing 
      // non-autocomplete TypeOfEstablish names to be entered
      //
      filteredtypeOfEstablishmentList = typeOfEstablishmentMatchingName;
    } else {
      //
      // the TypeOfEstablish name didn't match the autocomplete list 
      // and we're only allowing TypeOfEstablish to be selected from the list
      // so we show the whole list
      // 
      filteredtypeOfEstablishmentList = typeOfEstabList;
    }
    //
    // Convert filtered list of TypeOfEstablish objects to list of TypeOfEstablish 
    // name strings and return it
    //
    return filteredtypeOfEstablishmentList.map(data => data.establishmentDescription);
  }
  private selectTypeOfEstByName(establishmentDescription: string) {
    let foundTypeOfEstablish = this.allTypeOfEstablishments.filter(value => value.establishmentDescription == establishmentDescription);
    if (foundTypeOfEstablish.length) {
      // We found the TypeOfEstablish name in the allTypeOfEstablishments list
      this.typeOfEstablishment.push(foundTypeOfEstablish[0]);
    } else {
      // Create a new TypeOfEstablishments
      // This is the use case when allowFreeTextAddTypeOfEst is true
      this.typeOfEstablishment.push({
        establishmentDescription: establishmentDescription,
        changeTracking: {
          createdBy: '',
          createdDate: 0,
          modifiedBy: '',
          modifiedDate: 0
        },
        active: false,
        createdBy: '',
        createdDate: 0,
        modifiedBy: '',
        modifiedDate: 0
      });
    }
  }
  onSubmit() {
    this.companyDetails.controls['typeOfEstablishmentCtrl'].setValue(this.typeOfEstablishment.map(item => item.establishmentDescription));
    console.log('cntrl',this.typeOfEstablishmentCtrl);
    if (this.companyDetails.valid && this.personalDetails.valid) {
      const registrationObject = Object.assign({}, this.companyDetails.value, this.personalDetails.value);
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
          console.log(error);
         // this.toastr.error(error);
        })
      )
    }
    else {
      console.log('Registration Form is invalid');
    }

  }
}


