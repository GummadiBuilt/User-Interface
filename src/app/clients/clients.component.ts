import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ColDef } from 'ag-grid-community';
import { ApiServicesService } from '../shared/api-services.service';
import { clientUsersResponse } from '../shared/clientUsersResponse';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  allClientUsers: any = [];
  domLayout: any;
  constructor(private ApiServicesService: ApiServicesService) {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    this.getClientUsers();
  }

  //get list of data
  getClientUsers() {
    this.ApiServicesService.getClientUsers().subscribe((data: clientUsersResponse) => {
      this.allClientUsers = data;
      console.log(this.allClientUsers);
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
    { headerName: 'Total Tenders', field: 'total_tenders', flex: 2 },

    { headerName: 'Under Process', field: 'under_process_step', flex: 1 },
    { headerName: 'Recommended', field: 'recommended_step', flex: 1 },
    { headerName: 'Yet to Publish', field: 'yet_to_publish_step', flex: 1 },
    { headerName: 'Publish', field: 'publish_step', flex: 1 },
    { headerName: 'Save', field: 'save_step', flex: 1 },
    { headerName: 'Suspended', field: 'suspended_step', flex: 1 },
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
