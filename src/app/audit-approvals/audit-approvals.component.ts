import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { registrationAuditResopnse } from '../commonservices/auditUserData';

@Component({
  selector: 'app-audit-approvals',
  templateUrl: './audit-approvals.component.html',
  styleUrls: ['./audit-approvals.component.scss']
})
export class AuditApprovalsComponent implements OnInit {
  allAuditApprovals: any = [];
  domLayout: any;

  constructor(private ApiServicesService: ApiServicesService) {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    this.getAuditApprovalsdata();
  }

  //get list of data
  getAuditApprovalsdata() {
    this.ApiServicesService.getRegistrationAuditApproval().subscribe((data: registrationAuditResopnse) => {
      this.allAuditApprovals = data;
    });
  }

  //Ag-Grid
  public ColumnDefs: ColDef[] = [
    { headerName: 'Company Name', field: 'companyName', flex: 2 },
    { headerName: 'Year of Establishment', field: 'yearOfEstablishment', flex: 1, minWidth: 200, },
    { headerName: 'Type of Establishment', field: 'typeOfEstablishment', flex: 2 },
    { headerName: 'Address', field: 'address', flex: 2 },
    { headerName: 'City', field: 'city.cityName', flex: 2 },
    { headerName: 'State', field: 'state.stateName', flex: 2 },
    { headerName: 'Country', field: 'country.countryName', flex: 2 },
    { headerName: 'Contact First Name', field: 'contactFirstName', flex: 2 },
    { headerName: 'Contact Last Name', field: 'contactLastName', flex: 2 },
    { headerName: 'Contact Designation', field: 'contactDesignation', flex: 2 },
    { headerName: 'Contact Phone Number', field: 'contactPhoneNumber', flex: 2 },
    { headerName: 'Contact Email Address', field: 'contactEmailAddress', flex: 3 },
  ];
  public DefaultColDef: ColDef = {
    minWidth: 250,
    resizable: true,
    editable: false,
    wrapText: true,
    autoHeight: true,
    menuTabs: ['filterMenuTab'],
    filter: true,
    floatingFilter: true,
  };
  public paginationPageSize = 30;

}