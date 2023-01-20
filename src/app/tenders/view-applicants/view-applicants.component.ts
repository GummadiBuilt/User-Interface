import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CellEditingStoppedEvent, CellValueChangedEvent, CheckboxSelectionCallbackParams, ColDef, GridReadyEvent, HeaderCheckboxSelectionCallbackParams, ICellRendererParams, RowDragEndEvent, RowDragLeaveEvent, RowSelectedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UnitCellRendererComponent } from 'src/app/renderers/unit-cell-renderer/unit-cell-renderer.component';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { PageConstants } from 'src/app/shared/application.constants';
import { StatusValues } from 'src/app/shared/status-values';
import { tenderApplicantRankingResopnse } from 'src/app/tenders/view-applicants/tenderApplicantRankingResopnse';
import { applicantsPqFormResponse } from '../tender-application-form/applicantpqformresponse';

@Component({
  selector: 'app-view-applicants',
  templateUrl: './view-applicants.component.html',
  styleUrls: ['./view-applicants.component.scss']
})
export class ViewApplicantsComponent implements OnInit {
  public domLayout: any;
  rowData: any;
  tenderId: any;
  public constantVariable = PageConstants;
  public userRole: string[] | undefined;
  public btnstate: boolean = false;

  constructor(private ApiServicesService: ApiServicesService, private route: ActivatedRoute,
    private toastr: ToastrService, protected keycloak: KeycloakService, private _formBuilder: FormBuilder,
    private router: Router,) {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
    });
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
      //console.log('user role', this.userRole);
    } catch (e) {
      this.toastr.error('Failed to load user details' + e);
    }
    this.getTenderApplicantsRankingData();

  }

  getTenderApplicantsRankingData() {
    this.ApiServicesService.getTenderApplicantRanking(this.tenderId).subscribe((data: tenderApplicantRankingResopnse) => {
      this.rowData = data;
      if (this.userRole?.includes('client') || (this.userRole?.includes('admin') && this.rowData[0].tenderStatus != 'UNDER_PROCESS')) {
        this.disableViewApplicants();
      }
    });
  }
  status = ['QUALIFIED', 'NOT_QUALIFIED']
  public columnDefs: ColDef[] = [
    {
      headerName: 'Contractor Name', field: 'companyName', rowDrag: true, filter: 'agTextColumnFilter', flex: 3, autoHeight: true, wrapText: true,
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection
    },
    {
      headerName: 'Applicant Form', flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        const id = `<a href=/tenders/${params.data.tenderId}/view-tender-application-form/${params.data.applicationFormId} target="_blank">View Application</a>`;
        return id
      },
      filter: false,
      colId: "action",
    },
    { headerName: 'Applicant Rank', field: 'applicantRank', filter: 'agTextColumnFilter', flex: 1, autoHeight: true, wrapText: true, },
    {
      headerName: 'Application Status', field: 'applicationStatus', filter: 'agTextColumnFilter', flex: 1, autoHeight: true, wrapText: true, editable: true,
      valueFormatter: (params: any) => {
        let val!: any;
        if (params.value == 'UNDER_PROCESS') {
          val = 'Select Status';
        } else {
          val = StatusValues[params.value as keyof typeof StatusValues];
        }
        return val;
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.status
      }
    },
    { headerName: 'Note', field: 'justificationNote', filter: 'agTextColumnFilter', flex: 5, autoHeight: true, wrapText: true, editable: true },
  ];
  public defaultColDef: ColDef = {
    minWidth: 200,
    resizable: true,
    menuTabs: ['filterMenuTab'],
    filter: true,
    floatingFilter: true,
    sortable: true,
  };

  gridApi: any;
  gridOptions: any;
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
    // this.gridApi.setSuppressRowDrag(true);
  }

  //to disable approve/reject buttons
  selectedRows: any;
  selectedRowsLength: any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedRows = this.gridApi.getSelectedRows();
    this.selectedRowsLength = this.selectedRows.length;
  }

  onRowSelected(event: RowSelectedEvent) {
    // var curSelectedNode = event.node;
    // console.log(params.data);
    var selectionCounts = this.gridApi.getSelectedNodes();
    let selectedRowsCount = selectionCounts.length;
    if (selectedRowsCount > 5) {
      this.gridApi.deselectIndex(0, true);
      this.toastr.warning('Only 5 Applicants to be Compared');
    }
  }
  onSelect() {
    const selectedData = this.gridApi.getSelectedRows();
    let applicationFormIds = selectedData.map((i: { applicationFormId: any; }) => i.applicationFormId);
    this.router.navigate(['/tenders', this.tenderId, 'view-applicants', 'compare-applicants', { applicationFormIds: applicationFormIds }]);
  }

  dragChanged(params: any) {
    this.gridApi.refreshCells(params);
  }

  onRowDragLeave(e: RowDragLeaveEvent) {
    console.log('onRowDragLeave', e);
    console.log('rowIndex', e.node.rowIndex);
  }
  onRowDragEnd(e: any) {
    this.gridApi.forEachNode((node: any, index: any) => {
      const rank = index + 1;
      node.setDataValue('applicantRank', rank);
    });
  }

  onRowDragMove(event: any) {
    // console.log('onRowDragMOVE', event);
  }

  onRowValueChanged(event: any) {
    var data = event.data;
    if (event.rowIndex != 0) {
      const addDataItem = [event.node.data];
      this.rowData.applyTransaction({ update: addDataItem });
    }
    this.rowData.refreshCells();
    // console.log(this.rowData);
  }
  onCellEditingStopped(event: CellEditingStoppedEvent) {
    this.gridApi.stopEditing();
  }

  onUpdate() {
    if (this.tenderId && this.userRole?.includes('admin')) {
      this.ApiServicesService.updateTenderApplicantRanking(this.tenderId, this.rowData, 'DRAFT').subscribe({
        next: (response => {
          this.toastr.success('Successfully Updated');
        }),
        error: (error => {
          console.log(error);
        })
      });
    } else {
      //error
      console.log('error');
      this.toastr.error('Error in Updating Applicant Details');
    }
  }
  onSubmit() {
    if (this.tenderId && this.userRole?.includes('admin')) {
      this.ApiServicesService.updateTenderApplicantRanking(this.tenderId, this.rowData, 'SUBMIT').subscribe({
        next: (response => {
          this.toastr.success('Successfully Submitted');
          this.disableViewApplicants();
        }),
        error: (error => {
          console.log(error);
        })
      });
    } else {
      //error
      console.log('error');
      this.toastr.error('Error in Submitting Applicant Details');
    }
  }
  disableViewApplicants() {
    this.btnstate = true;
    this.gridOptions.getColumns()?.forEach((colClientRef: any) => {
      colClientRef.colDef.editable = false;
    })
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