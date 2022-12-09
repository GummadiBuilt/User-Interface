import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CellEditingStartedEvent, CellEditingStoppedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, RowEditingStartedEvent, RowEditingStoppedEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pq-form',
  templateUrl: './pq-form.component.html',
  styleUrls: ['./pq-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ],
})
export class PQFormComponent implements OnInit {
  stepperOrientation!: Observable<StepperOrientation>;
  adminPqForm!: FormGroup;
  contractorPqForm!: FormGroup;
  safteyPolicyForm!: FormGroup;
  public userRole: string[] | undefined;
  public domLayout: any;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];

  constructor(private toastr: ToastrService, protected keycloak: KeycloakService,
    private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";

    for (let i = (this.currentYear - 20); i < (this.currentYear + 1); i++) {
      this.years.push(i);
    }

  }
  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }

    //Project Info (Admin)
    this.adminPqForm = this._formBuilder.group({
      nameOfProject: ['', Validators.required],
      nameOfWorkProject: ['', [Validators.required, Validators.maxLength(50)]],
      natureOfStructure: ['', [Validators.required, Validators.maxLength(50)]],
      projectDuration: ['', [Validators.required, Validators.maxLength(5)]],
      durationCounter: ['', [Validators.required]],
      dateOfIssueOfPqDocument: ['', [Validators.required]],
      lastDateOfSubmissionOfFilledPqDocument: ['', [Validators.required]],
      tentativeDateOfAwardOfWorks: ['', [Validators.required]],
      scheduledCompletion: ['', Validators.required],
    });

    //Vendor General Company info & etc (Contractor)
    this.contractorPqForm = this._formBuilder.group({
      nameOfCompany: ['', [Validators.required, Validators.maxLength(50)]],
      yearOfEstablishment: ['', [Validators.required,]],
      typeOfEstablishment: ['', [Validators.required,]],
      postalAddressCorporate: ['', Validators.maxLength(250)],
      postalAddressLocal: ['', Validators.maxLength(250)],
      telephone: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      fax: [''],
      contactPerson: ['', Validators.maxLength(50)],
      contactPersonDesignation: ['', Validators.maxLength(50)],
      contactPersonMobile: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      contactPersonEmail: ['', [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      nameOfRegionalHead: ['', Validators.maxLength(50)],
      regionalHeadMobile: ['', [Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      turnover: '',
      similarProjects: '',

      clientReferences: '',
      projectsSmilarNature: '',
      statutoryCompliances: '',
      employeeStrength: '',
      capitalEquipments: '',
      safteyPolicySystems: '',

      financialInfo: '',
      companyBankers: '',
      companyAuditors: '',
      undertaking: ['', Validators.required]
    });

  }
  //dates range
  minDate = new Date(1990, 0, 1);
  maxDate = new Date(2023, 0, 1);

  onSubmit() {
    console.log(this.adminPqForm.value);
    console.log(this.contractorPqForm.value.yearOfEstablishment);
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
  //file upload turnover
  public file: any;
  fileName: any;
  public isFileUploaded = false;
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
  //Section B of PQ-Form: Turnover Details
  public turnoverColumnDefs: ColDef[] = [
    { headerName: 'Year', field: 'year', editable: true, flex: 4 },
    { headerName: 'Rs in Crores', field: 'rupees', editable: true, flex: 4 },
    {
      headerName: 'Remarks (Financial Statement for Reference)', field: 'remarks', editable: false, flex: 4,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        divElement.innerHTML = `
          <div fxLayout="row wrap" fxLayoutAlign="start center" fxLayoutGap="12px">
            <label class="button-upload" for="file" fxLayout="row" fxLayoutAlign="center center"
              fxLayoutGap="8px" >
                <span class="material-icons">cloud_upload</span>
              </label>
              <label for="file">
                <input id="file" type="file" class="form-control" (change)="onFileChange($event)" hidden>
              </label>
              <label for="file">
                <span *ngIf="!file?.name && !fileName">No file Choosen</span>
                <span *ngIf="fileName" value="{{fileName}}"></span>
                <span [value]="file.name"></span>
              </label>
          </div>
        `;
        return divElement;
      },
    },
    {
      headerName: "Action", colId: "action", flex: 1, minWidth: 150, editable: false, filter: false,
      cellRenderer: (params: any) => {
        let divElement = document.createElement("div");
        divElement.innerHTML = `
          <button class="action-button add" type="button" data-action="add">
            <span style="font-size: 20px" class="material-icons" data-action="add">add</span>
          </button>
          <button class="action-button delete" type="button" data-action="delete">
            <span style="font-size: 20px" class="material-icons" data-action="delete">delete</span>
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

  //Section B of PQ-Form: Similar Projects
  public similarProjectsColumnDefs: ColDef[] = [
    { headerName: 'SNo', field: 'sno', editable: true, flex: 1 },
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
        divElement.innerHTML = `
          <button class="action-button add" type="button" data-action="add">
            <span style="font-size: 20px" class="material-icons" data-action="add">add</span>
          </button>
          <button class="action-button delete" type="button" data-action="delete">
            <span style="font-size: 20px" class="material-icons" data-action="delete">delete</span>
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
  public similarProjectsDetails = [
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
        console.log('add', params.node.rowIndex);
        this.gridApiSimilarProjects.applyTransaction({
          add: [{ 'sno': '', 'project_name': '', 'client_name': '', 'contract_value': '', 'year_of_execution': '', 'scope_of_contract': '', 'builtup_area': '' }],
          addIndex: params.node.rowIndex + 1
        });
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

  //Section C of PQ-Form: Client References of 3 Major Projects
  public clientRefColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    { headerName: 'Project 1', field: 'project1', editable: true, wrapText: true },
  ];
  public clientRefProject2ColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    { headerName: 'Project 1', field: 'project1', editable: true, wrapText: true },
    { headerName: 'Project 2', field: 'project2', editable: true, wrapText: true },
  ];
  public clientRefProject3ColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    { headerName: 'Project 1', field: 'project1', editable: true, wrapText: true },
    { headerName: 'Project 2', field: 'project2', editable: true, wrapText: true },
    { headerName: 'Project 3', field: 'project3', editable: true, wrapText: true },
  ];
  onBtExcludeProjectColumns() {
    this.gridApiClientRef.setColumnDefs(this.clientRefColumnDefs);
  }
  projectCount = 0;
  onBtIncludeProject2Columns() {
    console.log('Add Project');
    console.log(this.projectCount++);
    if (this.projectCount == 1) {
      this.gridApiClientRef.setColumnDefs(this.clientRefProject2ColumnDefs);
      this.gridApiSimilarNature.setColumnDefs(this.similarNatureProject2ColumnDefs);
    } else if (this.projectCount == 2) {
      this.gridApiClientRef.setColumnDefs(this.clientRefProject3ColumnDefs);
      this.gridApiSimilarNature.setColumnDefs(this.similarNatureProject3ColumnDefs);
    }
    else {
      this.toastr.warning("Only 3 Projects are allowed to add");
    }
  }
  gridApiClientRef!: GridApi;
  onGridReadyClientRef(params: GridReadyEvent) {
    this.gridApiClientRef = params.api;
  }
  public clientRefDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public clientRefRowData = [
    { details: 'Name & Location of Project:', project1: '', project2: '', project3: '', },
    { details: 'Scope of Contract:', project1: '', project2: '', project3: '', },
    { details: 'Built Up Area:', project1: '', project2: '', project3: '', },
    { details: 'Contract Duration:', project1: '', project2: '', project3: '', },
    { details: 'Contract Value:', project1: '', project2: '', project3: '', },
    { details: 'Current Status (If completed date of completion):', project1: '', project2: '', project3: '', },
    { details: 'Employers Name & Address', project1: '', project2: '', project3: '', },
    { details: 'Referee’s Name', project1: '', project2: '', project3: '', },
    { details: 'Referee’s Position', project1: '', project2: '', project3: '', },
    { details: 'Contact details', project1: '', project2: '', project3: '', },
    { details: 'Remarks if any', project1: '', project2: '', project3: '', },
  ];

  //Section C of PQ-Form: Projects of similar Nature
  public similarNatureColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    { headerName: 'Project 1', field: 'project1', editable: true, wrapText: true },
  ];
  public similarNatureProject2ColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    { headerName: 'Project 1', field: 'project1', editable: true, wrapText: true },
    { headerName: 'Project 2', field: 'project2', editable: true, wrapText: true },
  ];
  public similarNatureProject3ColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    { headerName: 'Project 1', field: 'project1', editable: true, wrapText: true },
    { headerName: 'Project 2', field: 'project2', editable: true, wrapText: true },
    { headerName: 'Project 3', field: 'project3', editable: true, wrapText: true },
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
    { details: 'Name & Location of Project:', project1: '', project2: '', project3: '', },
    { details: 'Scope of Contract:', project1: '', project2: '', project3: '', },
    { details: 'Built Up Area:', project1: '', project2: '', project3: '', },
    { details: 'Contract Duration:', project1: '', project2: '', project3: '', },
    { details: 'Contract Value:', project1: '', project2: '', project3: '', },
    { details: 'Current Status:', project1: '', project2: '', project3: '', },
    { details: 'Employers Name & Address', project1: '', project2: '', project3: '', },
    { details: 'Referee’s Name', project1: '', project2: '', project3: '', },
    { details: 'Referee’s Position', project1: '', project2: '', project3: '', },
    { details: 'Contact details', project1: '', project2: '', project3: '', },
    { details: 'Remarks if any', project1: '', project2: '', project3: '', },
  ];

  //Section C of PQ-Form: Statutory Compliances
  public statutoryCompliancesColumnDefs: ColDef[] = [
    { headerName: 'Company Registration', field: 'details', editable: true, flex: 1 },
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
            <span style="font-size: 20px" class="material-icons" data-action="add">add</span>
          </button>
          <button class="action-button delete" data-action="delete">
            <span style="font-size: 20px" class="material-icons" data-action="delete">delete</span>
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
  private gridApi!: GridApi;
  public gridOptions!: any;
  onGridReadyEmployeesStrength(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
  }
  onCellClickedEmployeesStrength(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        console.log('add', params.node.rowIndex);
        this.gridApi.applyTransaction({
          add: [{ 'name': '', 'designation': '', 'qualification': '', 'totalExp': '', 'totalExpPresent': '', }],
          addIndex: params.node.rowIndex + 1
        });
        this.gridApi.startEditingCell({
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
            <span style="font-size: 20px" class="material-icons" data-action="add">add</span>
          </button>
          <button class="action-button delete" data-action="delete">
            <span style="font-size: 20px" class="material-icons" data-action="delete">delete</span>
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
  onCellClickedCapitalEquipments(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        this.gridApiCapitalEquipments.applyTransaction({
          add: [{ 'description': '', 'quantity': '', 'own_rented': '', 'capacity_size': '', 'age_condition': '' }],
          addIndex: params.node.rowIndex + 1
        });
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
            <span style="font-size: 20px" class="material-icons" data-action="add">add</span>
          </button>
          <button class="action-button delete" data-action="delete">
            <span style="font-size: 20px" class="material-icons" data-action="delete">delete</span>
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
  onCellClickedFinancialDetails(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        this.gridApiFinancialDetails.applyTransaction({
          add: [{ 'f_year': '', 'gross_turnover': '', 'net_profit': '', 'profit_after_tax': '', 'current_assets': '', 'current_liabilities': '' }],
          addIndex: params.node.rowIndex + 1
        });
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
            <span style="font-size: 20px" class="material-icons" data-action="add">add</span>
          </button>
          <button class="action-button delete" data-action="delete">
            <span style="font-size: 20px" class="material-icons" data-action="delete">delete</span>
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
  onCellClickedCompanyBankersDetails(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        this.gridApiCompanyBankersDetails.applyTransaction({
          add: [{ 'name': '', 'address': '' }],
          addIndex: params.node.rowIndex + 1
        });
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
            <span style="font-size: 20px" class="material-icons" data-action="add">add</span>
          </button>
          <button class="action-button delete" data-action="delete">
            <span style="font-size: 20px" class="material-icons" data-action="delete">delete</span>
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
  onCellClickedCompanyAuditorsDetails(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (action === "add") {
        this.gridApiCompanyAuditorsDetails.applyTransaction({
          add: [{ 'name': '', 'address': '' }],
          addIndex: params.node.rowIndex + 1
        });
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
}
