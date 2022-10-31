import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  address: string;
}
const ELEMENT_DATA: UserData[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Kate',
    company_name: 'Jhon Pvt Ltd',
    address: 'Hyderabad, India'
  },
  {
    id: '2',
    first_name: 'Philip',
    last_name: 'Cross',
    company_name: 'Philip Pvt Ltd',
    address: 'Delhi, India'
  },
  {
    id: '3',
    first_name: 'Wade',
    last_name: 'Mathew',
    company_name: 'Wade Pvt Ltd',
    address: 'Bangalore, India'
  },
  {
    id: '4',
    first_name: 'Faulkner',
    last_name: 'Daniel',
    company_name: 'Daniel Pvt Ltd',
    address: 'Chennai, India'
  },
  {
    id: '5',
    first_name: 'Stirling',
    last_name: 'Paul',
    company_name: 'Stirling Pvt Ltd',
    address: 'Hyderabad, India'
  },
];

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.scss']
})
export class PendingApprovalsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'id', 'first_name', 'last_name', 'company_name', 'address', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  idFilter = new FormControl();
  firstNameFilter = new FormControl();
  lastNameFilter = new FormControl();
  companyNameFilter = new FormControl();
  addressFilter = new FormControl();

  filteredValues = { id: '', first_name: '', last_name: '', company_name: '', address: '' };

  selection = new SelectionModel<UserData>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
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
  checkboxLabel(row?: UserData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  constructor() {

  }

  ngOnInit(): void {
    this.idFilter.valueChanges.subscribe((idFilterValue) => {
      this.filteredValues['id'] = idFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.firstNameFilter.valueChanges.subscribe((firstNameFilterValue) => {
      this.filteredValues['first_name'] = firstNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.lastNameFilter.valueChanges.subscribe((lastNameFilterValue) => {
      this.filteredValues['last_name'] = lastNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.companyNameFilter.valueChanges.subscribe((companyNameFilterValue) => {
      this.filteredValues['company_name'] = companyNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.addressFilter.valueChanges.subscribe((addressFilterValue) => {
      this.filteredValues['address'] = addressFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: UserData, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let firstNameFound = data.first_name.toString().trim().toLowerCase().indexOf(searchString.first_name.toLowerCase()) !== -1
      let idFound = data.id.toString().trim().indexOf(searchString.id) !== -1
      let lastNameFound = data.last_name.toString().trim().toLowerCase().indexOf(searchString.last_name) !== -1
      let companyNameFound = data.company_name.toString().trim().toLowerCase().indexOf(searchString.company_name) !== -1
      let addressFound = data.address.toString().trim().toLowerCase().indexOf(searchString.address) !== -1
      if (searchString.topFilter) {
        return firstNameFound || idFound || lastNameFound || companyNameFound || addressFound
      } else {
        return firstNameFound && idFound && lastNameFound && companyNameFound && addressFound
      }
    }
    return myFilterPredicate;
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

}