import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';
import { CurrencyPipe, DatePipe, formatCurrency } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CellEditingStartedEvent, CellEditingStoppedEvent, CellValueChangedEvent, ColDef, GridApi,
  GridReadyEvent, RowValueChangedEvent,
} from 'ag-grid-community';
import { commonOptionsData } from '../../shared/commonOptions';
import { ApiServicesService } from '../../shared/api-services.service';
import { tenderMasterData, typeOfContracts, typeOfEstablishment } from './createTender';
import { tenderResopnse } from '../tender/tenderResponse';

function actionCellRenderer(params: any) {
  let eGui = document.createElement("div");
  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell: any) => {
    return cell.rowIndex === params.node.rowIndex;
  });
  eGui.innerHTML = `
    <button class="action-button add"  data-action="add" > Add  </button>
    <button class="action-button delete" data-action="delete" > Delete </button>
    `;
  return eGui;
}
@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.component.html',
  styleUrls: ['./create-tender.component.scss'],
  providers: [CurrencyPipe]
})
export class CreateTenderComponent implements OnInit {
  tenderDetails!: FormGroup;
  ftdTableRows!: FormGroup;
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
  constructor(private _formBuilder: FormBuilder, private toastr: ToastrService,
    protected keycloak: KeycloakService, private ApiServicesService: ApiServicesService,
    private datePipe: DatePipe, private route: ActivatedRoute, public router: Router) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tenderId = id;
      if (id) {
        this.ApiServicesService.getTendersDatabyId(id).subscribe((data: tenderResopnse) => {
          // console.log('Tender data by id', data);
          this.editData(data);
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
      workDescription: ['', [Validators.required, Validators.maxLength(50)]],
      projectLocation: ['', [Validators.required, Validators.maxLength(50)]],
      typeOfContract: ['', [Validators.required]],
      contractDuration: ['', [Validators.required, Validators.maxLength(5)]],
      durationCounter: ['', [Validators.required]],
      lastDateOfSubmission: ['', [Validators.required]],
      estimatedBudget: ['', Validators.maxLength(20)],
      tenderFinanceInfo: [''],
      workflowStep: ['']
    });

    this.getTendersMasterData();
    this.getCommonOptionsData();
  }

  //currency format
  transform(value: string) {
    return new Intl.NumberFormat('en-IN', {
      currency: 'INR',
      minimumFractionDigits: 0, //no.of decimal values
    }).format(Number(value));
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
    this.tenderDetails.get('typeOfWork')?.patchValue(data.typeOfWork.establishmentDescription);
    this.tenderDetails.get('workDescription')?.patchValue(data.workDescription);
    this.tenderDetails.get('projectLocation')?.patchValue(data.projectLocation);
    this.tenderDetails.get('typeOfContract')?.patchValue(data.typeOfContract.id);
    this.tenderDetails.get('contractDuration')?.patchValue(data.contractDuration);
    this.tenderDetails.get('durationCounter')?.patchValue(data.durationCounter);
    const date = data.lastDateOfSubmission;
    const [day, month, year] = date.split('/');
    const convertedDate = new Date(+year, +month - 1, +day);
    // console.log(date);
    // console.log(convertedDate.toISOString());
    this.tenderDetails.get('lastDateOfSubmission')?.patchValue(convertedDate);
    this.tenderDetails.get('estimatedBudget')?.patchValue(data.estimatedBudget);
    // console.log('edit', this.tenderDetails.get('estimatedBudget')?.value);
    this.tenderDetails.get('workflowStep')?.patchValue(data.workflowStep);
    this.rowData = JSON.parse(data.tenderFinanceInfo);
    this.tenderId = data.tenderId;
    this.fileName = data.tenderDocumentName;
  }

  onFileChange(event: any) {
    this.fileName = '';
    this.isFileUploaded = true;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
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
    // console.log('download',id);
    this.ApiServicesService.downloadTechnicalTenderDocument(id).subscribe((response) => {
      this.ApiServicesService.downloadFile(response);
      this.toastr.success('File Downloaded successfully');
    });
  }
  //AG GRID COMPONENTS
  public appHeaders = ["Item Description", "Unit", "Quantity"]
  private gridApi!: GridApi;
  public editType: 'fullRow' = 'fullRow';
  public rowData :any[]= [{ "Item Description": "", "Unit": "", "Quantity": 0 }];
  public rowSelection: 'single' | 'multiple' = 'single';
  public domLayout: any;
  public columnDefs: ColDef[] = [
    { field: this.appHeaders[0], sortable: true, filter: 'agTextColumnFilter', minWidth: 350, autoHeight: true, wrapText: true },
    { field: this.appHeaders[1], sortable: true, filter: 'agTextColumnFilter' },
    { field: this.appHeaders[2], sortable: true, filter: 'agTextColumnFilter' },
    {
      headerName: "Action",
      minWidth: 150,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: "action",
      filter: false
    }
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    filter: true,
    floatingFilter: true,
    minWidth: 160,
    resizable: true,
  };
  onCellValueChanged(event: CellValueChangedEvent) {
    console.log(
      'onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue
    );
  }
  onRowValueChanged(event : any) {
    var data = event.data;
    console.log(
      'onRowValueChanged: (' +
      data['Item Description'] +
      ', ' +
      data.Unit +
      ', ' +
      data.Quantity +
      ')'
    );
   // console.log('rowvalue change',event.rowIndex,event.data);
    if(event.rowIndex==0){
      this.gridApi.setRowData(this.rowData)
    }else{
      this.rowData.splice(event.rowIndex, 0, event.data);
    }
  }
  onBtStopEditing() {
    this.gridApi.stopEditing();
  }
  onBtStartEditing() {
    this.gridApi.setFocusedCell(1, 'Item Description');
    this.gridApi.startEditingCell({
      rowIndex: 1,
      colKey: 'Item Description',
    });
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onCellClicked(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "add") {
        this.gridApi.applyTransaction({
          add: [{ 'Item Description': '', 'Unit': '', 'Quantity': 0 }],
          addIndex: params.node.rowIndex + 1
        });
        this.gridApi.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          //   // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.rowData.splice(params.rowIndex, 1);
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
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws);
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

  onSave() {
    this.tenderDetails.controls['tenderFinanceInfo'].setValue(JSON.stringify(this.rowData));
    this.tenderDetails.controls['workflowStep'].setValue('SAVE');
    if (this.tenderDetails.value.lastDateOfSubmission) {
      this.tenderDetails.value.lastDateOfSubmission = this.datePipe.transform(this.tenderDetails.value.lastDateOfSubmission, 'dd/MM/yyyy');
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
      this.ApiServicesService.updateTender(this.tenderId, formData).subscribe(
        ((response: tenderResopnse) => {
          this.toastr.success('Successfully Updated');
        }),
        (error => {
          console.log(error);
        })
      ).add(() => this.loading = false)
    } else if (this.tenderDetails.valid && this.file) {
      // console.log('create form');
      this.ApiServicesService.createTender(formData).subscribe(
        ((response: tenderResopnse) => {
          this.tenderId = response.tenderId;
          this.router.navigate(['tenders/edit-tender/' + response.tenderId]);
          this.toastr.success('Successfully Created');
        }),
        (error => {
          console.log(error);
        })
      )
    } else if(!this.tenderId && !this.file) {
      //error
      console.log('File upload error');
      this.toastr.error('Please upload the Technical Tender Document');
    }else{
      //error
      console.log('error');
      this.toastr.error('Error in Creation Tender Form');
    }
  }
  onSubmit() {
    this.tenderDetails.controls['tenderFinanceInfo'].setValue(JSON.stringify(this.rowData));
    this.tenderDetails.controls['workflowStep'].setValue('YET_TO_BE_PUBLISHED');
    if (this.tenderDetails.value.lastDateOfSubmission) {
      this.tenderDetails.value.lastDateOfSubmission = this.datePipe.transform(this.tenderDetails.value.lastDateOfSubmission, 'dd/MM/yyyy');
    } else {
      this.toastr.error('Please Select Valid Last Date of Submission');
    }
    let formDataSubmit = new FormData();
    const blob = new Blob();
    formDataSubmit.append('tenderDocument', this.file || blob);
    formDataSubmit.append('tenderInfo', JSON.stringify(this.tenderDetails.value));
    this.loading = true;
    if (this.tenderId && this.tenderDetails.valid) {
      // console.log('update form');
      this.ApiServicesService.updateTender(this.tenderId, formDataSubmit).subscribe(
        (response => {
          this.toastr.success('Successfully Submitted');
        }),
        (error => {
          console.log(error);
        })
      ).add(() => this.loading = false)
    } else {
      //error
      console.log('error');
      this.toastr.error('Error in Submitting Tender Form');
    }
  }
}