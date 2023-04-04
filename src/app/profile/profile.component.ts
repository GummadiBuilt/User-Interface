import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize, map, of, startWith, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiServicesService } from '../shared/api-services.service';
import { PageConstants } from '../shared/application.constants';
import { countries, registrationCitiesData, registrationMasterData, registrationStatesData, typeOfEstablishment } from '../shared/responses';
import { userProfileResopnse } from './userProfileResponse';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import moment from 'moment';
import { TypeOfEstablishment } from '../signup/type-of-establishment';
import { ComponentCanDeactivate } from '../shared/can-deactivate/deactivate.guard';

const moment1 = _rollupMoment || _moment;
export const MY_FORMATS1 = {
  parse: {
    dateInput: 'YYYY'
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS1 },
  ],
})
export class ProfileComponent implements OnInit, ComponentCanDeactivate {
  userRole: any;
  photoUrl!: string;
  public initials!: string;
  name: any;
  public constantVariables = PageConstants;
  updatePwdUrl: string = environment.updatePwdUrl;
  //update user profile
  public editUserForm!: FormGroup;
  //disable update button
  isDisabled!: boolean;

  countries = new Array<countries>();
  states = new Array<registrationStatesData>();
  cities = new Array<registrationCitiesData>();

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
  userId: any;
  countryIsoCode: any;
  stateIsoCode: any;
  userData!: any;

  constructor(private toastr: ToastrService, private readonly keycloak: KeycloakService,
    private ApiServicesService: ApiServicesService, private router: Router,
    private _formBuilder: FormBuilder, private route: ActivatedRoute, private datePipe: DatePipe,) { }

  ngOnInit() {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }

    this.editUserForm = this._formBuilder.group({
      contactFirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactDesignation: ['', Validators.required],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailAddress: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      typeOfEstablishmentInput: [null],
      typeOfEstablishment: [this.typeOfEstablishments, this.validateToe],
      yearOfEstablishment: new FormControl(moment1(), [Validators.required]),
      address: ['', Validators.required],
      countryIsoCode: ['', Validators.required],
      stateIsoCode: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
    });

    this.getUserProfileData();
    this.getMasterdata();
    this.enableForm(false);
    this.filteredTypeOfEstablishments = this.editUserForm.get("typeOfEstablishmentInput")?.valueChanges.pipe(
      startWith(""),
      map(value => this.typeOfEstablishmentFilter(value))
    );
  }

  canDeactivate(): boolean {
    return this.editUserForm.dirty;
  }

  private typeOfEstablishmentFilter(value: any): TypeOfEstablishment[] {
    const filterValue =
      value === null || value instanceof Object ? "" : value.toLowerCase();
    const matches = this.allTypeOfEstablishments.filter(typeOfEstablishment =>
      typeOfEstablishment.establishmentDescription.toLowerCase().includes(filterValue)
    );
    const formValue = this.editUserForm.get("typeOfEstablishment")?.value;
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
      this.editUserForm.get("typeOfEstablishment")?.setValue(this.typeOfEstablishments);
      this.editUserForm.get("typeOfEstablishmentInput")?.setValue("");
    }
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value.trim()) {
      const matches = this.allTypeOfEstablishments.filter(
        typeOfEstablishment => typeOfEstablishment.establishmentDescription.toLowerCase() === value
      );
      const formValue = this.editUserForm.get("typeOfEstablishment")?.value;
      const matchesNotYetSelected =
        formValue === null
          ? matches
          : matches.filter(x => !formValue.find((y: any) => y.establishmentDescription === x.establishmentDescription));
      if (matchesNotYetSelected.length === 1) {
        this.typeOfEstablishments?.push(matchesNotYetSelected[0]);
        this.editUserForm.get("typeOfEstablishment")?.setValue(this.typeOfEstablishments);
        this.editUserForm.get("typeOfEstablishmentInput")?.setValue("");
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
      this.editUserForm.get("typeOfEstablishment")?.setValue(this.typeOfEstablishments);
      this.editUserForm.get("typeOfEstablishmentInput")?.setValue("");
    }
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.editUserForm.controls['yearOfEstablishment'].value;
    if (ctrlValue) {
      const dateTran = moment(normalizedYear).format('YYYY');
      this.editUserForm.get('yearOfEstablishment')?.setValue(dateTran);
    }
    datepicker.close();
  }
  getUserProfileData() {
    this.ApiServicesService.getUserProfile().subscribe((data: any) => {
      this.userData = data;
      console.log(this.userData);
      this.editUserForm.get('contactFirstName')?.patchValue(data.contactFirstName);
      this.editUserForm.get('contactLastName')?.patchValue(data.contactLastName);
      this.editUserForm.get('contactDesignation')?.patchValue(data.contactDesignation);
      this.editUserForm.get('contactPhoneNumber')?.patchValue(data.contactPhoneNumber);
      this.editUserForm.get('contactEmailAddress')?.patchValue(data.contactEmailAddress);
      this.editUserForm.get('companyName')?.patchValue(data.companyName);
      this.typeOfEstablishments = data.typeOfEstablishment?.map((item: any) => {
        const header = 'establishmentDescription';
        const value = item;
        return {
          [header]: value
        };
      });
      this.editUserForm.get('typeOfEstablishment')?.patchValue(this.typeOfEstablishments);
      const dateString = data.yearOfEstablishment;
      const momentVariable = moment(dateString, 'YYYY');
      this.editUserForm.get('yearOfEstablishment')?.patchValue(momentVariable);
      this.editUserForm.get('address')?.patchValue(data.address);
      this.editUserForm.get('countryIsoCode')?.patchValue(data.country.countryIsoCode);
      this.onCountrySelectEvent(data.country.countryIsoCode);
      this.onStateSelectEvent(data.state.stateIsoCode);
      this.editUserForm.get('stateIsoCode')?.patchValue(data.state.stateIsoCode);
      this.editUserForm.get('cityId')?.patchValue(data.city.id);
      //generate profile photo with initials
      const shortName = this.userData?.contactFirstName.substring(0, 1) + this.userData?.contactLastName.substring(0, 1);
      this.initials = shortName;
    });
  }

  //disable form on page load and enable on button click
  enableForm(enable: boolean) {
    if (enable) {
      this.editUserForm.enable();
      this.isDisabled = false;
    } else {
      this.editUserForm.disable();
      this.isDisabled = true;
    }
  }
  //reset form
  reset() {
    this.typeOfEstablishments = this.userData.typeOfEstablishment?.map((item: any) => {
      const header = 'establishmentDescription';
      const value = item;
      return {
        [header]: value
      };
    });
    this.editUserForm.reset({
      contactFirstName: this.userData?.contactFirstName,
      contactLastName: this.userData?.contactLastName,
      contactDesignation: this.userData?.contactDesignation,
      contactPhoneNumber: this.userData?.contactPhoneNumber,
      contactEmailAddress: this.userData?.contactEmailAddress,
      companyName: this.userData?.companyName,
      typeOfEstablishment: this.typeOfEstablishments,
      yearOfEstablishment: moment(this.userData?.yearOfEstablishment, 'YYYY'),
      address: this.userData?.address,
      countryIsoCode: this.userData?.country?.countryIsoCode,
      stateIsoCode: this.userData?.state?.stateIsoCode,
      cityId: this.userData?.city?.id,
    });
    this.onCountrySelectEvent(this.userData?.country?.countryIsoCode);
    this.onStateSelectEvent(this.userData?.state?.stateIsoCode);
    this.enableForm(false);
  }

  getMasterdata() {
    this.ApiServicesService.getRegistrationMasterData().subscribe((data: registrationMasterData) => {
      this.allTypeOfEstablishments = data.typeOfEstablishments;
      this.countries = data.countries;
      this.countryList = this.countries.slice();
    });
  }

  onCountrySelectEvent(countryIsoCode: any) {
    this.ApiServicesService.getRegistrationStatesData(countryIsoCode).subscribe((data: registrationStatesData[]) => {
      this.states = data;
      this.statesList = this.states.slice();
    });
  }
  onStateSelectEvent(stateIsoCode: any) {
    this.ApiServicesService.getRegistrationCitiesData(stateIsoCode).subscribe((data: registrationCitiesData[]) => {
      this.cities = data;
      this.citiesList = this.cities.slice();
    });
  }

  update() {
    if (this.editUserForm.value.yearOfEstablishment) {
      const dateTran = moment(this.editUserForm.value.yearOfEstablishment).format('YYYY');
      this.editUserForm.controls['yearOfEstablishment'].setValue(dateTran)
    } else {
      this.toastr.error('Please Select Valid Year of Establishment');
    }
    // this.editUserForm.controls['typeOfEstablishment'].setValue(this.typeOfEstablishments);
    this.editUserForm.controls['typeOfEstablishment'].setValue(this.typeOfEstablishments?.map(item => item.establishmentDescription));
    if (this.editUserForm.valid) {
      this.ApiServicesService.updateUserProfile(this.editUserForm.value).subscribe({
        next: ((response: userProfileResopnse) => {
          this.toastr.success('Successfully Updated');
          this.enableForm(false);
        }),
        error: (error => {
          console.log(error);
        })
      })
    } else {
      console.log('error');
    }
  }
}
