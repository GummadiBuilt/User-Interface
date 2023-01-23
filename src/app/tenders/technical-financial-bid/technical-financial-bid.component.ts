import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CellEditingStartedEvent, CellEditingStoppedEvent, CellValueChangedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { NumericCellRendererComponent } from 'src/app/renderers/numeric-cell-renderer/numeric-cell-renderer.component';
import { UnitCellRendererComponent } from 'src/app/renderers/unit-cell-renderer/unit-cell-renderer.component';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { PageConstants } from 'src/app/shared/application.constants';
import { tableExport } from '../create-tender/createTender';
import * as XLSX from 'xlsx';
import _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { tenderResopnse } from '../tender/tenderResponse';
import { T } from '@angular/cdk/keycodes';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-technical-financial-bid',
  templateUrl: './technical-financial-bid.component.html',
  styleUrls: ['./technical-financial-bid.component.scss']
})
export class TechnicalFinancialBidComponent implements OnInit {
  tenderDetails!: FormGroup;
  public downloadBtnState: boolean = false;
  public constantVariable = PageConstants;
  public btnstate: boolean = false;
  public isFileUploaded = false;
  public file: any;
  fileName: any;
  public tenderId: string | null | undefined;
  userRole: any;
  private _tenderData: any;

  @Input() set tenderData(value: any) {
    this._tenderData = value;
    console.log(this._tenderData);
  }
  get tenderData() {
    return this._tenderData;
  }

  constructor(private _formBuilder: FormBuilder, protected keycloak: KeycloakService, private ApiServicesService: ApiServicesService,
    private toastr: ToastrService, private route: ActivatedRoute,) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tenderId');
      this.tenderId = id;
      if (id) {
        this.ApiServicesService.getTendersDatabyId(id).subscribe((data: tenderResopnse) => {
          //console.log('Tender data by id', data);
          this.editData(data);
          this.tenderFormDisable();
        });
      }
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
  }

  editData(data: any) {
    if (data.tenderId) {
      if (Object.keys(data.tenderFinanceInfo).length === 0) {
        this.rowData = [];
      } else { this.rowData = JSON.parse(data.tenderFinanceInfo); }
      this.tenderId = data.tenderId;
      this.fileName = data.tenderDocumentName;
    } else {
      this.toastr.error('No data to display');
    }
  }

  onFileChange(event: any) {
    this.fileName = '';
    this.isFileUploaded = true;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.tenderDetails?.markAsDirty();
    }
    else {
      this.file = null;
    }
  }

  removeSelectedFile(f: any) {
    if (f) {
      this.file = null;
    }
  }
  downloadSelectedFile(id: any) {
    this.ApiServicesService.downloadTechnicalTenderDocument(id).subscribe((response) => {
      this.ApiServicesService.downloadFile(response);
      this.toastr.success('File Downloaded successfully');
    });
  }

  //AG GRID COMPONENTS
  public appHeaders = ["Item No", "Item Description", "Unit", "Quantity"]
  public gridApi!: GridApi;
  public gridOptions!: any;
  public editType: 'fullRow' = 'fullRow';
  public rowData: any[] = [{ "Item No": 0, "Item Description": "", "Unit": "", "Quantity": 0 }];
  public rowSelection: 'single' | 'multiple' = 'single';
  public domLayout: any;
  units = ['Ton', 'Square meter', 'Running meter'];
  public overlayLoadingTemplate =
    '<span></span>';
  public columnDefs: ColDef[] = [
    { field: this.appHeaders[0], sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 120, maxWidth: 120, },
    { field: this.appHeaders[1], sortable: true, filter: 'agTextColumnFilter', flex: 8, minWidth: 550, autoHeight: true, wrapText: true },
    {
      field: this.appHeaders[2], sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 140, maxWidth: 140,
      cellRenderer: UnitCellRendererComponent,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.units,
      },
    },
    {
      field: this.appHeaders[3], sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 120, maxWidth: 120,
      cellEditor: NumericCellRendererComponent
    },
    {
      headerName: "Action", flex: 1, maxWidth: 120,
      cellRenderer: (params: any) => {
        const divElement = document.createElement("div");
        const editingCells = params.api.getEditingCells();
        // checks if the rowIndex matches in at least one of the editing cells
        const isCurrentRowEditing = editingCells.some((cell: any) => {
          return cell.rowIndex === params.node.rowIndex;
        });
        if (this.btnstate) {
          divElement.innerHTML = `
            <button class="action-disable-button add" type="button" disabled>
              <i style="font-size: 14px; padding-bottom: 4px;" class="fa-solid fa-plus"></i>
            </button>
            <button class="action-disable-button delete" type="button" disabled>
              <i style="font-size: 14px; padding-bottom: 4px;" class="fa-solid fa-trash-can"></i>
            </button>
            `;
        } else {
          divElement.innerHTML = `
            <button class="action-button add" type="button" data-action="add">
              <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
            </button>
            <button class="action-button delete" type="button" data-action="delete">
              <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
            </button>
            `;
        }
        return divElement;
      },
      editable: false,
      colId: "action",
      filter: false
    }
  ];
  public defaultColDef: ColDef = {
    editable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  };
  onCellValueChanged(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApi.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChanged(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApi.setRowData(this.rowData);
    } else {
      const addDataItem = [event.node.data];
      this.gridApi.applyTransaction({ update: addDataItem });
    }
    this.gridApi.refreshCells();
  }
  onBtStopEditing() {
    this.gridApi.stopEditing();
  }
  onBtStartEditing() {
    this.gridApi.setFocusedCell(1, 'Item No');
    this.gridApi.startEditingCell({
      rowIndex: 1,
      colKey: 'Item No',
    });
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
  }
  onCellClicked(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      const newRow = { 'Item No': '', 'Item Description': '', 'Unit': '', 'Quantity': '' };
      const newIndex = params.node.rowIndex + 1;
      if (action === "add") {
        this.gridApi.applyTransaction({
          add: [newRow],
          addIndex: newIndex
        });
        this.rowData.splice(newIndex, 0, newRow);
        this.gridApi.setRowData(this.rowData);
        this.gridApi.startEditingCell({
          rowIndex: newIndex,
          //   // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
        this.gridApi.refreshCells();
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.rowData.splice(params.rowIndex, 1);
        this.gridApi.refreshCells();
      }
    }
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    // console.log('cellEditingStopped');
    this.gridApi.stopEditing();
  }
  onRowEditingStarted(params: any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
  onRowEditingStopped(params: any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
    this.gridApi.stopEditing();
  }
  importExcel(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      this.tenderDetails?.markAsDirty();
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];


      /* save data */
      const data: tableExport[] = XLSX.utils.sheet_to_json(ws);

      const errorData = data.filter(item => !this.units.includes(item.Unit));

      if (errorData.length > 0) {
        const errorMessage = errorData.map(item => `Item no ${item['Item No']} has invalid unit ${item.Unit}`);
        this.toastr.error('Encounreted below error(s) when importing ' + errorMessage.join(', '));
      }

      const dataHeaders: string[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const diff = _.difference(this.appHeaders, dataHeaders[0]);
      if (diff.length > 0) {
        this.toastr.error('Template is missing following Headers ' + diff.join(', '));
      }
      else {
        // Data will be logged in array format containing objects
        this.rowData = data;
      }
    };
  }
  getParams() {
    let columnsForExport = { columnKeys: [''] };
    const allColumns = this.gridOptions.getColumns();

    allColumns.forEach((element: { colId: string; }) => {
      if (element.colId != "action") {
        columnsForExport.columnKeys.push(element.colId)
      }
    });
    //console.log(columnsForExport)
    return columnsForExport;
  }
  exportExcelFile() {
    this.gridApi.exportDataAsCsv(this.getParams());
  }

  tenderFormDisable() {
    const workFlowStep = this.tenderDetails?.get('workflowStep')?.value;
    if ((this.userRole?.includes("client") && (workFlowStep != 'Draft'))) {
      this.btnstate = true;
      this.gridOptions.getColumn('Item No').getColDef().editable = false;
      this.gridOptions.getColumn('Item Description').getColDef().editable = false;
      this.gridOptions.getColumn('Unit').getColDef().editable = false;
      this.gridOptions.getColumn('Quantity').getColDef().editable = false;
      this.gridApi.refreshCells();
    } else if (this.userRole?.includes("admin") && (workFlowStep != 'Yet to be published')) {
      this.btnstate = true;
      this.gridOptions.getColumn('Item No').getColDef().editable = false;
      this.gridOptions.getColumn('Item Description').getColDef().editable = false;
      this.gridOptions.getColumn('Unit').getColDef().editable = false;
      this.gridOptions.getColumn('Quantity').getColDef().editable = false;
      this.gridApi.refreshCells();
    } else if (this.userRole?.includes("contractor")) {
      this.btnstate = true;
      this.downloadBtnState = true;
    }
  }
}
