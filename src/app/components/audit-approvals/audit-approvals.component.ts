import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { registrationAuditResopnse } from '../commonservices/auditUserData';

@Component({
  selector: 'app-audit-approvals',
  templateUrl: './audit-approvals.component.html',
  styleUrls: ['./audit-approvals.component.scss']
})
export class AuditApprovalsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'companyName',
    'yearOfEstablishment', 'typeOfEstablishment', 'address', 'city', 'state', 'country', 'contactName', 'contactDesignation',
    'contactPhoneNumber', 'contactEmailAddress', 'coordinatorName', 'coordinatorMobileNumber'];

  dataSource = new MatTableDataSource<registrationAuditResopnse>();
  allAuditApprovals: any = [];

  idFilter = new FormControl();
  firstNameFilter = new FormControl();
  lastNameFilter = new FormControl();
  emailFilter = new FormControl();
  companyNameFilter = new FormControl();
  yearOfEstablishmentFilter = new FormControl();
  typeOfEstablishmentFilter = new FormControl();
  addressFilter = new FormControl();
  cityFilter = new FormControl();
  stateFilter = new FormControl();
  countryFilter = new FormControl();
  contactNameFilter = new FormControl();
  contactDesignationFilter = new FormControl();
  contactPhoneFilter = new FormControl();
  contactEmailAddressFilter = new FormControl();
  coordinatorNameFilter = new FormControl();
  coordinatorPhoneFilter = new FormControl();

  filteredValues = {
    id: '', firstName: '', lastName: '', email: '', companyName: '',
    yearOfEstablishment: '', typeOfEstablishment: '', address: '', city: '', state: '', country: '',
    contactName: '', contactDesignation: '', contactPhoneNumber: '', contactEmailAddress: '', coordinatorName: '', coordinatorMobileNumber: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ApiServicesService: ApiServicesService) {
  }

  ngOnInit(): void {
    this.firstNameFilter.valueChanges.subscribe((firstNameFilterValue) => {
      this.filteredValues['firstName'] = firstNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.lastNameFilter.valueChanges.subscribe((lastNameFilterValue) => {
      this.filteredValues['lastName'] = lastNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.emailFilter.valueChanges.subscribe((emailFilterValue) => {
      this.filteredValues['email'] = emailFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.companyNameFilter.valueChanges.subscribe((companyNameFilterValue) => {
      this.filteredValues['companyName'] = companyNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.yearOfEstablishmentFilter.valueChanges.subscribe((yearOfEstablishmentFilterValue) => {
      this.filteredValues['yearOfEstablishment'] = yearOfEstablishmentFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.typeOfEstablishmentFilter.valueChanges.subscribe((typeOfEstablishmentFilterValue) => {
      this.filteredValues['typeOfEstablishment'] = typeOfEstablishmentFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.addressFilter.valueChanges.subscribe((addressFilterValue) => {
      this.filteredValues['address'] = addressFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.cityFilter.valueChanges.subscribe((cityFilterValue) => {
      this.filteredValues['city'] = cityFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.stateFilter.valueChanges.subscribe((stateFilterValue) => {
      this.filteredValues['state'] = stateFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.countryFilter.valueChanges.subscribe((countryFilterValue) => {
      this.filteredValues['country'] = countryFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.contactNameFilter.valueChanges.subscribe((contactNameFilterValue) => {
      this.filteredValues['contactName'] = contactNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.contactDesignationFilter.valueChanges.subscribe((contactDesignationFilterValue) => {
      this.filteredValues['contactDesignation'] = contactDesignationFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.contactPhoneFilter.valueChanges.subscribe((contactPhoneFilterValue) => {
      this.filteredValues['contactPhoneNumber'] = contactPhoneFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.contactEmailAddressFilter.valueChanges.subscribe((contactEmailAddressFilterValue) => {
      this.filteredValues['contactEmailAddress'] = contactEmailAddressFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.coordinatorNameFilter.valueChanges.subscribe((coordinatorNameFilterValue) => {
      this.filteredValues['coordinatorName'] = coordinatorNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.coordinatorPhoneFilter.valueChanges.subscribe((coordinatorPhoneFilterValue) => {
      this.filteredValues['coordinatorMobileNumber'] = coordinatorPhoneFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.getAuditApprovalsdata();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: registrationAuditResopnse, filter: string): boolean {
      const city = Object.values(data.city)[1].toString();
      const state = Object.values(data.state)[1].toString();
      const country = Object.values(data.country)[1].toString();
      let searchString = JSON.parse(filter);
      let firstNameFound = data.firstName.toString().trim().toLowerCase().indexOf(searchString.firstName.toLowerCase()) !== -1
      let lastNameFound = data.lastName.toString().trim().toLowerCase().indexOf(searchString.lastName.toLowerCase()) !== -1
      let emailFound = data.email.toString().trim().toLowerCase().indexOf(searchString.email.toLowerCase()) !== -1
      let companyNameFound = data.companyName.toString().trim().toLowerCase().indexOf(searchString.companyName.toLowerCase()) !== -1
      let yearOfEstablishmentFound = data.yearOfEstablishment.toString().trim().toLowerCase().indexOf(searchString.yearOfEstablishment.toLowerCase()) !== -1
      let typeOfEstablishmentFound = data.typeOfEstablishment.toString().trim().toLowerCase().indexOf(searchString.typeOfEstablishment.toLowerCase()) !== -1
      let addressFound = data.address.toString().trim().toLowerCase().indexOf(searchString.address.toLowerCase()) !== -1
      let cityFound = city.toString().trim().toLowerCase().indexOf(searchString.city.toLowerCase()) !== -1
      let stateFound = state.toString().trim().toLowerCase().indexOf(searchString.state.toLowerCase()) !== -1
      let countryFound = country.toString().trim().toLowerCase().indexOf(searchString.country.toLowerCase()) !== -1

      let contactNameFound = data.contactName.toString().trim().toLowerCase().indexOf(searchString.contactName.toLowerCase()) !== -1
      let contactDesignationFound = data.contactDesignation.toString().trim().toLowerCase().indexOf(searchString.contactDesignation.toLowerCase()) !== -1
      let contactPhoneFound = data.contactPhoneNumber.toString().trim().toLowerCase().indexOf(searchString.contactPhoneNumber.toLowerCase()) !== -1
      let contactEmailAddressFound = data.contactEmailAddress.toString().trim().toLowerCase().indexOf(searchString.contactEmailAddress.toLowerCase()) !== -1

      let coordinatorNameFound = data.coordinatorName.toString().trim().toLowerCase().indexOf(searchString.coordinatorName.toLowerCase()) !== -1
      let coordinatorPhoneFound = data.coordinatorMobileNumber.toString().trim().toLowerCase().indexOf(searchString.coordinatorMobileNumber.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return firstNameFound || lastNameFound || emailFound || companyNameFound || yearOfEstablishmentFound ||
          typeOfEstablishmentFound || addressFound || cityFound || stateFound || countryFound ||
          contactNameFound || contactDesignationFound || contactPhoneFound || contactEmailAddressFound
          || coordinatorNameFound || coordinatorPhoneFound
      } else {
        return firstNameFound && lastNameFound && emailFound && companyNameFound && yearOfEstablishmentFound &&
          typeOfEstablishmentFound && addressFound && cityFound && stateFound && countryFound &&
          contactNameFound && contactDesignationFound && contactPhoneFound && contactEmailAddressFound && coordinatorNameFound && coordinatorPhoneFound
      }
    }
    return myFilterPredicate;
  }

  //get list of data
  getAuditApprovalsdata() {
    this.ApiServicesService.getRegistrationAuditApproval().subscribe((data: registrationAuditResopnse) => {
      this.allAuditApprovals = data;
      this.dataSource.data = this.allAuditApprovals;
      console.log(this.dataSource.data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  clearFilters() {
    this.dataSource.filter = '';
  }
}