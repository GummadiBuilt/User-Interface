import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CellEditingStartedEvent, CellEditingStoppedEvent, CellEditorSelectorResult, CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, ICellEditorParams, RowEditingStartedEvent, RowEditingStoppedEvent, ValueFormatterParams } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UploadButtonRendererComponent } from 'src/app/renderers/upload-button-renderer/upload-button-renderer.component';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { applicantsPqFormResponse } from './applicantpqformresponse';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDlgComponent } from 'src/app/shared/confirmation-dlg.component';
import { PageConstants } from '../../shared/application.constants';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { DatePipe } from '@angular/common';
import { NumericCellRendererComponent } from 'src/app/renderers/numeric-cell-renderer/numeric-cell-renderer.component';
import { ComponentCanDeactivate } from 'src/app/shared/can-deactivate/deactivate.guard';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY'
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-tender-application-form',
  templateUrl: './tender-application-form.component.html',
  styleUrls: ['./tender-application-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TenderApplicationFormComponent implements OnInit, ComponentCanDeactivate {
  stepperOrientation!: Observable<StepperOrientation>;
  applicantPqForm!: FormGroup;
  public userRole: string[] | undefined;
  public domLayout: any;
  currentYear = moment().year();
  years: any[] = [];
  public constantVariable = PageConstants;
  btnsDisable: boolean = false;
  public warningMessage!: string;

  public gridApiTurnover!: GridApi;
  public gridOptionsTurnover!: any;
  public gridApiClientRef!: GridApi;
  public columnApiClientRef!: any;
  public gridApiSimilarNature!: GridApi;
  public columnApiSimilarNature!: any;
  public gridApiEmployeesStrength!: GridApi;
  public gridOptionsEmployeesStrength!: any;
  public gridApiCapitalEquipments!: GridApi;
  public gridOptionsCapitalEquipments!: any;
  public gridApiFinancialDetails!: GridApi;
  public gridOptionsFinancialDetails!: any;
  public gridApiCompanyBankersDetails!: GridApi;
  public gridOptionsCompanyBankersDetails!: any;
  public gridApiCompanyAuditorsDetails!: GridApi;
  public gridOptionsCompanyAuditorsDetails!: any;

  constructor(private toastr: ToastrService, protected keycloak: KeycloakService,
    private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService, private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog, private datePipe: DatePipe,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";
    this.route.paramMap.subscribe(params => {
      const tenderId = params.get('tenderId');
      const pqFormId = params.get('pqId');
      const applicationId = params.get('applicationId');
      this.pqFormTenderId = tenderId;
      this.PQFormId = pqFormId;
      if (tenderId && applicationId) {
        this.ApiServicesService.getApplicantPQForm(tenderId, applicationId).subscribe((data: applicantsPqFormResponse) => {
          //console.log(data);
          this.getApplicantPQForms(data);
        });
      }
    });
  }

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }

    //Vendor General Company info & etc (Contractor)
    this.applicantPqForm = this._formBuilder.group({
      companyName: ['', [Validators.required, Validators.maxLength(50)]],
      yearOfEstablishment: new FormControl(moment(), [Validators.required]),
      typeOfEstablishment: ['', [Validators.required,]],
      corpOfficeAddress: ['', Validators.maxLength(250)],
      localOfficeAddress: ['', Validators.maxLength(250)],
      telephoneNum: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      faxNumber: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(8), Validators.maxLength(14)]],
      contactName: ['', Validators.maxLength(50)],
      contactDesignation: ['', Validators.maxLength(50)],
      contactPhoneNum: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailId: ['', [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      regionalHeadName: ['', Validators.maxLength(50)],
      regionalHeadPhoneNum: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],

      turnOverDetails: {},
      similarProjects: {},
      clientReferences: {},
      similarProjectNature: {},

      esiRegistration: ['', [Validators.required, Validators.maxLength(50)]],
      epfRegistration: ['', [Validators.required, Validators.maxLength(50)]],
      gstRegistration: ['', [Validators.required, Validators.maxLength(50)]],
      panNumber: ['', [Validators.required, Validators.maxLength(50)]],

      employeesStrength: {},
      capitalEquipment: {},

      safetyPolicyManual: ['', Validators.maxLength(50)],
      ppeToStaff: ['', Validators.maxLength(50)],
      ppeToWorkMen: ['', Validators.maxLength(50)],
      safetyOfficeAvailability: ['', Validators.maxLength(50)],

      financialInformation: {},
      companyBankers: {},
      companyAuditors: {},

      underTaking: [true, Validators.required],
      actionTaken: ['']
    });
  }
  canDeactivate(): boolean {
    return this.applicantPqForm.dirty;
  }
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.applicantPqForm.controls['yearOfEstablishment'].value;
    if (ctrlValue) {
      const dateTran = moment(normalizedYear).format('YYYY');
      this.applicantPqForm.get('yearOfEstablishment')?.setValue(dateTran);
    }
    datepicker.close();
  }
  myDateFilter = (m: Moment | null): boolean => {
    const year = (m || moment()).year();
    return year <= this.currentYear;
  }
  getApplicantPQForms(data: any) {
    //console.log(data);
    this.applicantPqForm.get('companyName')?.patchValue(data.companyName);
    const dateString = data.yearOfEstablishment;
    const momentVariable = moment(dateString, 'YYYY');
    this.applicantPqForm.get('yearOfEstablishment')?.patchValue(momentVariable);
    this.applicantPqForm.get('typeOfEstablishment')?.patchValue(data.typeOfEstablishment);
    this.applicantPqForm.get('corpOfficeAddress')?.patchValue(data.corpOfficeAddress);
    this.applicantPqForm.get('localOfficeAddress')?.patchValue(data.localOfficeAddress);
    this.applicantPqForm.get('telephoneNum')?.patchValue(data.telephoneNum);
    this.applicantPqForm.get('faxNumber')?.patchValue(data.faxNumber);
    this.applicantPqForm.get('contactName')?.patchValue(data.contactName);
    this.applicantPqForm.get('contactDesignation')?.patchValue(data.contactDesignation);
    this.applicantPqForm.get('contactPhoneNum')?.patchValue(data.contactPhoneNum);
    this.applicantPqForm.get('contactEmailId')?.patchValue(data.contactEmailId);
    this.applicantPqForm.get('regionalHeadName')?.patchValue(data.regionalHeadName);
    this.applicantPqForm.get('regionalHeadPhoneNum')?.patchValue(data.regionalHeadPhoneNum);

    this.applicantPqForm.get('esiRegistration')?.patchValue(data.esiRegistration);
    this.applicantPqForm.get('epfRegistration')?.patchValue(data.epfRegistration);
    this.applicantPqForm.get('gstRegistration')?.patchValue(data.gstRegistration);
    this.applicantPqForm.get('panNumber')?.patchValue(data.panNumber);

    this.applicantPqForm.get('safetyPolicyManual')?.patchValue(data.safetyPolicyManual);
    this.applicantPqForm.get('ppeToStaff')?.patchValue(data.ppeToStaff);
    this.applicantPqForm.get('ppeToWorkMen')?.patchValue(data.ppeToWorkMen);
    this.applicantPqForm.get('safetyOfficeAvailability')?.patchValue(data.safetyOfficeAvailability);
    if (data.turnOverDetails != null) {
      this.turnoverDetails = data.turnOverDetails;
    }
    if (Object.keys(data.clientReferences).length === 0) {
      this.clientRefRowData = [];
    } else {
      // set the column headers from the data        
      const colDefs = this.gridApiClientRef?.getColumnDefs();
      const clientRef = (typeof data.clientReferences === 'string' ? JSON.parse(data.clientReferences) : data.clientReferences)
      const dataRef = clientRef;
      const keys = Object.keys(dataRef[0]);
      if (colDefs?.length) {
        const colMaster: ColDef = colDefs[1];
        const missingHeaders = keys.filter(item => !colDefs.map((col: ColDef) => col.field).includes(item));
        missingHeaders.forEach(header => {
          const clonedObk = { ...colMaster };
          clonedObk.field = header;
          clonedObk.colId = header;
          clonedObk.headerName = header;
          colDefs.push(clonedObk);
        });
        this.gridApiClientRef?.setColumnDefs(colDefs);
        this.clientRefRowData = clientRef;
        if (colDefs.length == 4) {
          this.btnstate = true;
        }
      }
    }
    if (Object.keys(data.similarProjectNature).length === 0) {
      this.similarNatureRowData = [];
    } else {
      // set the column headers from the data        
      const colDefsSim = this.gridApiSimilarNature?.getColumnDefs();
      const similarProjNat = (typeof data.similarProjectNature === 'string' ? JSON.parse(data.similarProjectNature) : data.similarProjectNature)
      const dataSimRef = similarProjNat;
      const keys = Object.keys(dataSimRef[0]);
      if (colDefsSim?.length) {
        const colMasterSim: ColDef = colDefsSim[1];
        const missingHeaders = keys.filter(item => !colDefsSim.map((col: ColDef) => col.field).includes(item));
        missingHeaders.forEach(header => {
          const clonedObkSim = { ...colMasterSim };
          clonedObkSim.field = header;
          clonedObkSim.colId = header;
          clonedObkSim.headerName = header;
          colDefsSim.push(clonedObkSim);
        });
        this.gridApiSimilarNature?.setColumnDefs(colDefsSim);
        this.similarNatureRowData = similarProjNat;
      }
    }
    if (Object.keys(data.employeesStrength).length === 0) {
      this.employeesStrengthRowData = [];
    } else {
      const empStrength = (typeof data.employeesStrength === 'string' ? JSON.parse(data.employeesStrength) : data.employeesStrength);
      this.employeesStrengthRowData = empStrength;
    }
    if (Object.keys(data.capitalEquipment).length === 0) {
      this.capitalEquipmentsRowData = [];
    } else {
      const capitalEquipment = (typeof data.capitalEquipment === 'string' ? JSON.parse(data.capitalEquipment) : data.capitalEquipment);
      this.capitalEquipmentsRowData = capitalEquipment;
    }
    if (Object.keys(data.financialInformation).length === 0) {
      this.financialDetails = [];
    } else {
      const financialInformation = (typeof data.financialInformation === 'string' ? JSON.parse(data.financialInformation) : data.financialInformation);
      this.financialDetails = financialInformation;
    }
    if (Object.keys(data.companyBankers).length === 0) {
      this.companyBankersDetails = [];
    } else {
      const companyBankers = (typeof data.companyBankers === 'string' ? JSON.parse(data.companyBankers) : data.companyBankers);
      this.companyBankersDetails = companyBankers;
    }
    if (Object.keys(data.companyAuditors).length === 0) {
      this.companyAuditorsDetails = [];
    } else {
      const companyAuditors = (typeof data.companyAuditors === 'string' ? JSON.parse(data.companyAuditors) : data.companyAuditors);
      this.companyAuditorsDetails = companyAuditors;
    }

    if (data.applicationId != 0) {
      this.applicantPqFormId = data.applicationId
    }
    if (data.actionTaken == "SUBMIT" && this.userRole?.includes('contractor')) {
      this.applicantPqForm.get('actionTaken')?.patchValue(data.actionTaken);
      this.tenderApplicantFormDisable();
    }
    if (data.actionTaken == "SUBMIT" && (this.userRole?.includes('admin') || this.userRole?.includes('client'))) {
      this.applicantPqForm.get('actionTaken')?.patchValue(data.actionTaken);
      this.tenderApplicantFormDisable();
    }
    if (this.userRole?.includes('admin') || this.userRole?.includes('client')) {
      this.tenderApplicantFormDisable();
    }
  }

  step = 0;
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }

  //ag-grid
  public editType: 'fullRow' = 'fullRow';
  public blob = new Blob();
  //Section B of PQ-Form: Turnover Details
  public turnoverColumnDefs: ColDef[] = [
    { headerName: 'Year', field: 'year', cellEditor: NumericCellRendererComponent, maxWidth: 100, },
    {
      headerName: 'Rs in Crores', field: 'revenue', cellClass: 'ag-right-aligned-cell',
      cellEditor: NumericCellRendererComponent, maxWidth: 150,
      valueFormatter: params => currencyFormatter(params.data.revenue),
    },
    { headerName: 'row', field: 'row', hide: true },
    {
      headerName: 'Remarks (Financial Statement for Reference)', field: 'fileName', editable: false, flex: 4,
      cellRenderer: UploadButtonRendererComponent,
      cellRendererParams: {
        context: this,
      },
    },
  ];
  public turnoverDefaultColDef: ColDef = {
    flex: 4,
    //editable: true,
    minWidth: 150,
    resizable: true,
    editable: true
  };

  public turnoverDetails = [
    { year: '', revenue: 0, row: 'YEAR_ONE', fileName: '' },
    { year: '', revenue: 0, row: 'YEAR_TWO', fileName: '' },
    { year: '', revenue: 0, row: 'YEAR_THREE', fileName: '' },
  ];

  onGridReadyTurnover(params: GridReadyEvent) {
    this.gridApiTurnover = params.api;
    this.gridOptionsTurnover = params.columnApi;
  }
  onCellValueChangedTurnover(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiTurnover.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChangedTurnover(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApiTurnover.setRowData(this.turnoverDetails);
    } else {
      const addDataItem = [event.node.data];
      this.gridApiTurnover.applyTransaction({ update: addDataItem });
    }
    this.gridApiTurnover.refreshCells();
  }

  //Section C of PQ-Form: Client References of 3 Major Projects

  public project: ColDef[] = [{
    headerName: 'Project 1', field: 'Project 1', editable: true, wrapText: true,
    cellEditorSelector: cellEditorSelector,
    valueFormatter: valueFormat,
  }];
  public projectInfoColumnDef: ColDef[] = [
    this.project[0]
  ]
  public clientRefColumnDefs: ColDef[] = [{ headerName: 'Details', field: 'details', editable: false, },
  this.project[0]];

  onBtIncludeProject2Columns() {
    const colDef = this.gridApiClientRef?.getColumnDefs();
    this.project.forEach(item => {
      item.headerName = 'Project ' + colDef?.length,
        item.field = 'Project ' + colDef?.length
      item.colId = 'Project ' + colDef?.length
    });
    colDef?.push(this.project[0]);
    if (colDef?.length && colDef?.length <= 4) {
      this.gridApiClientRef?.setColumnDefs(colDef);
      this.gridApiSimilarNature?.setColumnDefs(colDef);
    } else {
      this.btnstate = true;
      this.toastr.error('A maximum of three client references are allowed');
    }
  }
  btnstate: boolean = false;
  onGridReadyClientRef(params: GridReadyEvent) {
    this.gridApiClientRef = params.api;
    this.columnApiClientRef = params.columnApi;
  }
  public clientRefDefaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    resizable: true,
    editable: true,
  };
  public clientRefRowData = [
    { details: 'Name & Location of Project:', 'Project 1': '' },
    { details: 'Scope of Contract:', 'Project 1': '' },
    { details: 'Built Up Area:', 'Project 1': '' },
    { details: 'Contract Duration:', 'Project 1': '' },
    { details: 'Contract Value:', 'Project 1': 0 },
    { details: 'Current Status (If completed date of completion):', 'Project 1': '' },
    { details: 'Employers Name & Address', 'Project 1': '' },
    { details: 'Referee’s Name', 'Project 1': '' },
    { details: 'Referee’s Position', 'Project 1': '' },
    { details: 'Contact details', 'Project 1': '' },
    { details: 'Remarks if any', 'Project 1': '' },
  ];
  onCellEditingStartedClientRef($event: any) {
    if ($event.colDef.field === 'details') {
      this.gridApiClientRef.stopEditing();
    }
  }
  onCellValueChangedClientRef(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiClientRef.applyTransaction({
      update: dataItem,
    });
  }
  //Section C of PQ-Form: Projects of similar Nature
  public similarNatureColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    this.project[0]
  ];

  onGridReadySimilarNature(params: GridReadyEvent) {
    this.gridApiSimilarNature = params.api;
    this.columnApiSimilarNature = params.columnApi;
  }
  public similarNatureDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public similarNatureRowData = [
    { details: 'Name & Location of Project:', 'Project 1': '' },
    { details: 'Scope of Contract:', 'Project 1': '' },
    { details: 'Built Up Area:', 'Project 1': '' },
    { details: 'Contract Duration:', 'Project 1': '' },
    { details: 'Contract Value:', 'Project 1': 0 },
    { details: 'Current Status:', 'Project 1': '' },
    { details: 'Employers Name & Address', 'Project 1': '' },
    { details: 'Referee’s Name', 'Project 1': '' },
    { details: 'Referee’s Position', 'Project 1': '' },
    { details: 'Contact details', 'Project 1': '' },
    { details: 'Remarks if any', 'Project 1': '' },
  ];
  onCellEditingStartedSimilarNature($event: any) {
    if ($event.colDef.field === 'details') {
      this.gridApiSimilarNature.stopEditing();
    }
  }

  //Section C of PQ-Form: Statutory Compliances
  public statutoryCompliancesColumnDefs: ColDef[] = [
    { headerName: 'Company Registration', field: 'details', editable: false, flex: 1 },
    { headerName: '', field: 'inDetail', editable: true, flex: 2 },
  ];
  public statutoryCompliancesDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public statutoryCompliancesRowData = [
    { details: 'ESI Registration / No of Employees:', inDetail: '', },
    { details: 'EPF Registration / No of Employees:', inDetail: '', },
    { details: 'GST Registration:', inDetail: '', },
    { details: 'PAN No:', inDetail: '', },
  ];

  //Section C of PQ-Form: Employees Strength
  public employeesStrengthColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', editable: true, flex: 2 },
    { headerName: 'Designation', field: 'designation', editable: true, flex: 2 },
    { headerName: 'Qualification', field: 'qualification', editable: true, flex: 2 },
    { headerName: 'Total Years of Experience', field: 'totalExp', cellEditor: NumericCellRendererComponent, editable: true, flex: 2 },
    { headerName: 'Years of Experience in the Present Position', field: 'totalExpPresent', cellEditor: NumericCellRendererComponent, editable: true, flex: 2 },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        if (this.btnsDisable) {
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
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
        }
        return divElement;
      },
    }
  ];
  public employeesStrengthDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
    cellEditor: true
  };
  public employeesStrengthRowData: any[] = [
    { name: '', designation: '', qualification: '', totalExp: '', totalExpPresent: '', },
  ];

  onGridReadyEmployeesStrength(params: GridReadyEvent) {
    this.gridApiEmployeesStrength = params.api;
    this.gridOptionsEmployeesStrength = params.columnApi;
  }
  onCellValueChangedEmployeesStrength(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiEmployeesStrength.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChangedEmployeesStrength(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApiEmployeesStrength.setRowData(this.employeesStrengthRowData);
    } else {
      const addDataItem = [event.node.data];
      this.gridApiEmployeesStrength.applyTransaction({ update: addDataItem });
    }
    this.gridApiEmployeesStrength.refreshCells();
  }
  onCellClickedEmployeesStrength(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        // console.log('add', params.node.rowIndex);
        const employeeStrengthNewRow = { 'name': '', 'designation': '', 'qualification': '', 'totalExp': '', 'totalExpPresent': '', };
        const employeeStrengthNewIndex = params.node.rowIndex + 1;
        this.gridApiEmployeesStrength.applyTransaction({
          add: [employeeStrengthNewRow],
          addIndex: employeeStrengthNewIndex
        });
        this.employeesStrengthRowData.splice(employeeStrengthNewIndex, 0, employeeStrengthNewRow);
        this.gridApiEmployeesStrength.setRowData(this.employeesStrengthRowData);
        this.gridApiEmployeesStrength.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }
      const rowLength = this.gridApiEmployeesStrength.getDisplayedRowCount();
      if (rowLength == 1) {
        this.toastr.error('Row cannot be deleted');
      }
      if (action === "delete" && (rowLength > 1)) {
        //console.log('delete');
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.employeesStrengthRowData.splice(params.rowIndex, 1);
      }
    }
  }

  //Section C of PQ-Form: Capital Equipments
  public capitalEquipmentsColumnDefs: ColDef[] = [
    { headerName: 'Description of Equipment', field: 'description', editable: true, flex: 2 },
    { headerName: 'Quantity', field: 'quantity', editable: true, cellEditor: NumericCellRendererComponent, flex: 2 },
    { headerName: 'Own / Rented', field: 'own_rented', editable: true, flex: 2 },
    { headerName: 'Capacity / Size', field: 'capacity_size', editable: true, flex: 2 },
    { headerName: 'Age / Condition', field: 'age_condition', editable: true, flex: 2 },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        if (this.btnsDisable) {
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
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
        }
        return divElement;
      },
    }
  ];
  public capitalEquipmentsDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public capitalEquipmentsRowData = [
    { description: '', quantity: '', own_rented: '', capacity_size: '', age_condition: '' },
  ];

  onGridReadyCapitalEquipments(params: GridReadyEvent) {
    this.gridApiCapitalEquipments = params.api;
    this.gridOptionsCapitalEquipments = params.columnApi;
  }
  onCellValueChangedCapitalEquipments(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiCapitalEquipments.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChangedCapitalEquipments(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApiCapitalEquipments.setRowData(this.capitalEquipmentsRowData);
    } else {
      const addDataItem = [event.node.data];
      this.gridApiCapitalEquipments.applyTransaction({ update: addDataItem });
    }
    this.gridApiCapitalEquipments.refreshCells();
  }
  onCellClickedCapitalEquipments(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        const capitalEquipmentsNewRow = { 'description': '', 'quantity': '', 'own_rented': '', 'capacity_size': '', 'age_condition': '' };
        const capitalEquipmentsNewIndex = params.node.rowIndex + 1;
        this.gridApiCapitalEquipments.applyTransaction({
          add: [capitalEquipmentsNewRow],
          addIndex: capitalEquipmentsNewIndex
        });
        this.capitalEquipmentsRowData.splice(capitalEquipmentsNewIndex, 0, capitalEquipmentsNewRow);
        this.gridApiCapitalEquipments.setRowData(this.capitalEquipmentsRowData);
        this.gridApiCapitalEquipments.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          //   // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }
      const rowLength = this.gridApiCapitalEquipments.getDisplayedRowCount();
      if (rowLength == 1) {
        this.toastr.error('Row cannot be deleted');
      }
      if (action === "delete" && (rowLength > 1)) {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.capitalEquipmentsRowData.splice(params.rowIndex, 1);
      }
    }
  }

  //Section C of PQ-Form: Saftey policy and Systems
  public safteyPolicyColumnDefs: ColDef[] = [
    { headerName: 'SI No', field: 'sNo', editable: false, flex: 1, minWidth: 50, },
    { headerName: 'Particulars', field: 'particulars', editable: false, flex: 6, minWidth: 250, wrapText: true },
    { headerName: 'Details', field: 'details', editable: true, flex: 8, minWidth: 300, wrapText: true },
  ];
  public safteyPolicyDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    resizable: true,
  };
  public safteyPolicyRowData = [
    { sNo: '1', particulars: 'Availability of Safety Policy or Manual', details: 'Refer enclosed Company Safety Policy & Plan', },
    { sNo: '2', particulars: 'PPEs provided to staff', details: '', },
    { sNo: '3', particulars: 'PPEs provided to workmen', details: '', },
    { sNo: '4', particulars: 'Availability of Safety Officer', details: '', },
  ];

  //Section D of PQ-Form: Financial Information
  public financialColumnDefs: ColDef[] = [
    { headerName: 'Year', field: 'f_year', editable: true, cellEditor: NumericCellRendererComponent, maxWidth: 100 },
    {
      headerName: 'Gross turnover Rs.', field: 'gross_turnover', editable: true, cellEditor: NumericCellRendererComponent, cellClass: 'ag-right-aligned-cell',
      valueFormatter: params => currencyFormatter(params.data.gross_turnover),
    },
    {
      headerName: 'Net Profit before tax Rs.', field: 'net_profit', editable: true, cellEditor: NumericCellRendererComponent, cellClass: 'ag-right-aligned-cell',
      valueFormatter: params => currencyFormatter(params.data.net_profit),
    },
    {
      headerName: 'Profit After Tax Rs.', field: 'profit_after_tax', editable: true, cellEditor: NumericCellRendererComponent, cellClass: 'ag-right-aligned-cell',
      valueFormatter: params => currencyFormatter(params.data.profit_after_tax),
    },
    {
      headerName: 'Current Assets Rs.', field: 'current_assets', editable: true, cellEditor: NumericCellRendererComponent, cellClass: 'ag-right-aligned-cell',
      valueFormatter: params => currencyFormatter(params.data.current_assets),
    },
    {
      headerName: 'Current Liabilities Rs.', field: 'current_liabilities', editable: true, cellEditor: NumericCellRendererComponent, cellClass: 'ag-right-aligned-cell',
      valueFormatter: params => currencyFormatter(params.data.current_liabilities),
    },
    {
      headerName: "Action", colId: "action", flex: 1, maxWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        if (this.btnsDisable) {
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
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
        }
        return divElement;
      },
    }
  ];
  public financialDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public financialDetails = [
    { f_year: '', gross_turnover: '', net_profit: '', profit_after_tax: '', current_assets: '', current_liabilities: '', },
  ];

  onGridReadyFinancialDetails(params: GridReadyEvent) {
    this.gridApiFinancialDetails = params.api;
    this.gridOptionsFinancialDetails = params.columnApi;
  }
  onCellValueChangedFinancialDetails(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiFinancialDetails.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChangedFinancialDetails(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApiFinancialDetails.setRowData(this.financialDetails);
    } else {
      const addDataItem = [event.node.data];
      this.gridApiFinancialDetails.applyTransaction({ update: addDataItem });
    }
    this.gridApiFinancialDetails.refreshCells();
  }
  onCellClickedFinancialDetails(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      const financialDetailsNewRow = { 'f_year': '', 'gross_turnover': '', 'net_profit': '', 'profit_after_tax': '', 'current_assets': '', 'current_liabilities': '' };
      const financialDetailsNewIndex = params.node.rowIndex + 1;
      if (action === "add") {
        this.gridApiFinancialDetails.applyTransaction({
          add: [financialDetailsNewRow],
          addIndex: financialDetailsNewIndex
        });
        this.financialDetails.splice(financialDetailsNewIndex, 0, financialDetailsNewRow);
        this.gridApiFinancialDetails.setRowData(this.financialDetails);
        this.gridApiFinancialDetails.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          //   // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }
      const rowLength = this.gridApiFinancialDetails.getDisplayedRowCount();
      if (rowLength == 1) {
        this.toastr.error('Row cannot be deleted');
      }
      if (action === "delete" && (rowLength > 1)) {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.financialDetails.splice(params.rowIndex, 1);
      }
    }
  }

  //Section D Company Bankers of PQ-Form
  public companyBankersColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', editable: true, flex: 3, minWidth: 250 },
    { headerName: 'Address', field: 'address', editable: true, flex: 6, minWidth: 350, wrapText: true },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        if (this.btnsDisable) {
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
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
        }
        return divElement;
      },
    }
  ];
  public companyBankersDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public companyBankersDetails = [
    { name: '', address: '', },
  ];

  onGridReadyCompanyBankersDetails(params: GridReadyEvent) {
    this.gridApiCompanyBankersDetails = params.api;
    this.gridOptionsCompanyBankersDetails = params.columnApi;
  }
  onCellValueChangedBankersDetails(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiCompanyBankersDetails.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChangedBankersDetails(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApiCompanyBankersDetails.setRowData(this.companyBankersDetails);
    } else {
      const addDataItem = [event.node.data];
      this.gridApiCompanyBankersDetails.applyTransaction({ update: addDataItem });
    }
    this.gridApiCompanyBankersDetails.refreshCells();
  }
  onCellClickedCompanyBankersDetails(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      const companyBankersNewRow = { 'name': '', 'address': '' };
      const companyBankersNewIndex = params.node.rowIndex + 1;
      if (action === "add") {
        this.gridApiCompanyBankersDetails.applyTransaction({
          add: [companyBankersNewRow],
          addIndex: companyBankersNewIndex
        });
        this.companyBankersDetails.splice(companyBankersNewIndex, 0, companyBankersNewRow);
        this.gridApiCompanyBankersDetails.setRowData(this.companyBankersDetails);
        this.gridApiCompanyBankersDetails.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          //   // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }
      const rowLength = this.gridApiCompanyBankersDetails.getDisplayedRowCount();
      if (rowLength == 1) {
        this.toastr.error('Row cannot be deleted');
      }
      if (action === "delete" && (rowLength > 1)) {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.companyBankersDetails.splice(params.rowIndex, 1);
      }
    }
  }

  //Section D Company Bankers of PQ-Form
  public companyAuditorsColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', editable: true, flex: 3, minWidth: 250 },
    { headerName: 'Address', field: 'address', editable: true, flex: 6, minWidth: 350, wrapText: true },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        if (this.btnsDisable) {
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
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
        }
        return divElement;
      },
    }
  ];
  public companyAuditorsDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public companyAuditorsDetails = [
    { name: '', address: '', },
  ];

  onGridReadyCompanyAuditorsDetails(params: GridReadyEvent) {
    this.gridApiCompanyAuditorsDetails = params.api;
    this.gridOptionsCompanyAuditorsDetails = params.columnApi;
  }
  onCellValueChangedCompanyAuditorsDetails(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiCompanyAuditorsDetails.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChangedCompanyAuditorsDetails(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApiCompanyAuditorsDetails.setRowData(this.companyAuditorsDetails);
    } else {
      const addDataItem = [event.node.data];
      this.gridApiCompanyAuditorsDetails.applyTransaction({ update: addDataItem });
    }
    this.gridApiCompanyAuditorsDetails.refreshCells();
  }
  onCellClickedCompanyAuditorsDetails(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      const companyAuditorsNewRow = { 'name': '', 'address': '' };
      const companyAuditorsNewIndex = params.node.rowIndex + 1;
      if (action === "add") {
        this.gridApiCompanyAuditorsDetails.applyTransaction({
          add: [],
          addIndex: params.node.rowIndex + 1
        });
        this.companyAuditorsDetails.splice(companyAuditorsNewIndex, 0, companyAuditorsNewRow);
        this.gridApiCompanyAuditorsDetails.setRowData(this.companyAuditorsDetails);
        this.gridApiCompanyAuditorsDetails.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          //   // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }
      const rowLength = this.gridApiCompanyAuditorsDetails.getDisplayedRowCount();
      if (rowLength == 1) {
        this.toastr.error('Row cannot be deleted');
      }
      if (action === "delete" && (rowLength > 1)) {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.companyAuditorsDetails.splice(params.rowIndex, 1);
      }
    }
  }

  public pqFormTenderId: any;
  public applicantPqFormId: any;
  public PQFormId: any;
  onSave() {
    this.applicantPqForm.controls['actionTaken'].setValue('DRAFT');
    this.applicantPqForm.controls['turnOverDetails'].setValue(this.turnoverDetails);
    // this.applicantPqForm.controls['similarProjects'].setValue(JSON.stringify(this.similarProjectsDetails));
    this.applicantPqForm.controls['employeesStrength'].setValue(this.employeesStrengthRowData);
    this.applicantPqForm.controls['capitalEquipment'].setValue(this.capitalEquipmentsRowData);
    this.applicantPqForm.controls['financialInformation'].setValue(this.financialDetails);
    this.applicantPqForm.controls['companyBankers'].setValue(this.companyBankersDetails);
    this.applicantPqForm.controls['companyAuditors'].setValue(this.companyAuditorsDetails);
    this.applicantPqForm.controls['clientReferences'].setValue(this.clientRefRowData);
    this.applicantPqForm.controls['similarProjectNature'].setValue(this.similarNatureRowData);
    if (this.applicantPqForm.value.yearOfEstablishment) {
      const dateTran = moment(this.applicantPqForm.value.yearOfEstablishment).format('YYYY');
      this.applicantPqForm.value.yearOfEstablishment = dateTran;
    } else {
      this.toastr.error('Please Select Valid Year of Establishment');
    }
    if (this.applicantPqFormId && this.applicantPqForm.valid) {
      //console.log('update form');
      this.ApiServicesService.updateApplicantPQForm(this.pqFormTenderId, this.applicantPqFormId, this.applicantPqForm.value).subscribe({
        next: ((response: applicantsPqFormResponse) => {
          //console.log(this.pqFormTenderId,this.applicantPqFormId);
          this.applicantPqForm.markAsPristine();
          this.router.navigate(['/tenders', this.pqFormTenderId, 'edit-tender-application-form', this.applicantPqFormId]);
          this.toastr.success('Successfully Updated');
        }),
        error: (error => {
          console.log(error);
        })
      })
    } else if (this.pqFormTenderId && this.applicantPqForm.valid) {
      this.ApiServicesService.createApplicantPQForm(this.pqFormTenderId, this.applicantPqForm.value).subscribe({
        next: ((response: applicantsPqFormResponse) => {
          this.applicantPqFormId = response.applicationId;
          // console.log(this.pqFormTenderId,this.applicantPqFormId);
          this.applicantPqForm.markAsPristine();
          this.router.navigate(['/tenders', this.pqFormTenderId, 'edit-tender-application-form', this.applicantPqFormId]);
          this.toastr.success('Successfully Created');
        }),
        error: (error => {
          console.log(error);
        })
      });
    } else {
      console.log('error');
      this.toastr.error('Error in Creation Applicant PQ Form');
    }
  }

  onSubmit() {
    this.applicantPqForm.controls['actionTaken'].setValue('SUBMIT');
    this.applicantPqForm.controls['turnOverDetails'].setValue(this.turnoverDetails);
    //this.applicantPqForm.controls['similarProjects'].setValue(JSON.stringify(this.similarProjectsDetails));
    this.applicantPqForm.controls['employeesStrength'].setValue(this.employeesStrengthRowData);
    this.applicantPqForm.controls['capitalEquipment'].setValue(this.capitalEquipmentsRowData);
    this.applicantPqForm.controls['financialInformation'].setValue(this.financialDetails);
    this.applicantPqForm.controls['companyBankers'].setValue(this.companyBankersDetails);
    this.applicantPqForm.controls['companyAuditors'].setValue(this.companyAuditorsDetails);
    this.applicantPqForm.controls['clientReferences'].setValue(this.clientRefRowData);
    this.applicantPqForm.controls['similarProjectNature'].setValue(this.similarNatureRowData);
    if (this.applicantPqForm.value.yearOfEstablishment) {
      const dateTran = moment(this.applicantPqForm.value.yearOfEstablishment).format('YYYY');
      this.applicantPqForm.value.yearOfEstablishment = dateTran;
    } else {
      this.toastr.error('Please Select Valid Year of Establishment');
    }
    if (this.applicantPqFormId && this.applicantPqForm.valid) {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: this.constantVariable.submitTenderApplicationTitle, msg: this.constantVariable.submitTenderApplicationMsg }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.ApiServicesService.updateApplicantPQForm(this.pqFormTenderId, this.applicantPqFormId, this.applicantPqForm.value).subscribe({
            next: ((response: applicantsPqFormResponse) => {
              this.applicantPqForm.controls['actionTaken'].setValue(response.actionTaken);
              this.tenderApplicantFormDisable();
              this.toastr.success('You successfully submitted your application. You will receive further steps if your application is shortlisted');
            }),
            error: (error => {
              console.log(error);
            })
          })
        }
      });
    } else {
      this.toastr.error('Error in Submitting Applicant PQ-Form');
    }
  }
  tenderApplicantFormDisable() {
    if (this.applicantPqForm.controls['actionTaken'].value == 'SUBMIT' || this.userRole?.includes('admin') || this.userRole?.includes('client')) {
      this.warningMessage = this.constantVariable.disabledWarningTenderApplicantMsg;
      this.btnstate = true;
      this.btnsDisable = true;
      this.applicantPqForm.disable();
      this.gridOptionsTurnover?.getColumns()?.forEach((colTurnover: any) => {
        colTurnover.colDef.editable = false;
      })
      this.columnApiClientRef?.getColumns()?.forEach((colClientRef: any) => {
        colClientRef.colDef.editable = false;
      })
      this.columnApiSimilarNature?.getColumns()?.forEach((colSimilarNature: any) => {
        colSimilarNature.colDef.editable = false;
      })
      this.gridOptionsEmployeesStrength?.getColumns()?.forEach((colEmployeesStrength: any) => {
        colEmployeesStrength.colDef.editable = false;
      })
      this.gridOptionsCapitalEquipments?.getColumns()?.forEach((colCapitalEquipments: any) => {
        colCapitalEquipments.colDef.editable = false;
      })
      this.gridOptionsFinancialDetails?.getColumns()?.forEach((colFinancialDetails: any) => {
        colFinancialDetails.colDef.editable = false;
      })
      this.gridOptionsCompanyBankersDetails?.getColumns()?.forEach((colCompanyBankers: any) => {
        colCompanyBankers.colDef.editable = false;
      })
      this.gridOptionsCompanyAuditorsDetails?.getColumns()?.forEach((colCompanyAuditors: any) => {
        colCompanyAuditors.colDef.editable = false;
      })
    }
  }

  //ESI file upload
  esiFile: any;
  esiFileName: any;
  isEsiFileUploaded = false;
  onEsiFileChange(event: any) {
    this.esiFileName = '';
    this.isEsiFileUploaded = true;
    if (event.target.files.length > 0) {
      this.esiFile = event.target.files[0];
    }
    else {
      this.esiFile = null;
    }
  }
  removeSelectedEsiFile(f: any) {
    if (f) {
      this.esiFile = null;
    }
  }
  downloadSelectedEsiFile(id: any) {
    
  }

  //EPF file upload
  epfFile: any;
  epfFileName: any;
  isEpfFileUploaded = false;
  onEpfFileChange(event: any) {
    this.epfFileName = '';
    this.isEpfFileUploaded = true;
    if (event.target.files.length > 0) {
      this.epfFile = event.target.files[0];
    }
    else {
      this.epfFile = null;
    }
  }
  removeSelectedEpfFile(f: any) {
    if (f) {
      this.epfFile = null;
    }
  }
  downloadSelectedEpfFile(id: any) {
    
  }

  //GST file upload
  gstFile: any;
  gstFileName: any;
  isGstFileUploaded = false;
  onGstFileChange(event: any) {
    this.gstFileName = '';
    this.isGstFileUploaded = true;
    if (event.target.files.length > 0) {
      this.gstFile = event.target.files[0];
    }
    else {
      this.gstFile = null;
    }
  }
  removeSelectedGstFile(f: any) {
    if (f) {
      this.gstFile = null;
    }
  }
  downloadSelectedGstFile(id: any) {
    
  }

  //PAN file upload
  panFile: any;
  panFileName: any;
  isPanFileUploaded = false;
  onPanFileChange(event: any) {
    this.panFileName = '';
    this.isPanFileUploaded = true;
    if (event.target.files.length > 0) {
      this.panFile = event.target.files[0];
    }
    else {
      this.panFile = null;
    }
  }
  removeSelectedPanFile(f: any) {
    if (f) {
      this.panFile = null;
    }
  }
  downloadSelectedPanFile(id: any) {
    
  }
}
//Indian currency formatter
function currencyFormatter(value: number) {
  const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-IN', { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  return formatter.format(value);
}
function cellEditorSelector(params: ICellEditorParams): CellEditorSelectorResult | undefined {
  const type = params.data.details;
  if (type === 'Contract Value:') {
    return {
      component: NumericCellRendererComponent,
    };
  }
  return undefined;
}
function valueFormat(params: ValueFormatterParams) {
  const type = params.data.details;
  if (type === 'Contract Value:') {
    return currencyFormatter(params.value);
  }
  else
    return params.value
}