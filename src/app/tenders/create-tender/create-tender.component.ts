import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CellEditingStartedEvent, CellEditingStoppedEvent, CellValueChangedEvent, ColDef, CsvExportParams, GridApi,
  GridOptions,
  GridReadyEvent, RowValueChangedEvent,
} from 'ag-grid-community';
import { commonOptionsData } from '../../shared/commonOptions';
import { ApiServicesService, toastPayload } from '../../shared/api-services.service';
import { tenderMasterData, typeOfContracts, typeOfEstablishment, tableExport } from './createTender';
import { tenderResopnse } from '../tender/tenderResponse';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDlgComponent } from 'src/app/shared/confirmation-dlg.component';
import { UnitCellRendererComponent } from 'src/app/renderers/unit-cell-renderer/unit-cell-renderer.component';
import { NumericCellRendererComponent } from 'src/app/renderers/numeric-cell-renderer/numeric-cell-renderer.component';
import _ from 'lodash';
import { ComponentCanDeactivate } from 'src/app/shared/can-deactivate/deactivate.guard';
import { PageConstants } from 'src/app/shared/application.constants';
import moment from 'moment';

@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.component.html',
  styleUrls: ['./create-tender.component.scss'],
  providers: []
})
export class CreateTenderComponent implements OnInit, ComponentCanDeactivate {
  tenderDetails!: FormGroup;
  ftdTableRows!: FormGroup;
  public constantVariable = PageConstants;
  public userRole: string[] | undefined;
  public typeOfWorksList = new Array<typeOfEstablishment>();
  public typeOfContractsList = new Array<typeOfContracts>();
  public typeOfWorks = new Array<typeOfEstablishment>();
  public typeOfContracts = new Array<typeOfContracts>();
  public tenderDocumentName: any;
  public workflowStepSave: any;
  public file: any;
  public durationCounterList: any;
  public tenderId: string | null | undefined;
  public isFileUploaded = false;
  loading = false;
  fileName: any;
  public btnstate: boolean = false;
  public downloadBtnState: boolean = false;
  public warningMessage!: string;
  public todayDate!: Date;
  public pqID!: number;
  public applicationFormId!: number;
  public applicationFormStatus!: string;
  public applicantLabel!:any;
  public optionApplnState!: boolean;

  constructor(private _formBuilder: FormBuilder, private toastr: ToastrService,
    protected keycloak: KeycloakService, private ApiServicesService: ApiServicesService,
    private route: ActivatedRoute, public router: Router,
    private dialog: MatDialog) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tenderId');
      this.tenderId = id;
      if (id) {
        this.ApiServicesService.getTendersDatabyId(id).subscribe((data: tenderResopnse) => {
          //console.log('Tender data by id', data);
          this.pqID = data.pqFormId;
          this.applicationFormId = data.applicationFormId;
          this.applicationFormStatus = data.applicationFormStatus;
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
    this.tenderDetails = this._formBuilder.group({
      typeOfWork: ['', Validators.required],
      projectName: ['', [Validators.required, Validators.maxLength(50)]],
      workDescription: ['', [Validators.required, Validators.maxLength(2500)]],
      projectLocation: ['', [Validators.required, Validators.maxLength(50)]],
      typeOfContract: ['', [Validators.required]],
      contractDuration: ['', [Validators.required, Validators.maxLength(5)]],
      durationCounter: ['', [Validators.required]],
      lastDateOfSubmission: [moment, [Validators.required]],
      estimatedBudget: ['', Validators.maxLength(20)],
      tenderFinanceInfo: [''],
      workflowStep: ['']
    });
    this.getTendersMasterData();
    this.getCommonOptionsData();
    this.todayDate = new Date();
  }

  canDeactivate(): boolean {
    return this.tenderDetails.dirty;
  }

  getTendersMasterData() {
    this.ApiServicesService.getTenderMasterData().subscribe((data: tenderMasterData) => {
      this.typeOfWorks = data.typeOfEstablishments;
      this.typeOfWorksList = this.typeOfWorks.slice();
      this.typeOfContracts = data.typeOfContracts;
      this.typeOfContractsList = this.typeOfContracts.slice();
    });
  }
  getCommonOptionsData() {
    this.ApiServicesService.getCommonOptionsData().subscribe((data: commonOptionsData) => {
      this.durationCounterList = data.durationCounter;
    });
  }
  editData(data: any) {
    if (data.tenderId) {
      this.tenderDetails.get('typeOfWork')?.patchValue(data.typeOfWork.establishmentDescription);
      this.tenderDetails.get('projectName')?.patchValue(data.projectName);
      this.tenderDetails.get('workDescription')?.patchValue(data.workDescription);
      this.tenderDetails.get('projectLocation')?.patchValue(data.projectLocation);
      this.tenderDetails.get('typeOfContract')?.patchValue(data.typeOfContract.id);
      this.tenderDetails.get('contractDuration')?.patchValue(data.contractDuration);
      this.tenderDetails.get('durationCounter')?.patchValue(data.durationCounter);
      this.tenderDetails.get('lastDateOfSubmission')?.patchValue(data.lastDateOfSubmission);
      this.tenderDetails.get('estimatedBudget')?.patchValue(data.estimatedBudget);
      this.tenderDetails.get('workflowStep')?.patchValue(data.workflowStep);
      if (Object.keys(data.tenderFinanceInfo).length === 0) {
        this.rowData = [];
      } else { this.rowData = JSON.parse(data.tenderFinanceInfo); }
      this.tenderId = data.tenderId;
      this.fileName = data.tenderDocumentName;
    } else {
      this.toastr.error('No data to display');
    }
    if(this.userRole?.includes('contractor')){
      if (this.applicationFormId != null && this.applicationFormStatus!='DRAFT') {
        this.applicantLabel = this.constantVariable.viewBtn;
      } else if(this.applicationFormId != null && this.applicationFormStatus!='SUBMIT') {
        this.applicantLabel = this.constantVariable.editBtn;
      } else{
        this.applicantLabel = this.constantVariable.applyBtn;
      }
      if(this.applicationFormId == 0 && this.applicationFormStatus == null && this.tenderDetails.get('workflowStep')?.value == "Under Process"){
        this.optionApplnState = true;
        this.applicantLabel = this.constantVariable.applyBtn;
       }
    }
  }
  onSelected(event: any) {
    const value = event;
    const tender = this.tenderId;
    const pqForm = this.pqID;
    const applnTender = this.applicationFormId;
    if(value == 'PQForm'){
      if (this.pqID != (null || 0)) {
        this.router.navigate(['/tenders', tender, 'edit-pq-form', pqForm]);
      }
      else {
        this.router.navigate(['/tenders', tender, 'create-pq-form']);
      }
      return;
    }
    if (value == 'Apply' && this.tenderDetails.get('workflowStep')?.value != 'UNDER_PROCESS') {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: this.constantVariable.applyTenderMsg, msg: '' }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.router.navigate(['/tenders', tender, 'tender-application-form']);
        }
      });

    } else {
      if(value == 'View'){
        if(this.applicationFormId){
          this.router.navigate(['/tenders', tender, 'view-tender-application-form', applnTender]);
        }
      }else{
        this.router.navigate(['/tenders', tender, 'edit-tender-application-form', applnTender]);
      }
      return;
    }
  }

  onFileChange(event: any) {
    this.fileName = '';
    this.isFileUploaded = true;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.tenderDetails.markAsDirty();
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
    { field: this.appHeaders[0], sortable: true, filter: 'agTextColumnFilter', flex: 1, maxWidth: 120, },
    { field: this.appHeaders[1], sortable: true, filter: 'agTextColumnFilter', flex: 8, minWidth: 550, autoHeight: true, wrapText: true },
    {
      field: this.appHeaders[2], sortable: true, filter: 'agTextColumnFilter', flex: 1, maxWidth: 140,
      cellRenderer: UnitCellRendererComponent,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.units,
      },
    },
    {
      field: this.appHeaders[3], sortable: true, filter: 'agTextColumnFilter', flex: 1, maxWidth: 120,
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
  onCellEditingStarted(event: CellEditingStartedEvent) {
    //console.log('cellEditingStarted');
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
      this.tenderDetails.markAsDirty();
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
  onSave() {
    //console.log(this.tenderDetails.value.lastDateOfSubmission);
    this.tenderDetails.controls['tenderFinanceInfo'].setValue(JSON.stringify(this.rowData));
    this.tenderDetails.controls['workflowStep'].setValue('DRAFT');
    if (this.tenderDetails.value.lastDateOfSubmission) {
      const dateTran = moment(this.tenderDetails.value.lastDateOfSubmission).format('DD/MM/YYYY');
      this.tenderDetails.value.lastDateOfSubmission = dateTran;
    } else {
      this.toastr.error('Please Select Valid Last Date of Submission');
    }
    let formData = new FormData();
    const blob = new Blob();
    formData.append('tenderDocument', this.file || blob);
    formData.append('tenderInfo', JSON.stringify(this.tenderDetails.value));
    this.loading = true;
    if (this.tenderId && this.tenderDetails.valid) {
      // console.log('update form');
      this.ApiServicesService.updateTender(this.tenderId, formData).subscribe({
        next: ((response: tenderResopnse) => {
          this.toastr.success('Successfully Updated');
        }),
        error: (error => {
          console.log(error);
        })
      })
    } else if (this.tenderDetails.valid && this.file) {
      // console.log('create form');
      this.ApiServicesService.createTender(formData).subscribe({
        next: ((response: tenderResopnse) => {
          this.tenderId = response.tenderId;
          this.tenderDetails.markAsPristine();
          this.router.navigate(['tenders/edit-tender/' + response.tenderId]);
          this.toastr.success('Successfully Created');
        }),
        error: (error => {
          console.log(error);
        })
      })
    } else if (!this.tenderId && !this.file) {
      //error
      this.toastr.error('Please upload the Technical Tender Document');
    } else {
      //error
      console.log('error');
      this.toastr.error('Error in Creation Tender Form');
    }
  }
  onSubmit() {
    if (this.tenderId && this.tenderDetails.valid) {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: this.constantVariable.submitTenderTitle, msg: this.constantVariable.submitTenderMsg }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.tenderDetails.controls['tenderFinanceInfo'].setValue(JSON.stringify(this.rowData));
          this.tenderDetails.controls['workflowStep'].setValue('YET_TO_BE_PUBLISHED');
          if (this.tenderDetails.value.lastDateOfSubmission) {
            const dateTran = moment(this.tenderDetails.value.lastDateOfSubmission).format('DD/MM/YYYY');
            this.tenderDetails.value.lastDateOfSubmission = dateTran;
          } else {
            this.toastr.error('Please Select Valid Last Date of Submission');
          }
          let formDataSubmit = new FormData();
          const blob = new Blob();
          formDataSubmit.append('tenderDocument', this.file || blob);
          formDataSubmit.append('tenderInfo', JSON.stringify(this.tenderDetails.value));
          this.ApiServicesService.updateTender(this.tenderId, formDataSubmit).subscribe({
            next: (response => {
              this.tenderDetails.controls['workflowStep'].setValue(response.workflowStep);
              this.toastr.success('Successfully Submitted');
              this.tenderFormDisable();
            }),
            error: (error => {
              console.log(error);
            })
          })
        }
      });
    } else {
      //error
      console.log('error');
      this.toastr.error('Error in Submitting Tender Form');
    }
  }
  onUpdate() {
    if (this.tenderId && this.tenderDetails.valid && this.userRole?.includes('admin')) {
      this.tenderDetails.controls['tenderFinanceInfo'].setValue(JSON.stringify(this.rowData));
      this.tenderDetails.controls['workflowStep'].setValue('YET_TO_BE_PUBLISHED');
      if (this.tenderDetails.value.lastDateOfSubmission) {
        const dateTran = moment(this.tenderDetails.value.lastDateOfSubmission).format('DD/MM/YYYY');
        this.tenderDetails.value.lastDateOfSubmission = dateTran;
      } else {
        this.toastr.error('Please Select Valid Last Date of Submission');
      }
      let formDataSubmit = new FormData();
      const blob = new Blob();
      formDataSubmit.append('tenderDocument', this.file || blob);
      formDataSubmit.append('tenderInfo', JSON.stringify(this.tenderDetails.value));
      this.ApiServicesService.updateTender(this.tenderId, formDataSubmit).subscribe({
        next: (response => {
          this.tenderDetails.controls['workflowStep'].setValue(response.workflowStep);
          this.toastr.success('Successfully Submitted');
          this.tenderFormDisable();
        }),
        error: (error => {
          console.log(error);
        })
      });
    } else {
      //error
      console.log('error');
      this.toastr.error('Error in Submitting Tender Form');
    }
  }
  tenderFormDisable() {
    const workFlowStep = this.tenderDetails.get('workflowStep')?.value;
    const warningMessage = this.constantVariable.disabledWarningTenderMsg + workFlowStep + ' step';
    if ((this.userRole?.includes("client") && (workFlowStep != 'Draft'))) {        
      this.tenderDetails.disable();
      this.btnstate = true;
      this.gridOptions.getColumn('Item No').getColDef().editable = false;
      this.gridOptions.getColumn('Item Description').getColDef().editable = false;
      this.gridOptions.getColumn('Unit').getColDef().editable = false;
      this.gridOptions.getColumn('Quantity').getColDef().editable = false;
      this.gridApi.refreshCells();
      this.warningMessage = warningMessage;
    } else if (this.userRole?.includes("admin") && (workFlowStep != 'Yet to be published')) {
      this.tenderDetails.disable();
      this.btnstate = true;
      this.gridOptions.getColumn('Item No').getColDef().editable = false;
      this.gridOptions.getColumn('Item Description').getColDef().editable = false;
      this.gridOptions.getColumn('Unit').getColDef().editable = false;
      this.gridOptions.getColumn('Quantity').getColDef().editable = false;
      this.gridApi.refreshCells();
      this.warningMessage = warningMessage;
    } else if (this.userRole?.includes("contractor")) {
      this.tenderDetails.disable();
      this.btnstate = true;
      this.downloadBtnState = true;
    }
  }
}