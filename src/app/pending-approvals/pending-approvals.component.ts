import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../shared/api-services.service';
import { registrationApprovalResopnse } from '../commonservices/approvalsUserData';
import { CheckboxSelectionCallbackParams, ColDef, GridApi, GridReadyEvent, HeaderCheckboxSelectionCallbackParams, SelectionChangedEvent } from 'ag-grid-community';
import { ActionButtonRendererComponent } from '../renderers/action-button-renderer/action-button-renderer.component';

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.scss']
})
export class PendingApprovalsComponent implements OnInit {

  allPendingApprovals: any = [];
  selectedData: any;
  selectedDataLength: any;
  domLayout: any;

  constructor(private ApiServicesService: ApiServicesService, private toastr: ToastrService) {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    this.getPendingApprovalsdata();
  }

  //to disable approve/reject buttons
  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedData = this.gridApi.getSelectedRows();
    this.selectedDataLength = this.selectedData.length;
  }

  //get list of data
  getPendingApprovalsdata() {
    this.ApiServicesService.getRegistrationPendingApproval().subscribe((data: registrationApprovalResopnse) => {
      this.allPendingApprovals = data;
    });
  }

  //Ag-Grid
  private gridApi!: GridApi;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  public ColumnDefs: ColDef[] = [
    {
      headerName: 'Company Name', field: 'companyName', flex: 2,
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,
    },
    { headerName: 'Year of Establishment', field: 'yearOfEstablishment', flex: 2, minWidth: 200, },
    { headerName: 'Role', field: 'applicationRole.roleName', flex: 2 },
    { headerName: 'Type of Establishment', field: 'typeOfEstablishment', flex: 4 },
    { headerName: 'Address', field: 'address', flex: 4 },
    { headerName: 'City', field: 'city.cityName', flex: 4 },
    { headerName: 'State', field: 'state.stateName', flex: 4 },
    { headerName: 'Country', field: 'country.countryName', flex: 4 },
    { headerName: 'Contact First Name', field: 'contactFirstName', flex: 4 },
    { headerName: 'Contact Last Name', field: 'contactLastName', flex: 4 },
    { headerName: 'Contact Designation', field: 'contactDesignation', flex: 4 },
    { headerName: 'Contact Phone Number', field: 'contactPhoneNumber', flex: 4 },
    { headerName: 'Contact Email Address', field: 'contactEmailAddress', flex: 6 },
    {
      headerName: "Action", field: 'action', flex: 1, pinned: 'right', filter: false, maxWidth: 150,
      cellRenderer: ActionButtonRendererComponent,
      cellRendererParams: {
        context: this
      },
    }
  ];
  public autoGroupColumnDef: ColDef = {
    headerName: 'Group',
    minWidth: 170,
    field: 'companyName',
    headerCheckboxSelection: true,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    },
  };
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  //approve all selected records
  onApproveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    //conversion to array
    let selectedGridIds = selectedData.map(i => i.id);
    console.log("requestId:" + selectedGridIds);
    this.ApiServicesService.postRegistrationPendingApproval(selectedData, { "requestId": selectedGridIds, "actionTaken": 'APPROVE' }).subscribe(
      response => {
        if (response['status'] == 200) {
          this.toastr.success('Approved');
          this.allPendingApprovals = response.body;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //reject all selected records
  onRejectSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    let selectedGridIds = selectedData.map(i => i.id);
    this.ApiServicesService.postRegistrationPendingApproval(selectedData, { "requestId": selectedGridIds, "actionTaken": 'REJECT' }).subscribe(
      response => {
        if (response['status'] == 200) {
          this.toastr.success('Rejected');
          this.allPendingApprovals = response.body;
        }
      },
      error => {
        console.log(error);
      });
  }

  //approve record by action button inside ag-grid cell
  onApproveClicked(id: any) {
    let selectedGridId = id;
    //single value conversion to array
    let selectedGridIds = [selectedGridId];
    this.ApiServicesService.postRegistrationPendingApproval(selectedGridIds, { "requestId": selectedGridIds, "actionTaken": 'APPROVE' }).subscribe(
      response => {
        if (response['status'] == 200) {
          this.toastr.success('Approved');
          this.allPendingApprovals = response.body;
        }
      },
      error => {
        console.log(error);
      });
  }

  //reject record by action button inside ag-grid cell
  onApproveRejected(id: any) {
    let selectedGridId = id;
    let selectedGridIds = [selectedGridId];
    this.ApiServicesService.postRegistrationPendingApproval(selectedGridIds, { "requestId": selectedGridIds, "actionTaken": 'REJECT' }).subscribe(
      response => {
        if (response['status'] == 200) {
          this.toastr.success('Rejected');
          this.allPendingApprovals = response.body;
        }
      },
      error => {
        console.log(error);
      });
  }

}

//check box selection AG-Grid
var checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};
var headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};