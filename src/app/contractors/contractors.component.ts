import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ColDef } from 'ag-grid-community';
import { ApiServicesService } from '../shared/api-services.service';
import { contractorUsersResponse } from '../shared/contractorUsersResponse';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.scss']
})
export class ContractorsComponent implements OnInit {
  allContractorUsers: any = [];
  domLayout: any;
  constructor(private ApiServicesService: ApiServicesService) {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    this.getClientUsers();
  }

  //get list of data
  getClientUsers() {
    this.ApiServicesService.getContractorUsers().subscribe((data: contractorUsersResponse) => {
      this.allContractorUsers = data;
      console.log(this.allContractorUsers);
    });
  }

  //Ag-Grid
  public ColumnDefs: ColDef[] = [
    // { headerName: 'ID', field: 'id', flex: 2 },
    { headerName: 'Contact Email Address', field: 'contact_email_address', flex: 2, minWidth: 250, },
    { headerName: 'Contact First Name', field: 'contact_first_name', flex: 2 },
    { headerName: 'Contact Last Name', field: 'contact_last_name', flex: 2 },
    { headerName: 'Role Name', field: 'role_name', flex: 2 },
    { headerName: 'Company Name', field: 'company_name', flex: 2, minWidth: 250, },
    { headerName: 'Applied Tenders', field: 'applied_tenders', flex: 1 },
  ];
  public DefaultColDef: ColDef = {
    minWidth: 200,
    resizable: true,
    editable: false,
    wrapText: true,
    autoHeight: true,
    menuTabs: ['filterMenuTab'],
    filter: true,
    floatingFilter: true,
  };
  public paginationPageSize = 30;

  public toggle: boolean = true;
  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }
}
