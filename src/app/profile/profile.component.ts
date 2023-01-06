import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
  typeOfEstablishments: any[] = [];
  allTypeOfEstablishments: string[] = [];
  filteredTypeOfEstablishments!: Observable<string[]>;
  @ViewChild('typeOfEstablishmentInput') typeOfEstablishmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  typeOfEstablishmentCtrl = new FormControl();

  countryList = new Array<countries>();
  statesList = new Array<registrationStatesData>();
  citiesList = new Array<registrationCitiesData>();
  userId: any;
  countryIsoCode: any;
  stateIsoCode: any;
  userData!: any;

  constructor(private toastr: ToastrService, private readonly keycloak: KeycloakService,
    private ApiServicesService: ApiServicesService, private router: Router,
    private _formBuilder: FormBuilder, private route: ActivatedRoute,) { }

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
      typeOfEstablishment: [''],
      yearOfEstablishment: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      address: ['', Validators.required],
      countryIsoCode: ['', Validators.required],
      stateIsoCode: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
    });

    this.getUserProfileData();
    this.getMasterdata();
    this.enableForm(false);
    this.filteredTypeOfEstablishments = this.typeOfEstablishmentCtrl.valueChanges.pipe(
      startWith(''),
      map((te: string | null) => te ? this._filter(te) : this.allTypeOfEstablishments.slice()));
  }
  _filter(value: any): any[] {
    const string = this.allTypeOfEstablishments.filter(te => te.toLowerCase().includes(value.toLowerCase()));
    return string;
  }
  getUserProfileData() {
    this.ApiServicesService.getUserProfile().subscribe((data: any) => {
      this.userData = data;
      this.editUserForm.get('contactFirstName')?.patchValue(data.contactFirstName);
      this.editUserForm.get('contactLastName')?.patchValue(data.contactLastName);
      this.editUserForm.get('contactDesignation')?.patchValue(data.contactDesignation);
      this.editUserForm.get('contactPhoneNumber')?.patchValue(data.contactPhoneNumber);
      this.editUserForm.get('contactEmailAddress')?.patchValue(data.contactEmailAddress);
      this.editUserForm.get('companyName')?.patchValue(data.companyName);
      this.typeOfEstablishments = data.typeOfEstablishment;
      this.editUserForm.get('typeOfEstablishment')?.patchValue(data.typeOfEstablishment);
      this.editUserForm.get('yearOfEstablishment')?.patchValue(data.yearOfEstablishment);
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
  //mat-chips
  selected(event: MatAutocompleteSelectedEvent): void {
    this.typeOfEstablishments.push(event.option.viewValue);
    this.typeOfEstablishmentInput.nativeElement.value = '';
    this.typeOfEstablishmentCtrl.setValue(null);
  }

  remove(chip: any): void {
    const index = this.typeOfEstablishments.indexOf(chip);
    if (index >= 0) {
      this.typeOfEstablishments.splice(index, 1);
    }
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
    this.editUserForm.reset({
      contactFirstName: this.userData?.contactFirstName,
      contactLastName: this.userData?.contactLastName,
      contactDesignation: this.userData?.contactDesignation,
      contactPhoneNumber: this.userData?.contactPhoneNumber,
      contactEmailAddress: this.userData?.contactEmailAddress,
      companyName: this.userData?.companyName,
      typeOfEstablishment: this.userData?.typeOfEstablishment,
      yearOfEstablishment: this.userData?.yearOfEstablishment,
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
      this.allTypeOfEstablishments = data.typeOfEstablishments.map(establishment => establishment.establishmentDescription);
      //this.filteredTypeOfEstablishments = data.typeOfEstablishments.map(establishment => establishment.establishmentDescription);
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
    this.editUserForm.controls['typeOfEstablishment'].setValue(this.typeOfEstablishments);
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
