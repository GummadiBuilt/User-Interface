import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ButtonRendererComponent } from '../../renderers/button-renderer/button-renderer.component';
import { ApiServicesService } from '../../shared/api-services.service';
import { tenderResopnse } from './tenderResponse';
@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {

  public userRole: string[] | undefined;
  public toggle: boolean = true;
  public editId: string | null | undefined;
  public rowData: any;
  public frameworkComponents: any;
  fileName = '';
  public domLayout: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(protected keycloak: KeycloakService, public router: Router, private route: ActivatedRoute,
    private ApiServicesService: ApiServicesService, private toastr: ToastrService,) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.editId = id;
    });
    this.domLayout = "autoHeight";
  }
  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }
    this.getTendersData();
  }
  getTendersData() {
    this.ApiServicesService.getTenders().subscribe((data: tenderResopnse) => {
      this.rowData = data;
    });
  }
  savedFiltersChanged(event: any) {
    localStorage.setItem('saved-filters', JSON.stringify(event));
  }

  toggleView(change: MatButtonToggleChange) {
    this.toggle = change.value;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
    }
  }
  createTender() {
    this.router.navigate(['/tenders/create-tender'], { relativeTo: this.route });
  }

  // Each Column Definition results in one Column.
  public gridApi!: GridApi;
  public gridOptions!: any;
  public columnDefs: ColDef[] = [
    {
      headerName: 'Tender ID', field: 'tender_id', filter: 'agTextColumnFilter', pinned: 'left',
      cellRenderer: function (params: any) {
        const id = `<a href=/tenders/edit-tender/${params.value}>${params.value}</a>`;
        return id;
      }
    },
    { headerName: 'Client Name', field: 'company_name', filter: 'agTextColumnFilter', autoHeight: true, wrapText: true },
    { headerName: 'Description', field: 'work_description', filter: 'agTextColumnFilter', autoHeight: true, wrapText: true },
    { headerName: 'Type of Contract', field: 'type_of_contract', filter: 'agTextColumnFilter' },
    { headerName: 'Type of Work', field: 'establishment_description', filter: 'agTextColumnFilter', autoHeight: true, wrapText: true },
    { headerName: 'Status', field: 'workflow_step', filter: 'agTextColumnFilter' },
    { headerName: 'Location', field: 'project_location', filter: 'agTextColumnFilter' },
    { headerName: 'Last Date of Submission', field: 'last_date_of_submission', filter: 'agDateColumnFilter', filterParams: filterParams },
    { headerName: 'Contract Duration', field: 'contract_duration', filter: 'agTextColumnFilter', valueGetter: `data.contract_duration  +' '+  data.duration_counter` },
    {
      headerName: 'Action', field: 'tender_document_name', cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        context: this
      },
      filter: false,
      colId: "action",
      minWidth: 350,
    }
  ];

  downloadDocument(data: any) {
    debugger;
    const downloadId = data.tender_id ? data.tender_id : data;
    this.ApiServicesService.downloadTechnicalTenderDocument(downloadId).subscribe((response) => {
      this.ApiServicesService.downloadFile(response);
      this.toastr.success('File Downloaded successfully');
    });
  }

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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
    console.log(this.userRole);
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
