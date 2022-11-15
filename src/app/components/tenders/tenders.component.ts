import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface TenderElement {
  id: number;
  description: string;
  type_of_contract: string;
  type_of_work: string;
  status: string;
  location: string;
  last_date: string;
  contract_duration: string;
}

const TENDER_DATA: TenderElement[] = [
  {
    id: 1, description: 'Construction of Naval Air Station', type_of_contract: 'Building & Design',
    type_of_work: 'Civil', status: 'Published', location: 'Karnataka, India', last_date: '20-12-2022', contract_duration: '45 Days'
  },
  {
    id: 2, description: 'Construction of Naval Air Station', type_of_contract: 'Fixed Lump Sum Price Contract',
    type_of_work: 'Electrical', status: 'Pending', location: 'Hyderabad, India', last_date: '30-11-2022', contract_duration: '30 Days'
  },
  {
    id: 3, description: 'Construction of Naval Air Station', type_of_contract: 'GMP Contract',
    type_of_work: 'Civil', status: 'Rejected', location: 'Kolkata, India', last_date: '23-09-2022', contract_duration: '90 Days'
  },
  {
    id: 4, description: 'Construction of Naval Air Station', type_of_contract: 'GMP Contract',
    type_of_work: 'Civil', status: 'Rejected', location: 'Kolkata, India', last_date: '23-09-2022', contract_duration: '90 Days'
  },
];

// interface Filter {
//   value: string;
//   viewValue: string;
// }

// interface FilterGroup {
//   disabled?: boolean;
//   name: string;
//   filter: Filter[];
// }

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'description', 'type_of_contract', 'type_of_work',
    'status', 'location', 'last_date', 'contract_duration', 'tender_document', 'actions'];
  dataSource = new MatTableDataSource<TenderElement>(TENDER_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //toggle view
  toggle: boolean = true;
  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

  constructor() { }

  statusFilter = new FormControl();
  filteredValues = {
    status: '',
  };

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;

    // this.statusFilter.valueChanges.subscribe((statusFilterValue) => {
    //   this.filteredValues['status'] = statusFilterValue;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues);
    // });
    // this.dataSource.filterPredicate = this.customFilterPredicate();
    this.statusFilter.valueChanges.subscribe((positionFilterValue) => {
      this.dataSource.data = this.filterOptions(positionFilterValue);
    });
  }

  statusList = ['Pending', 'Published', 'Rejected'];
  filterOptions(positionValue: string[]): TenderElement[] {
    if ((!positionValue || positionValue.length === 0)) {
      return TENDER_DATA;
    }
    const filtered = TENDER_DATA.filter((periodicElement) => {
      return (positionValue ? positionValue.indexOf(periodicElement.status + '') !== -1 : false)
    });
    return filtered;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fileName = '';
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
    }
  }

  clearFilters() {
    this.dataSource.filter = '';
  }

  // customFilterPredicate() {
  //   const myFilterPredicate = function (data: TenderElement, filter: string): boolean {
  //     let searchString = JSON.parse(filter);
  //     return data.status.toString().trim().indexOf(searchString.status) !== -1;
  //   }
  //   return myFilterPredicate;
  // }


  // filterGroups: FilterGroup[] = [
  //   {
  //     name: 'Status',
  //     filter: [
  //       { value: 'Pending', viewValue: 'Pending' },
  //       { value: 'Published', viewValue: 'Published' },
  //       { value: 'Rejected', viewValue: 'Rejected' },
  //     ],
  //   },
  //   {
  //     name: 'Type of Work',
  //     filter: [
  //       { value: '1', viewValue: 'Consultancy Services' },
  //       { value: '2', viewValue: 'Structure Works (Civil)' },
  //       { value: '3', viewValue: 'Structure Works (Steel/PEB/Precast)' },
  //     ],
  //   },
  //   {
  //     name: 'Type of Contract',
  //     filter: [
  //       { value: '1', viewValue: 'Itemised Fixed Rate Contract' },
  //       { value: '2', viewValue: 'Fixed Lumpsum Price Contract' },
  //       { value: '3', viewValue: 'Design & Build Contract' },
  //     ],
  //   }
  // ];
  // filterGroupsArray = ['Status', 'Type of Work', 'Type of Contract']
  // public filterGroupsList = this.filterGroupsArray.slice();
}
