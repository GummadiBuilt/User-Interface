import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApiServicesService } from '../shared/api-services.service';
import { registrationMasterData, registrationStatesData, registrationCitiesData, applicationRoles } from '../shared/responses';
import { typeOfEstablishment } from '../shared/responses';
import { countries } from '../shared/responses';
import { userRegistrationResopnse } from './signResponses';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PageConstants } from '../shared/application.constants';
import { TypeOfEstablishment } from './type-of-establishment';
import { ComponentCanDeactivate } from '../shared/can-deactivate/deactivate.guard';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ],
})
export class SignupComponent implements OnInit, ComponentCanDeactivate {
  companyDetails!: FormGroup;
  personalDetails!: FormGroup;
  //projectDetails!: FormGroup;
  countries = new Array<countries>();
  applicationRoles = new Array<applicationRoles>();
  states = new Array<registrationStatesData>();
  cities = new Array<registrationCitiesData>();
  public constantVariable = PageConstants;
  roleId: any;
  userType: any;

  //matchips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTypeOfEstablishments: any;
  allTypeOfEstablishments: typeOfEstablishment[] = [];
  typeOfEstablishments: any[] = [];
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  @ViewChild("chipList") chipList!: MatChipList;

  countryList = new Array<countries>();
  statesList = new Array<registrationStatesData>();
  citiesList = new Array<registrationCitiesData>();

  stepperOrientation!: Observable<StepperOrientation>;
  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    //Set default value on drop down when redirect from read more page
    this.route.paramMap.subscribe(params => {
      this.userType = params.get('userType');
      this.roleId = parseInt(this.userType);
    });
  }

  ngOnInit(): void {
    this.companyDetails = this._formBuilder.group({
      users: ['', Validators.required],
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      yearOfEstablishment: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      typeOfEstablishmentInput: [null],
      typeOfEstablishmentCtrl: [this.typeOfEstablishments, this.validateToe]
    });
    this.personalDetails = this._formBuilder.group({
      contactFirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactDesignation: ['', Validators.required],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailAddress: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
    });

    window.setTimeout(() => {
      this.companyDetails.get('users')?.patchValue(this.roleId);
    }, 500)

    this.getMasterdata();

    this.filteredTypeOfEstablishments = this.companyDetails.get("typeOfEstablishmentInput")?.valueChanges.pipe(
      startWith(""),
      map(value => this.typeOfEstablishmentFilter(value))
    );

    if (this.roleId == 2) {
      this.companyDetails.get('typeOfEstablishmentCtrl')?.enable();
      this.companyDetails.get("typeOfEstablishmentCtrl")?.statusChanges.subscribe(
        status => (this.chipList.errorState = status === "INVALID")
      );
    } else {
      window.setTimeout(() => {
        this.companyDetails.get('typeOfEstablishmentCtrl')?.disable();
      }, 500);

    }
  }
  canDeactivate(): boolean {
    if (this.companyDetails.dirty) {
      return this.companyDetails.dirty;
    } else {
      return this.personalDetails.dirty;
    }
  }
  onRegisterValueChange() {
    const registerValueSelected = this.companyDetails.get('users')?.value
    if (registerValueSelected !== 2) {
      this.companyDetails.get('typeOfEstablishmentCtrl')?.disable();
    } else {
      window.setTimeout(() => {
        this.companyDetails.get('typeOfEstablishmentCtrl')?.enable();
        this.companyDetails.get("typeOfEstablishmentCtrl")?.statusChanges.subscribe(
          status => (this.chipList.errorState = status === "INVALID")
        );
      }, 500);
    }
  }

  private typeOfEstablishmentFilter(value: any): TypeOfEstablishment[] {
    const filterValue =
      value === null || value instanceof Object ? "" : value.toLowerCase();
    const matches = this.allTypeOfEstablishments.filter(typeOfEstablishment =>
      typeOfEstablishment.establishmentDescription.toLowerCase().includes(filterValue)
    );
    const formValue = this.companyDetails.get("typeOfEstablishmentCtrl")?.value;
    return formValue === null
      ? matches
      : matches.filter(x => !formValue?.find((y: any) => y.establishmentDescription === x.establishmentDescription));
  }

  private validateToe(typeOfEstablishments: FormControl) {
    if (typeOfEstablishments.value && typeOfEstablishments.value.length === 0) {
      return {
        validateTypeOfEstablishmentsArray: { valid: false }
      };
    }
    return null;
  }

  public select(event: MatAutocompleteSelectedEvent): void {
    if (!event.option) {
      return;
    }
    const value = event.option.value;
    if (value && value instanceof Object && !this.typeOfEstablishments?.includes(value)) {
      this.typeOfEstablishments?.push(value);
      this.companyDetails.get("typeOfEstablishmentCtrl")?.setValue(this.typeOfEstablishments);
      this.companyDetails.get("typeOfEstablishmentInput")?.setValue("");
    }
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value.trim()) {
      const matches = this.allTypeOfEstablishments.filter(
        typeOfEstablishment => typeOfEstablishment.establishmentDescription.toLowerCase() === value
      );
      const formValue = this.companyDetails.get("typeOfEstablishmentCtrl")?.value;
      const matchesNotYetSelected =
        formValue === null
          ? matches
          : matches.filter(x => !formValue.find((y: any) => y.establishmentDescription === x.establishmentDescription));
      if (matchesNotYetSelected.length === 1) {
        this.typeOfEstablishments?.push(matchesNotYetSelected[0]);
        this.companyDetails.get("typeOfEstablishmentCtrl")?.setValue(this.typeOfEstablishments);
        this.companyDetails.get("typeOfEstablishmentInput")?.setValue("");
      }
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  public remove(typeOfEstablishment: TypeOfEstablishment) {
    const index = this.typeOfEstablishments?.indexOf(typeOfEstablishment)!;
    if (index >= 0) {
      this.typeOfEstablishments?.splice(index, 1);
      this.companyDetails.get("typeOfEstablishmentCtrl")?.setValue(this.typeOfEstablishments);
      this.companyDetails.get("typeOfEstablishmentInput")?.setValue("");
    }
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

  onSubmit() {
    console.log(this.companyDetails.value);
    this.companyDetails.controls['typeOfEstablishmentCtrl'].setValue(this.typeOfEstablishments.map(item => item.establishmentDescription));
    // console.log('cntrl', this.typeOfEstablishmentCtrl);
    if (this.companyDetails.valid && this.personalDetails.valid) {
      const registrationObject = Object.assign({}, this.companyDetails.value, this.personalDetails.value);
      const resultRegistrationObject = new userRegistrationResopnse(registrationObject);
      this.ApiServicesService.userRegistration(JSON.stringify(resultRegistrationObject)).subscribe(
        (response => {
          if (response['status'] == 200) {
            console.log(response);
            this.companyDetails.markAsPristine();
            this.personalDetails.markAsPristine();
            this.toastr.success('Successfully Registered, your registration is submitted to admin for approval. Once approved you will receive temporary credentials to registered email address.');
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


