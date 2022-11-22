import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent, CellEditingStartedEvent, CellEditingStoppedEvent, CellValueChangedEvent,
  ColDef, GridApi, GridReadyEvent, RowValueChangedEvent
} from 'ag-grid-community';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';
import { ApiServicesService } from '../../shared/api-services.service';
import { tenderMasterData, typeOfContracts, typeOfEstablishment } from './createTender';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';
import { commonOptionsData } from '../../shared/commonOptions';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};
function actionCellRenderer(params: any) {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell: any) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  // if (isCurrentRowEditing) {
  //       eGui.innerHTML = `
  //   <button  class="action-button update"  data-action="update"> Update  </button>
  //   <button  class="action-button cancel"  data-action="cancel" > Cancel </button>
  //   `;
  //     } else {
  eGui.innerHTML = `
    <button class="action-button add"  data-action="add" > Add  </button>
    <button class="action-button delete" data-action="delete" > Delete </button>
    `;
  //}

  return eGui;
}
@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.component.html',
  styleUrls: ['./create-tender.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ]
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
  //public fileSource: any ;
  public file: any;
  durationCounterList: any;
  tenderId: string | null | undefined;
  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private http: HttpClient, private toastr: ToastrService,
    protected keycloak: KeycloakService, private ApiServicesService: ApiServicesService,
    private datePipe: DatePipe, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tenderId = id;
      if (id) {
        this.ApiServicesService.getTendersDatabyId(id).subscribe((data) => {
          console.log('Tender data by id', data);
          this.editData(data);
        });
      }
    });
  }


  ngOnInit(): void {
    this.ApiServicesService.navigation.next(true);
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
      //console.log('user role', this.userRole);
    } catch (e) {
      this.toastr.error('Failed to load user details' + e);
    }
    this.tenderDetails = this._formBuilder.group({
      typeOfWork: ['', Validators.required],
      workDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      projectLocation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      typeOfContract: ['', [Validators.required]],
      contractDuration: ['', [Validators.required]],
      durationCounter: ['', [Validators.required]],
      lastDateOfSubmission: ['', [Validators.required]],
      estimatedBudget: ['', [Validators.required]],
      tenderFinanceInfo: [''],
      workflowStep: ['']
      //fileSource:  [null]
      // ftdTableRows: this._formBuilder.group({
      //   position: ['', Validators.required],
      //   item_description: ['', [Validators.required]],
      //   unit: ['', Validators.required],
      //   quantity: ['', Validators.required]
      // })
    });
    this.getTendersMasterData();
    this.getCommonOptionsData();
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
      console.log('common', data.durationCounter);
      this.durationCounterList = data.durationCounter;
      this.workflowStepSave = data.workflowStep;
      console.log('workflowStep', data.workflowStep, this.workflowStepSave)
    });
  }
  editData(data: any) {
    this.tenderDetails.get('typeOfWork')?.patchValue(data['typeOfWork']);
    this.tenderDetails.get('workDescription')?.patchValue(data['workDescription']);
    this.tenderDetails.get('projectLocation')?.patchValue(data['projectLocation']);
    this.tenderDetails.get('typeOfContract')?.patchValue(data['typeOfContract']);
    this.tenderDetails.get('contractDuration')?.patchValue(data['contractDuration']);
    this.tenderDetails.get('durationCounter')?.patchValue(data['durationCounter']);
    this.tenderDetails.get('lastDateOfSubmission')?.patchValue(data['lastDateOfSubmission']);
    this.tenderDetails.get('typeOfWork')?.patchValue(data['typeOfWork']);
    this.tenderDetails.get('estimatedBudget')?.patchValue(data['estimatedBudget']);
   // this.tenderDetails.get('tenderFinanceInfo')?.patchValue(data['tenderFinanceInfo']);
    this.tenderDetails.get('workflowStep')?.patchValue(data['workflowStep']);
    this.rowData = JSON.parse(data['tenderFinanceInfo']);
    // this.tenderDetails.get('typeOfWork')?.patchValue(data['typeOfWork']);
  }

  isFileUploaded = false;
  //file: any;
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
    else{
      this.file = null;
    }
  }
  removeSelectedFile(f: any) {
    if (f) {
      //this.file = [];
    }
  }



  //AG GRID COMPONENTS
  public appHeaders = ["Item Description", "Unit", "Quantity"]
  private gridApi!: GridApi;
  public columnDefs: ColDef[] = [
    { field: this.appHeaders[0], sortable: true, filter: true },
    { field: this.appHeaders[1], sortable: true, filter: true },
    { field: this.appHeaders[2], sortable: true },
    {
      headerName: "Action",
      minWidth: 150,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: "action"
    }
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
  public editType: 'fullRow' = 'fullRow';
  public rowData: any;
  public rowSelection: 'single' | 'multiple' = 'single';
  onCellValueChanged(event: CellValueChangedEvent) {
    console.log(
      'onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue
    );
  }
  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    console.log(
      'onRowValueChanged: (' +
      data.Make +
      ', ' +
      data.Model +
      ', ' +
      data.Price +
      ')'
    );
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
    //console.log('grid ready', params)
  }
  onCellClicked(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "add") {
        // params.api.startEditingCell({
        //   rowIndex: params.node.rowIndex,
        //   // gets the first columnKey
        //   colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        // });
        // params.api.updateRowData({
        //   add: [{ make: '', model: '', price: 0 }]
        // });
        params.api.updateRowData({
          add: [{ itemDescription: '', unit: '', quantity: 0 }],
          addIndex: params.node.rowIndex + 1
        });
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          //   // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  }
  onCellEditingStarted(event: CellEditingStartedEvent) {
    console.log('cellEditingStarted');
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    console.log('cellEditingStopped');
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
  }
  importExcel(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    //console.log('reader', reader);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      const dataHeaders: string[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      //console.log('headers', dataHeaders[0]);
      const diff = _.difference(this.appHeaders, dataHeaders[0]);
      if (diff.length > 0) {
        // console.log("Missing headers", diff);
        this.toastr.error('Template is missing following Headers ' + diff.join(', '));
      }
      else {
        // console.log(data); // Data will be logged in array format containing objects
        this.rowData = data;
      }

    };
  }
  //date format to dd-MM-yyyy
  dateConversion() {
    if (this.tenderDetails.value.lastDateOfSubmission) {
      this.tenderDetails.value.lastDateOfSubmission = this.datePipe.transform(this.tenderDetails.value.lastDateOfSubmission, 'dd-MM-yyyy');
      console.log(this.tenderDetails.value.lastDateOfSubmission);
    }
  }
  onSave() {
    console.log('save');
  }
  onSubmit() {
    //this.dateConversion();
    console.log(this.tenderDetails.value);
    this.tenderDetails.controls['tenderFinanceInfo'].setValue(JSON.stringify(this.rowData));
    this.tenderDetails.controls['workflowStep'].setValue('SAVE');
    if (this.tenderDetails.value.lastDateOfSubmission) {
      this.tenderDetails.value.lastDateOfSubmission = this.datePipe.transform(this.tenderDetails.value.lastDateOfSubmission, 'dd/MM/yyyy');
      console.log(this.tenderDetails.value.lastDateOfSubmission);
    }
    console.log('tender form data', this.tenderDetails.value);
    if (this.tenderId && this.tenderDetails.valid) {
      console.log('update form');
      //update tender form
      // if(this.file === undefined){
      //   this.file = null;
      // }
      let formData = new FormData();
      debugger;
      formData.append('tenderDocument', this.file);
      formData.append('tenderInfo', JSON.stringify(this.tenderDetails.value));
      console.log(formData.getAll('tenderDocument'));
      console.log('tenderDocument formdata', formData);
      this.ApiServicesService.updateTender(this.tenderId, formData).subscribe(
        (response => {
          console.log(response);
          this.toastr.success('Successfully Updated');
          //this.router.navigate(['/home']);

        }),
        (error => {
          console.log(error);
          // this.toastr.error(error);
        })
      )
    } else if (this.tenderDetails.valid) {
      console.log('create form');
      //create tender form
      // if(this.file.length === undefined){
      //   this.file = null;
      // }
      let formData = new FormData();
      formData.append('tenderDocument', this.file);
      formData.append('tenderInfo', JSON.stringify(this.tenderDetails.value));
      console.log(formData.getAll('tenderDocument'));
      console.log('tenderDocument formdata', formData);
      this.ApiServicesService.createTender(formData).subscribe(
        (response => {
          console.log(response);
          this.toastr.success('Successfully Created');
          //this.router.navigate(['/home']);

        }),
        (error => {
          console.log(error);
          // this.toastr.error(error);
        })
      )
    }
    else {
      //error
    }
  }





}
