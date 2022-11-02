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

  displayedColumns: string[] = ['select', 'applicationRoleId', 'firstName', 'lastName', 'email', 'companyName',
    'yearOfEstablishment', 'typeOfEstablishment', 'address', 'city', 'state', 'country', 'contactName', 'contactDesignation',
    'contactPhoneNumber', 'contactEmailAddress', 'coordinatorName', 'coordinatorMobileNumber'
    , 'actions'];

  allPendingApprovals: any = [];
  dataSource = new MatTableDataSource<registrationApprovalResopnse>();

  idFilter = new FormControl();
  firstNameFilter = new FormControl();
  lastNameFilter = new FormControl();
  companyNameFilter = new FormControl();
  contactNameFilter = new FormControl();
  contactPhoneFilter = new FormControl();

  filteredValues = { id: '', firstName: '', lastName: '', companyName: '', contactName: '', contactPhoneNumber: '' };

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
    this.idFilter.valueChanges.subscribe((idFilterValue) => {
      this.filteredValues['id'] = idFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.firstNameFilter.valueChanges.subscribe((firstNameFilterValue) => {
      this.filteredValues['firstName'] = firstNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.lastNameFilter.valueChanges.subscribe((lastNameFilterValue) => {
      this.filteredValues['lastName'] = lastNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.companyNameFilter.valueChanges.subscribe((companyNameFilterValue) => {
      this.filteredValues['companyName'] = companyNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.contactNameFilter.valueChanges.subscribe((contactNameFilterValue) => {
      this.filteredValues['contactName'] = contactNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.contactPhoneFilter.valueChanges.subscribe((contactPhoneFilterValue) => {
      this.filteredValues['contactPhoneNumber'] = contactPhoneFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.getPendingApprovalsdata();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: registrationApprovalResopnse, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let firstNameFound = data.firstName.toString().trim().toLowerCase().indexOf(searchString.firstName.toLowerCase()) !== -1
      let applicationRoleIdFound = data.applicationRoleId.toString().trim().indexOf(searchString.applicationRoleId) !== -1
      let lastNameFound = data.lastName.toString().trim().toLowerCase().indexOf(searchString.lastName) !== -1
      let companyNameFound = data.companyName.toString().trim().toLowerCase().indexOf(searchString.companyName) !== -1
      let contactNameFound = data.contactName.toString().trim().toLowerCase().indexOf(searchString.contactName) !== -1
      let contactPhoneFound = data.contactPhoneNumber.toString().trim().toLowerCase().indexOf(searchString.contactPhoneNumber) !== -1
      if (searchString.topFilter) {
        return firstNameFound || applicationRoleIdFound || lastNameFound || companyNameFound || contactNameFound || contactPhoneFound
      } else {
        return firstNameFound && applicationRoleIdFound && lastNameFound && companyNameFound && contactNameFound && contactPhoneFound
      }
    }
    return myFilterPredicate;
  }

  applyFilterById(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  //get list of data
  getPendingApprovalsdata() {
    this.ApiServicesService.getRegistrationPendingApproval().subscribe((data: registrationApprovalResopnse) => {
      this.allPendingApprovals = data;
      this.dataSource.data = this.allPendingApprovals;
      //console.log(this.dataSource.data);
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
         // console.log('reject',this.dataSource.data);
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