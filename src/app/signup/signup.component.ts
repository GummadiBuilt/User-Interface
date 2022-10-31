import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApiServicesService } from '../shared/api-services.service';
import { registrationMasterData, registrationStatesData, registrationCitiesData, applicationRoles } from '../shared/responses';
import { typeOfEstablishment } from '../shared/responses';
import { countries } from '../shared/responses';
import { StatementVisitor } from '@angular/compiler';
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
  filteredTypeOfEstablishments: Observable<string[]>;
  typeOfEstablishments: string[] = [];
  allTypeOfEstablishments: string[] = [];

  @ViewChild('typeOfEstablishmentInput') typeOfEstablishmentInput!: ElementRef<HTMLInputElement>;

  countryList = new Array<countries>();;
  statesList = new Array<registrationStatesData>();
  citiesList = new Array<registrationCitiesData>();

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
  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService) {
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
      company_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      year_of_establishment: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      typeOfEstablishments: ['', Validators.required],
      addressGroup: this._formBuilder.group({
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),
    });
    this.personalDetails = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      designation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
    this.projectDetails = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
    });
    this.getMasterdata();
  }
  getMasterdata() {
    this.ApiServicesService.getRegistrationMasterData().subscribe((data: registrationMasterData) => {
      this.typeOfEstablishmentList = data.typeOfEstablishments;
      this.allTypeOfEstablishments = this.typeOfEstablishmentList.map(item => item.establishmentDescription);
      this.countries = data.countries;
      this.countryList = this.countries.slice();
      this.applicationRoles = data.applicationRoles.filter(item=>item.displayToAll===true);
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
    // debugger;
    console.log(value);

    this.ApiServicesService.getRegistrationCitiesData(value.stateIsoCode).subscribe((data: registrationCitiesData[]) => {
      this.cities = data;
      this.citiesList = this.cities.slice();
    });
  }

}
