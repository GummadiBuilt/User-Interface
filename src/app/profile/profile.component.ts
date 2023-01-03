import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiServicesService } from '../shared/api-services.service';
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
  public showInitials = false;
  public initials!: string;
  name: any;
  public circleColor!: string;
  private colors = [
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];
  updatePwdUrl: string = environment.updatePwdUrl;
  //update user profile
  public editUserForm!: FormGroup;
  //disable update button
  isDisabled!: boolean;

  countries = new Array<countries>();
  states = new Array<registrationStatesData>();
  cities = new Array<registrationCitiesData>();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredTypeOfEstablishments!: Observable<String[]>;
  typeOfEstablishment: any[] = [];
  allTypeOfEstablishments: typeOfEstablishment[] = [];


  @ViewChild('typeOfEstablishmentInput') typeOfEstablishmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  countryList = new Array<countries>();
  statesList = new Array<registrationStatesData>();
  citiesList = new Array<registrationCitiesData>();
  userId: any;
  countryIsoCode: any;
  stateIsoCode: any;
  userData!: any;
  typeOfEstablishmentCtrl = new FormControl('', Validators.required);
  private allowFreeTextAddTypeOfEst = false;

  constructor(private toastr: ToastrService, private readonly keycloak: KeycloakService,
    private ApiServicesService: ApiServicesService, private router: Router,
    private _formBuilder: FormBuilder, private route: ActivatedRoute,) {

    ApiServicesService.apiProfileData$.subscribe(data => {
      // console.log('local storage', data);
      let currentUser = localStorage.getItem("currentUser");
      this.userData = JSON.parse(currentUser || '{}');
      // this.userData = data;
      console.log(this.userData);
    });

    if (this.userData?.typeOfEstablishment) {
      this.typeOfEstablishment = this.userData?.typeOfEstablishment;
      console.log(this.typeOfEstablishment);
    }
    this.ApiServicesService.getRegistrationStatesData(this.userData?.country?.countryIsoCode).subscribe((data: registrationStatesData[]) => {
      this.states = data;
      this.statesList = this.states.slice();
    });
    this.ApiServicesService.getRegistrationCitiesData(this.userData?.state?.stateIsoCode).subscribe((data: registrationCitiesData[]) => {
      this.cities = data;
      this.citiesList = this.cities.slice();
    });
  }

  ngOnInit() {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }

    this.editUserForm = this._formBuilder.group({
      contactFirstName: [this.userData?.contactFirstName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactLastName: [this.userData?.contactLastName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactDesignation: [this.userData?.contactDesignation, Validators.required],
      contactPhoneNumber: [this.userData?.contactPhoneNumber, [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailAddress: [this.userData?.contactEmailAddress, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      companyName: [this.userData?.companyName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      typeOfEstablishment: [this.typeOfEstablishment],
      yearOfEstablishment: [this.userData?.yearOfEstablishment, [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      address: [this.userData?.address, Validators.required],
      countryIsoCode: [this.userData?.country?.countryIsoCode, Validators.required],
      stateIsoCode: [this.userData?.state?.stateIsoCode, [Validators.required]],
      cityId: [this.userData?.city?.id, [Validators.required]],
    });

    this.getUserProfileData();

    if (!this.photoUrl) {
      this.showInitials = true;
      const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
      this.circleColor = this.colors[randomIndex];
    }

    this.getMasterdata();

    this.filteredTypeOfEstablishments = this.typeOfEstablishmentCtrl.valueChanges.pipe(
      startWith(null),
      map(typeOfEstb => this.filterOnValueChange(typeOfEstb))
    );

    this.enableForm(this.editUserForm, false);
  }
  //disable form on page load and enable on button click
  enableForm(group: FormGroup, enable: boolean) {
    for (const i in group.controls) {
      if (enable) {
        group.controls[i].enable();
        this.isDisabled = false;
      } else {
        group.controls[i].disable();
        this.isDisabled = true;
      }
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
    this.ApiServicesService.getRegistrationStatesData(this.userData?.country?.countryIsoCode).subscribe((data: registrationStatesData[]) => {
      this.states = data;
      this.statesList = this.states.slice();
    });
    this.ApiServicesService.getRegistrationCitiesData(this.userData?.state?.stateIsoCode).subscribe((data: registrationCitiesData[]) => {
      this.cities = data;
      this.citiesList = this.cities.slice();
    });
    this.enableForm(this.editUserForm, false);
  }

  getMasterdata() {
    this.ApiServicesService.getRegistrationMasterData().subscribe((data: registrationMasterData) => {
      this.allTypeOfEstablishments = data.typeOfEstablishments;
      console.log(this.allTypeOfEstablishments);
      this.countries = data.countries;
      this.countryList = this.countries.slice();
    });
  }

  getUserProfileData() {
    this.ApiServicesService.getUserProfile().subscribe((data: userProfileResopnse) => {
      this.userData = data;
      // console.log(this.userData);
      // set data in service which is to be shared
      this.ApiServicesService.setUserProfileData(data);

      //generate profile photo with initials
      let initials = "";
      this.name = this.userData?.contactFirstName + " " + this.userData?.contactLastName;
      for (let i = 0; i < this.name.length; i++) {
        if (this.name.charAt(i) === ' ') {
          continue;
        }
        if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
          initials += this.name.charAt(i);

          if (initials.length == 2) {
            break;
          }
        }
      }
      this.initials = initials;
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

  add(event: MatChipInputEvent): void {
    if (!this.allowFreeTextAddTypeOfEst) {
      return;
    }
    if (this.matAutocomplete.isOpen) {
      return;
    }
    const value = event.value;
    if ((value || '').trim()) {
      // this.selectTypeOfEstByName(value.trim());
      this.typeOfEstablishment.push(value.trim());
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
    // this.selectTypeOfEstByName(event.option.value);
    this.typeOfEstablishment.push(event.option.value);
    console.log(this.typeOfEstablishment);
    this.typeOfEstablishmentCtrl.setValue(null);
  }
  private resetInputs() {
    this.typeOfEstablishmentInput.nativeElement.value = '';
    this.typeOfEstablishmentCtrl.setValue(null);
  }

  // Compute a new autocomplete list each time control value changes
  private filterOnValueChange(establishmentDescription: string | null): String[] {
    let result: String[] = [];
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
      filteredtypeOfEstablishmentList = typeOfEstablishmentMatchingName;
    } else {
      filteredtypeOfEstablishmentList = typeOfEstabList;
    }
    return filteredtypeOfEstablishmentList.map(data => data.establishmentDescription);
  }
  // private selectTypeOfEstByName(establishmentDescription: string) {
  //   let foundTypeOfEstablish = this.allTypeOfEstablishments.filter(value => value.establishmentDescription == establishmentDescription);
  //   if (foundTypeOfEstablish.length) {
  //     this.typeOfEstablishment.push(foundTypeOfEstablish[0]);
  //   } else {
  //     this.typeOfEstablishment.push({
  //       establishmentDescription: establishmentDescription,
  //       changeTracking: {
  //         createdBy: '',
  //         createdDate: 0,
  //         modifiedBy: '',
  //         modifiedDate: 0
  //       },
  //       active: false,
  //       createdBy: '',
  //       createdDate: 0,
  //       modifiedBy: '',
  //       modifiedDate: 0
  //     });
  //   }
  // }

  update() {
    if (this.editUserForm.valid) {
      console.log('update', this.editUserForm.value);
      this.ApiServicesService.updateUserProfile(this.editUserForm.value).subscribe({
        next: ((response: userProfileResopnse) => {
          // console.log('update', response);
          this.ApiServicesService.setUserProfileData(response);
          this.toastr.success('Successfully Updated');
          this.enableForm(this.editUserForm, false);
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
