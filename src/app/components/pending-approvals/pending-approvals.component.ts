import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { registrationApprovalResopnse } from '../commonservices/approvalsUserData';

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.scss']
})
export class PendingApprovalsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select',  'companyName',
    'yearOfEstablishment', 'typeOfEstablishment', 'address', 'city', 'state', 'country', 'contactFirstName','contactLastName', 'contactDesignation',
    'contactPhoneNumber', 'contactEmailAddress', 'actions'];

  allPendingApprovals: any = [];
  dataSource = new MatTableDataSource<registrationApprovalResopnse>();

  idFilter = new FormControl();
  companyNameFilter = new FormControl();
  yearOfEstablishmentFilter = new FormControl();
  typeOfEstablishmentFilter = new FormControl();
  addressFilter = new FormControl();
  cityFilter = new FormControl();
  stateFilter = new FormControl();
  countryFilter = new FormControl();
  contactFirstNameFilter = new FormControl();
  contactLastNameFilter = new FormControl();
  contactDesignationFilter = new FormControl();
  contactPhoneFilter = new FormControl();
  contactEmailAddressFilter = new FormControl();

  filteredValues = {
    id: '', companyName: '',
    yearOfEstablishment: '', typeOfEstablishment: '', address: '', city: '', state: '', country: '',
    contactFirstName: '', contactLastName: '', contactDesignation: '', contactPhoneNumber: '', contactEmailAddress: ''
  };

  selection = new SelectionModel<registrationApprovalResopnse>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // console.log(this.selection.selected.map(({id})=>this.requestId));
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: registrationApprovalResopnse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.applicationRoleId + 1}`;
  }

  constructor(private ApiServicesService: ApiServicesService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
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
    this.contactFirstNameFilter.valueChanges.subscribe((contactFirstNameFilterValue) => {
      this.filteredValues['contactFirstName'] = contactFirstNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.contactLastNameFilter.valueChanges.subscribe((contactLastNameFilterValue) => {
      this.filteredValues['contactLastName'] = contactLastNameFilterValue;
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

    this.getPendingApprovalsdata();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: registrationApprovalResopnse, filter: string): boolean {
      const city = Object.values(data.city)[1].toString();
      const state = Object.values(data.state)[1].toString();
      const country = Object.values(data.country)[1].toString();
      let searchString = JSON.parse(filter);
      let companyNameFound = data.companyName.toString().trim().toLowerCase().indexOf(searchString.companyName.toLowerCase()) !== -1
      let yearOfEstablishmentFound = data.yearOfEstablishment.toString().trim().toLowerCase().indexOf(searchString.yearOfEstablishment.toLowerCase()) !== -1
      let typeOfEstablishmentFound = data.typeOfEstablishment.toString().trim().toLowerCase().indexOf(searchString.typeOfEstablishment.toLowerCase()) !== -1
      let addressFound = data.address.toString().trim().toLowerCase().indexOf(searchString.address.toLowerCase()) !== -1
      let cityFound = city.toString().trim().toLowerCase().indexOf(searchString.city.toLowerCase()) !== -1
      let stateFound = state.toString().trim().toLowerCase().indexOf(searchString.state.toLowerCase()) !== -1
      let countryFound = country.toString().trim().toLowerCase().indexOf(searchString.country.toLowerCase()) !== -1

      let contactFirstNameFound = data.contactFirstName.toString().trim().toLowerCase().indexOf(searchString.contactFirstName.toLowerCase()) !== -1
      let contactLastNameFound = data.contactLastName.toString().trim().toLowerCase().indexOf(searchString.contactLastName.toLowerCase()) !== -1
      let contactDesignationFound = data.contactDesignation.toString().trim().toLowerCase().indexOf(searchString.contactDesignation.toLowerCase()) !== -1
      let contactPhoneFound = data.contactPhoneNumber.toString().trim().toLowerCase().indexOf(searchString.contactPhoneNumber.toLowerCase()) !== -1
      let contactEmailAddressFound = data.contactEmailAddress.toString().trim().toLowerCase().indexOf(searchString.contactEmailAddress.toLowerCase()) !== -1

      if (searchString.topFilter) {
        return  companyNameFound || yearOfEstablishmentFound ||
          typeOfEstablishmentFound || addressFound || cityFound || stateFound || countryFound ||
          contactFirstNameFound || contactLastNameFound || contactDesignationFound || contactPhoneFound || contactEmailAddressFound
      } else {
        return companyNameFound && yearOfEstablishmentFound &&
          typeOfEstablishmentFound && addressFound && cityFound && stateFound && countryFound &&
          contactFirstNameFound && contactLastNameFound && contactDesignationFound && contactPhoneFound && contactEmailAddressFound
      }
    }
    return myFilterPredicate;
  }

  //get list of data
  getPendingApprovalsdata() {
    this.ApiServicesService.getRegistrationPendingApproval().subscribe((data: registrationApprovalResopnse) => {
      this.allPendingApprovals = data;
      this.dataSource.data = this.allPendingApprovals;
      console.log(this.dataSource.data);
    });
  }

  requestId: any;
  getApproveID(id: any) {
    this.requestId = Array.from(String(id), Number);
    // console.log(this.requestId);
    this.approve();
  }
  getRejectID(id: any) {
    this.requestId = Array.from(String(id), Number);
    // console.log(this.requestId);
    this.reject();
  }

  selectedIds: any = [];
  getAllApproveIDs(id: any) {
    this.selection.selected.forEach(item => {
      let index: any = this.dataSource.data.find(d => d == item);
      this.selectedIds.push(index.id);
    });
    // console.log(this.selectedIds)
    this.requestId = this.selectedIds;
    this.approve();
  }

  getAllRejectIDs(id: any) {
    this.selection.selected.forEach(item => {
      let index: any = this.dataSource.data.find(d => d == item);
      this.selectedIds.push(index.id);
    });
    //console.log(this.selectedIds)
    this.requestId = this.selectedIds;
    this.reject();
  }

  approve() {
    this.ApiServicesService.postRegistrationPendingApproval(this.requestId, { "requestId": this.requestId, "actionTaken": 'APPROVE' }).subscribe(
      (response => {
        if (response['status'] == 200) {
          // console.log(response.body);
          this.toastr.success('Approved');
          this.allPendingApprovals = response.body;
          this.dataSource.data = this.allPendingApprovals;
          // console.log('approve',this.dataSource.data);
        }
      }),
      (error => {
        this.toastr.error(error);
      }));
  }
  reject() {
    this.ApiServicesService.postRegistrationPendingApproval(this.requestId, { "requestId": this.requestId, "actionTaken": 'REJECT' }).subscribe(
      (response => {
        if (response['status'] == 200) {
          // console.log(response.body);
          this.toastr.success('Rejected');
          this.allPendingApprovals = response.body;
          this.dataSource.data = this.allPendingApprovals;
          //  console.log('reject',this.dataSource.data);
        }
      }),
      (error => {
        this.toastr.error(error);
      }));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  clearFilters() {
    this.dataSource.filter = '';
  }

}