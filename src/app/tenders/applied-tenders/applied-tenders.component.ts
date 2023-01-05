import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { ButtonRendererComponent } from 'src/app/renderers/button-renderer/button-renderer.component';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { StatusValues } from 'src/app/shared/status-values';
import { appliedTenderResopnse } from './appliedTenderResponse';

@Component({
  selector: 'app-applied-tenders',
  templateUrl: './applied-tenders.component.html',
  styleUrls: ['./applied-tenders.component.scss']
})
export class AppliedTendersComponent implements OnInit {
  public userRole: string[] | undefined;
  public toggle: boolean = true;
  public rowData: any;
  public domLayout: any;
  public frameworkComponents: any;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(protected keycloak: KeycloakService, private ApiServicesService: ApiServicesService, private toastr: ToastrService,) {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }

    this.getAppliedTendersData();
  }

  getAppliedTendersData() {
    this.ApiServicesService.getAppliedTenders().subscribe((data: appliedTenderResopnse) => {
      this.rowData = data;
     // console.log('Applied tenders', this.rowData);
    });
  }

  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

  // Each Column Definition results in one Column.
  public gridApi!: GridApi;
  public gridOptions!: any;
  public columnDefs: ColDef[] = [
    {
      headerName: 'Tender ID', field: 'tender_id', flex: 1, filter: 'agTextColumnFilter', pinned: 'left',
      cellRenderer: function (params: any) {
        const id = `<a href=/tenders/edit-tender/${params.value}>${params.value}</a>`;
        return id;
      }
    },
    { headerName: 'Application Form ID', field: 'application_form_id', flex: 1, filter: 'agTextColumnFilter', },
    { headerName: 'PQ ID', field: 'pq_id', flex: 1, filter: 'agTextColumnFilter', },
    { headerName: 'Client Name', field: 'company_name', flex: 1, filter: 'agTextColumnFilter', autoHeight: true, wrapText: true },
    { headerName: 'Project Name', field: 'project_name', flex: 1, filter: 'agTextColumnFilter', autoHeight: true, wrapText: true },
    { headerName: 'Work Description', field: 'work_description', flex: 1, filter: 'agTextColumnFilter', autoHeight: true, wrapText: true },
    { headerName: 'Type of Work', field: 'establishment_description', flex: 2, minWidth: 300, filter: 'agTextColumnFilter', autoHeight: true, wrapText: true },
    { headerName: 'Type of Contract', field: 'type_of_contract', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Contract Duration', field: 'contract_duration', flex: 1, filter: 'agTextColumnFilter', valueGetter: `data.contract_duration  +' '+  data.duration_counter` },
    {
      headerName: 'Estimated Budget', field: 'estimated_budget', flex: 1, filter: 'agTextColumnFilter',
      valueFormatter: params => currencyFormatter(params.data.estimated_budget, '₹ '),
    },
    {
      headerName: 'Status', field: 'workflow_step', flex: 1, filter: 'agTextColumnFilter',
      cellRenderer: function (data: any) {
        return (data.value !== null && data.value !== undefined)
          ? StatusValues[data.value as keyof typeof StatusValues] : 'not found';
      }
    },
    { headerName: 'Location', field: 'project_location', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Last Date of Submission', field: 'last_date_of_submission', flex: 1, filter: 'agDateColumnFilter', filterParams: filterParams },
    { headerName: 'Tender Document Size', field: 'tender_document_size', flex: 1, valueGetter: `data.tender_document_size  +' MB'` },
    { headerName: 'Created by', field: 'created_by', flex: 1 },
    {
      headerName: 'Action', field: 'tender_document_name', flex: 1, cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        context: this
      },
      filter: false,
      colId: "action",
      minWidth: 300,
    },
  ];

  downloadDocument(data: any) {
    const downloadId = data.tender_id ? data.tender_id : data;
    this.ApiServicesService.downloadTechnicalTenderDocument(downloadId).subscribe((response) => {
      this.ApiServicesService.downloadFile(response);
      this.toastr.success('File Downloaded successfully');
    });
  }

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    minWidth: 200,
    resizable: true,
    menuTabs: ['filterMenuTab'],
    filter: true,
    floatingFilter: true,
  };
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ['filters'],
  };
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
    // console.log(this.userRole);
    if (this.userRole?.includes("client")) {
      this.agGrid.columnApi.setColumnVisible('company_name', false);
    }
  }
  getParams() {
    let columnsForExport = { columnKeys: [''] };
    const allColumns = this.gridOptions.getColumns();
    allColumns.forEach((element: { colId: string; }) => {
      if (this.userRole?.includes("client")) {
        if (element.colId != "company_name" && element.colId != "action") {
          columnsForExport.columnKeys.push(element.colId)
        }
      } else {
        if (element.colId != "action") {
          columnsForExport.columnKeys.push(element.colId)
        }
      }
    });
    //console.log(columnsForExport)
    return columnsForExport;
  }
  exportTendersFile() {
    this.gridApi.exportDataAsCsv(this.getParams());
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
  browserDatePicker: true
};

//indian currency formatter
function currencyFormatter(currency: number, sign: string) {
  var x = currency.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '')
    lastThree = ',' + lastThree;
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return sign + `${res}`;
}