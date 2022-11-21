import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ButtonRendererComponent } from '../button-renderer/button-renderer.component';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {

  public userRole: string[] | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //toggle view
  toggle: boolean = true;
  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }
  frameworkComponents: any;
  constructor(protected keycloak: KeycloakService, public router: Router) {
    console.log(this.router.url);

  }
  ngOnInit(): void {
    //console.log('tenders');
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
      console.log('user role', this.userRole);
    } catch (e) {
      console.log('Failed to load user details', e);
    }
  }
  savedFiltersChanged(event: any) {
    localStorage.setItem('saved-filters', JSON.stringify(event));
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

  //ag-grid
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  // Each Column Definition results in one Column.

  public columnDefs: ColDef[] = [
    { headerName: 'Tender ID', field: 'id', filter: 'agNumberColumnFilter', pinned: 'left' },
    { headerName: 'Description', field: 'description', filter: 'agTextColumnFilter' },
    { headerName: 'Type of Contract', field: 'type_of_contract', filter: 'agTextColumnFilter' },
    { headerName: 'Type of Work', field: 'type_of_work', filter: 'agTextColumnFilter' },
    { headerName: 'Status', field: 'status', filter: 'agTextColumnFilter' },
    { headerName: 'Location', field: 'location', filter: 'agTextColumnFilter' },
    { headerName: 'Last Date of Submission', field: 'last_date', filter: 'agDateColumnFilter', 
    filterParams: filterParams },
{ headerName: 'Contract Duration', field: 'contract_duration', filter: 'agTextColumnFilter' },
{
  headerName: 'Tender Document', field: 'tender_document', cellRenderer: ButtonRendererComponent,
    cellRendererParams: {
    clicked: function (field: any) {

    },
    label: 'Tender Document',
      },
  filter: false,
    },
{
  headerName: 'Actions', field: 'actions', cellRenderer: ButtonRendererComponent,
    cellRendererParams: {
    // clicked: function (field: any) {
    //   return 
    // },
    label: 'Edit',
      inRouterLink: '/edit-tender',
      },
  filter: false,
    pinned: 'right',
    }
  ];

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
  flex: 1,
  minWidth: 200,
  resizable: true,
  menuTabs: ['filterMenuTab'],
  filter: true,
  floatingFilter: true,
};
  public sideBar: SideBarDef | string | string[] | boolean | null = {
  toolPanels: ['filters'],
  };



  public rowData: any;
onGridReady(params: GridReadyEvent) {
  this.rowData = [
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
}

}

//Date filter
var filterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('/');
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    else {
      return 1;
    }
  },
  browserDatePicker: true,
  minValidYear: 2000,
  maxValidYear: 2030,
  inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
};
