import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { enquiryResopnse } from '../contact/enquiryResponse';
import { ApiServicesService } from '../shared/api-services.service';

@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.component.html',
  styleUrls: ['./enquiries.component.scss']
})
export class EnquiriesComponent implements OnInit {
  allEnquiries: any = [];
  domLayout: any;

  constructor(private ApiServicesService: ApiServicesService) {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    this.getEnquiries();
  }

  getEnquiries() {
    this.ApiServicesService.getEnquiries().subscribe((data: any) => {
      this.allEnquiries = data;
      console.log(this.allEnquiries);
    });
  }

  //Ag-Grid
  public gridApi!: GridApi;
  public ColumnDefs: ColDef[] = [
    // { headerName: 'ID', field: 'id', flex: 2 },
    { headerName: 'Contact Name', field: 'userName', flex: 1, },
    { headerName: 'Contact Email Address', field: 'emailAddress', flex: 1, },
    { headerName: 'Contact Phone  Number', field: 'mobileNumber', flex: 1 },
    { headerName: 'Role Name', field: 'applicationRole', flex: 1 },
    { headerName: 'Enquiry Description', field: 'enquiryDescription', flex: 2, minWidth: 450, },
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  public paginationPageSize = 30;

  exportContractorFile() {
    this.gridApi.exportDataAsCsv();
  }

  public toggle: boolean = true;
  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }
}
