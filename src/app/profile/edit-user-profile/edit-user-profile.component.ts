import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { countries, registrationCitiesData, registrationMasterData, registrationStatesData, typeOfEstablishment } from 'src/app/shared/responses';
import { ProfileComponent } from '../profile.component';
import { SharedService } from '../shared.service';
import { userProfileResopnse } from '../userProfileResponse';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {
  public userRole: string[] | undefined;
  public editUserForm!: FormGroup;

  countries = new Array<countries>();
  states = new Array<registrationStatesData>();
  cities = new Array<registrationCitiesData>();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredTypeOfEstablishments!: Observable<String[]>;
  typeOfEstablishment: typeOfEstablishment[] = [];
  allTypeOfEstablishments: typeOfEstablishment[] = [];
  typeOfEstablishmentCtrl = new FormControl('', Validators.required);
  private allowFreeTextAddTypeOfEst = false;

  @ViewChild(ProfileComponent) userData!: any;
  @ViewChild('typeOfEstablishmentInput') typeOfEstablishmentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  countryList = new Array<countries>();
  statesList = new Array<registrationStatesData>();
  citiesList = new Array<registrationCitiesData>();
  userId: any;
  countryIsoCode: any;
  stateIsoCode: any;

  constructor(private toastr: ToastrService, protected keycloak: KeycloakService,
    private _formBuilder: FormBuilder, private ApiServicesService: ApiServicesService, private route: ActivatedRoute, private sharedService: SharedService) {

  }

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }

    //Project Info (Admin)
    this.editUserForm = this._formBuilder.group({
      contactFirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactDesignation: ['', Validators.required],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailAddress: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      typeOfEstablishmentCtrl: [this.typeOfEstablishment, Validators.required],
      yearOfEstablishment: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(4), Validators.maxLength(4)]],
      address: ['', Validators.required],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', Validators.required],
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


}
