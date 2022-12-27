import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CellEditingStartedEvent, CellEditingStoppedEvent, CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, RowEditingStartedEvent, RowEditingStoppedEvent } from 'ag-grid-community';
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
export class TenderApplicationFormComponent implements OnInit {
  stepperOrientation!: Observable<StepperOrientation>;
  applicantPqForm!: FormGroup;
  public userRole: string[] | undefined;
  public domLayout: any;
  currentYear: number = new Date().getFullYear();
  years: any[] = [];
  public constantVariable = PageConstants;
  constructor(private toastr: ToastrService, protected keycloak: KeycloakService,
    private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService, private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog,private datePipe: DatePipe,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";

    //year range from past 20 years
    for (let i = (this.currentYear - 20); i < (this.currentYear + 1); i++) {
      this.years.push(i);
    }

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
      yearOfEstablishment:new FormControl(moment(),[Validators.required]),
      typeOfEstablishment: ['', [Validators.required,]],
      corpOfficeAddress: ['', Validators.maxLength(250)],
      localOfficeAddress: ['', Validators.maxLength(250)],
      telephoneNum: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      faxNumber: [''],
      contactName: ['', Validators.maxLength(50)],
      contactDesignation: ['', Validators.maxLength(50)],
      contactPhoneNum: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      contactEmailId: ['', [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      regionalHeadName: ['', Validators.maxLength(50)],
      regionalHeadPhoneNum: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],

      similarProjects: {},
      clientReferences: {},
      similarProjectNature: {},

      esiRegistration: ['', Validators.maxLength(50)],
      epfRegistration: ['', Validators.maxLength(50)],
      gstRegistration: ['', Validators.maxLength(50)],
      panNumber: ['', Validators.maxLength(50)],

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
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    
    const ctrlValue = this.applicantPqForm.controls['yearOfEstablishment'].value;
    ctrlValue?.year(normalizedYear.year());
    console.log(ctrlValue);
    this.applicantPqForm.get('yearOfEstablishment')?.patchValue(ctrlValue);
    datepicker.close();
    console.log(this.applicantPqForm.controls['yearOfEstablishment'].value);
  }

  getApplicantPQForms(data: any) {
    //console.log(data);
    this.applicantPqForm.get('companyName')?.patchValue(data.companyName);
    this.applicantPqForm.get('yearOfEstablishment')?.patchValue(data.yearOfEstablishment);
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
    if (Object.keys(data.similarProjects).length === 0) {
      this.similarProjectsDetails = [];
    } else {
      this.similarProjectsDetails = JSON.parse(data.similarProjects);
    }
    if (Object.keys(data.clientReferences).length === 0) {
      this.clientRefRowData = [];
    } else {
      this.clientRefRowData = JSON.parse(data.clientReferences);
    }
    if (Object.keys(data.similarProjectNature).length === 0) {
      this.similarNatureRowData = [];
    } else {
      this.similarNatureRowData = JSON.parse(data.similarProjectNature);
    }
    if (Object.keys(data.employeesStrength).length === 0) {
      this.employeesStrengthRowData = [];
    } else {
      this.employeesStrengthRowData = JSON.parse(data.employeesStrength);
    }
    if (Object.keys(data.capitalEquipment).length === 0) {
      this.capitalEquipmentsRowData = [];
    } else {
      this.capitalEquipmentsRowData = JSON.parse(data.capitalEquipment);
    }
    if (Object.keys(data.financialInformation).length === 0) {
      this.financialDetails = [];
    } else {
      this.financialDetails = JSON.parse(data.financialInformation);
    }
    if (Object.keys(data.companyBankers).length === 0) {
      this.companyBankersDetails = [];
    } else {
      this.companyBankersDetails = JSON.parse(data.companyBankers);
    }
    if (Object.keys(data.companyAuditors).length === 0) {
      this.companyAuditorsDetails = [];
    } else {
      this.companyAuditorsDetails = JSON.parse(data.companyAuditors);
    }

    if (data.applicationId != 0) {
      this.applicantPqFormId = data.applicationId
    }
  }

  //dates range
  minDate = new Date(1990, 0, 1);
  maxDate = new Date(2023, 0, 1);

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

  //Section B of PQ-Form: Turnover Details
  public turnoverColumnDefs: ColDef[] = [
    { headerName: 'Year', field: 'year', editable: true, flex: 4 },
    { headerName: 'Rs in Crores', field: 'rupees', editable: true, flex: 4 },
    {
      headerName: 'Remarks (Financial Statement for Reference)', field: 'remarks', editable: false, flex: 4,
      cellRenderer: UploadButtonRendererComponent,
      cellRendererParams: {
        context: this,
      },
    },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        divElement.innerHTML = `
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
        return divElement;
      },
    }
  ];
  public turnoverDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public turnoverDetails = [
    { year: '', rupees: '', remarks: '' },
  ];
  private gridApiTurnover!: GridApi;
  public gridOptionsTurnover!: any;

  onGridReadyTurnover(params: GridReadyEvent) {
    this.gridApiTurnover = params.api;
    this.gridOptionsTurnover = params.columnApi;
  }
  onCellClickedTurnover(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        console.log('add', params.node.rowIndex);
        this.gridApiTurnover.applyTransaction({
          add: [{ 'year': '', 'rupees': '', 'remarks': '' }],
          addIndex: params.node.rowIndex + 1
        });
        this.gridApiTurnover.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }
      if (action === "delete") {
        console.log('delete');
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.turnoverDetails.splice(params.rowIndex, 1);
      }
    }
  }
  onRowValueChangedTurnover(event: any) {
    this.gridApiTurnover.refreshCells();
  }
  //download Financial Reference Document
  // downloadRefDocument(data: any) {
  // }

  //Section B of PQ-Form: Similar Projects
  public similarProjectsColumnDefs: ColDef[] = [
    { headerName: 'SI No', field: 'sno', editable: true, flex: 1 },
    { headerName: 'Project Name', field: 'project_name', editable: true, flex: 4 },
    { headerName: 'Client Name', field: 'client_name', editable: true, flex: 4 },
    { headerName: 'Contract Value (Rs. in Crores)', field: 'contract_value', editable: true, flex: 4 },
    { headerName: 'Year of Execution', field: 'year_of_execution', editable: true, flex: 1 },
    { headerName: 'Scope of Contract', field: 'scope_of_contract', editable: true, flex: 4 },
    { headerName: 'Builtup Area (in Sqft)', field: 'builtup_area', editable: true, flex: 3 },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        const editingCells = params.api.getEditingCells();
        const isCurrentRowEditing = editingCells.some((cell: any) => {
          return cell.rowIndex === params.node.rowIndex;
        });
        divElement.innerHTML = `
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
        return divElement;
      },
    }
  ];
  public similarProjectsDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public similarProjectsDetails: any[] = [
    { sno: '', project_name: '', client_name: '', contract_value: '', year_of_execution: '', scope_of_contract: '', builtup_area: '' },
  ];
  private gridApiSimilarProjects!: GridApi;
  public gridOptionsSimilarProjects!: any;
  onGridReadySimilarProjects(params: GridReadyEvent) {
    this.gridApiSimilarProjects = params.api;
    this.gridOptionsSimilarProjects = params.columnApi;
  }
  onCellClickedSimilarProjects(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
       // console.log('add', params.node.rowIndex);
        const similarProjectsNewRow = { 'sno': '', 'project_name': '', 'client_name': '', 'contract_value': '', 'year_of_execution': '', 'scope_of_contract': '', 'builtup_area': '' };
        const similarProjectsNewIndex = params.node.rowIndex + 1;
        this.gridApiSimilarProjects.applyTransaction({
          add: [similarProjectsNewRow],
          addIndex: similarProjectsNewIndex
        });
        this.similarProjectsDetails.splice(similarProjectsNewIndex,0,similarProjectsNewRow);
        this.gridApiSimilarProjects.setRowData(this.similarProjectsDetails);
        this.gridApiSimilarProjects.startEditingCell({
          rowIndex: params.node.rowIndex + 1,
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }
      if (action === "delete") {
        console.log('delete');
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.similarProjectsDetails.splice(params.rowIndex, 1);
      }
    }
  }
  onBtStartEditingSimilarProjects() {
    this.gridApiSimilarProjects.setFocusedCell(1, 'SI No');
    this.gridApiSimilarProjects.startEditingCell({
      rowIndex: 1,
      colKey: 'SI No',
    });
  }
  onCellValueChangedSimilarProjects(event: CellValueChangedEvent) {
    const dataItem = [event.node.data];
    this.gridApiSimilarProjects.applyTransaction({
      update: dataItem,
    });
  }
  onRowValueChangedSimilarProjects(event: any) {
    var data = event.data;
    if (event.rowIndex == 0) {
      this.gridApiSimilarProjects.setRowData(this.similarProjectsDetails);
    } else {
      const addDataItem = [event.node.data];
      this.gridApiSimilarProjects.applyTransaction({ update: addDataItem });
      // this.gridApiSimilarProjects.forEachNode( (node) => {
      //   this.similarProjectsDetails.push(node.data);
      // });
    }
    this.gridApiSimilarProjects.refreshCells();
  }
  onCellEditingStoppedSimilarProjects(event: CellEditingStoppedEvent) {
    this.gridApiSimilarProjects.stopEditing();
  }
  onRowEditingStartedSimilarProjects(params: any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
  onRowEditingStoppedSimilarProjects(params: any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
    this.gridApiSimilarProjects.stopEditing();
  }

  //Section C of PQ-Form: Client References of 3 Major Projects
  public project = [{ headerName: 'Project 1', field: 'Project 1', editable: true, wrapText: true }];
  public projectInfoColumnDef: ColDef[] = [
    this.project[0]
  ]
  public clientRefColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },      
    this.projectInfoColumnDef[0]
  ];

  onBtIncludeProject2Columns() {
    const value = this.getColumnDefs();
   // console.log('main result value',value)
    this.gridApiClientRef.setColumnDefs(value);
   // console.log('columns', this.gridApiClientRef.getColumnDefs())
    this.gridApiSimilarNature.setColumnDefs(value);
  }

  private getColumnDefs() {
    const cols = this.columnApiClientRef.getColumns()!;
    const colDef = this.gridApiClientRef.getColumnDefs();
    this.project.forEach(item=>{
      item.headerName = 'Project '+colDef?.length,
      item.field = 'Project '+colDef?.length
    })
   // console.log('project ',this.project[0]);
    colDef?.push(this.project[0]);
    return JSON.parse(JSON.stringify(colDef));
  }

  gridApiClientRef!: GridApi;
  columnApiClientRef!: ColumnApi;
  btnstate!:boolean;
  onGridReadyClientRef(params: GridReadyEvent) {
    this.gridApiClientRef = params.api;
    this.columnApiClientRef = params.columnApi;
    //console.log('legth',this.columnApiClientRef.getColumns()?.length);
  }
  public clientRefDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public clientRefRowData = [
  { details: 'Name & Location of Project:', 'Project 1': '','Project 2': ''},
    { details: 'Scope of Contract:', 'Project 1': '','Project 2': ''},
    { details: 'Built Up Area:', 'Project 1': '' ,'Project 2': ''},
    { details: 'Contract Duration:', 'Project 1': '' ,'Project 2': ''},
    { details: 'Contract Value:', 'Project 1': '' ,'Project 2': ''},
    { details: 'Current Status (If completed date of completion):', 'Project 1': '','Project 2': '' },
    { details: 'Employers Name & Address', 'Project 1': '','Project 2': '' },
    { details: 'Referee’s Name', 'Project 1': '','Project 2': '' },
    { details: 'Referee’s Position', 'Project 1': '','Project 2': '' },
    { details: 'Contact details', 'Project 1': '','Project 2': '' },
    { details: 'Remarks if any', 'Project 1': '' ,'Project 2': ''},
  ];

  // onCellValueChanged(event: CellValueChangedEvent) {
  //   event.data.modified = true;
  //  // console.log(event.data);
  //   const gridData = this.getAllData();
  //   console.log(gridData);
  // }

  // getAllData() {
  //   //this.gridApiClientRef.forEachNode(node => (node.data)?this.clientRefRowData.push(node.data):'');
  //   return this.clientRefRowData;
  // }

  //Section C of PQ-Form: Projects of similar Nature
  public similarNatureColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    this.project[0]
  ];
  gridApiSimilarNature!: GridApi;
  onGridReadySimilarNature(params: GridReadyEvent) {
    this.gridApiSimilarNature = params.api;
  }
  public similarNatureDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public similarNatureRowData = [
    { details: 'Name & Location of Project:', 'Project 1': ''},
    { details: 'Scope of Contract:', 'Project 1': ''},
    { details: 'Built Up Area:', 'Project 1': ''},
    { details: 'Contract Duration:', 'Project 1': ''},
    { details: 'Contract Value:', 'Project 1': ''},
    { details: 'Current Status:', 'Project 1': ''},
    { details: 'Employers Name & Address', 'Project 1': ''},
    { details: 'Referee’s Name', 'Project 1': ''},
    { details: 'Referee’s Position', 'Project 1': ''},
    { details: 'Contact details', 'Project 1': ''},
    { details: 'Remarks if any', 'Project 1': ''},
  ];

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
    { headerName: 'Total Years of Experience', field: 'totalExp', editable: true, flex: 2 },
    { headerName: 'Years of Experience in the Present Position', field: 'totalExpPresent', editable: true, flex: 2 },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        divElement.innerHTML = `
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
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
  private gridApiEmployeesStrength!: GridApi;
  public gridOptionsEmployeesStrength!: any;
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
      if (action === "delete") {
        console.log('delete');
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
    { headerName: 'Quantity', field: 'quantity', editable: true, flex: 2 },
    { headerName: 'Own / Rented', field: 'own_rented', editable: true, flex: 2 },
    { headerName: 'Capacity / Size', field: 'capacity_size', editable: true, flex: 2 },
    { headerName: 'Age / Condition', field: 'age_condition', editable: true, flex: 2 },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        divElement.innerHTML = `
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
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
  private gridApiCapitalEquipments!: GridApi;
  public gridOptionsCapitalEquipments!: any;
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
      if (action === "delete") {
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
    { headerName: 'Financial Year', field: 'f_year', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Gross turnover Rs.', field: 'gross_turnover', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Net Profit before tax Rs.', field: 'net_profit', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Profit After Tax Rs.', field: 'profit_after_tax', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Current Assets Rs.', field: 'current_assets', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Current Liabilities Rs.', field: 'current_liabilities', editable: true, flex: 2, minWidth: 250 },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        divElement.innerHTML = `
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
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
  private gridApiFinancialDetails!: GridApi;
  public gridOptionsFinancialDetails!: any;
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
      if (action === "delete") {
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
        divElement.innerHTML = `
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
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
  private gridApiCompanyBankersDetails!: GridApi;
  public gridOptionsCompanyBankersDetails!: any;
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
      if (action === "delete") {
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
        divElement.innerHTML = `
          <button class="action-button add" data-action="add">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-plus" data-action="add"></i>
          </button>
          <button class="action-button delete" data-action="delete">
            <i style="font-size: 14px; padding-bottom: 4px; padding-top: 4px;" class="fa-solid fa-trash-can" data-action="delete"></i>
          </button>
          `;
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
  private gridApiCompanyAuditorsDetails!: GridApi;
  public gridOptionsCompanyAuditorsDetails!: any;
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
      const companyAuditorsNewRow ={ 'name': '', 'address': '' };
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
      if (action === "delete") {
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
    //console.log('year of esta',this.applicantPqForm.get('yearOfEstablishment')?.value);
    // console.log('clientRefRowData',this.clientRefRowData);
    // console.log('similarNatureRowData',this.similarNatureRowData);
    
    this.applicantPqForm.controls['actionTaken'].setValue('SAVE');
    if (this.applicantPqForm.value.yearOfEstablishment) {
      const dateTran = this.datePipe.transform(this.applicantPqForm.value.yearOfEstablishment, 'YYYY')
      this.applicantPqForm.get('yearOfEstablishment')?.setValue(dateTran);
      console.log(dateTran)
      console.log(this.applicantPqForm.value.yearOfEstablishment)
    } 
    //this.applicantPqForm.get('yearOfEstablishment')?.setValue(this.applicantPqForm.get('yearOfEstablishment')?.value.year());
    this.applicantPqForm.controls['similarProjects'].setValue(JSON.stringify(this.similarProjectsDetails));
    this.applicantPqForm.controls['employeesStrength'].setValue(JSON.stringify(this.employeesStrengthRowData));
    this.applicantPqForm.controls['capitalEquipment'].setValue(JSON.stringify(this.capitalEquipmentsRowData));
    this.applicantPqForm.controls['financialInformation'].setValue(JSON.stringify(this.financialDetails));
    this.applicantPqForm.controls['companyBankers'].setValue(JSON.stringify(this.companyBankersDetails));
    this.applicantPqForm.controls['companyAuditors'].setValue(JSON.stringify(this.companyAuditorsDetails));
    this.applicantPqForm.controls['clientReferences'].setValue(JSON.stringify(this.clientRefRowData));
    this.applicantPqForm.controls['similarProjectNature'].setValue(JSON.stringify(this.similarNatureRowData));
    
    if (this.applicantPqFormId && this.applicantPqForm.valid) {
      //console.log('update form');
      this.ApiServicesService.updateApplicantPQForm(this.pqFormTenderId, this.applicantPqFormId, this.applicantPqForm.value).subscribe({
        next: ((response: applicantsPqFormResponse) => {
          // console.log('update', response);
          this.router.navigate(['/tenders', this.pqFormTenderId,'view-pq-form',this.PQFormId,'edit-tender-application-form',this.applicantPqFormId]);
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
          console.log(response);
          this.router.navigate(['/tenders', this.pqFormTenderId,'view-pq-form',this.PQFormId,'edit-tender-application-form',this.applicantPqFormId]);
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
    if (this.applicantPqFormId && this.applicantPqForm.valid) {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: 'Are you sure you want to submit the Applicant PQ-Form?', msg: 'Submitting will disable further editing of PQ-Form' }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.ApiServicesService.updateApplicantPQForm(this.pqFormTenderId, this.applicantPqFormId, this.applicantPqForm.value).subscribe({
            next: ((response: applicantsPqFormResponse) => {
              this.applicantPqForm.controls['actionTaken'].setValue(response.actionTaken);
              this.toastr.success('Successfully Submitted');
            }),
            error: (error => {
              console.log(error);
            })
          })
        }
      });
    } else {
      console.log('error');
      this.toastr.error('Error in Submitting Applicant PQ-Form');
    }
  }
}