import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CellEditingStartedEvent, CellEditingStoppedEvent, ColDef, GridApi, GridOptions, GridReadyEvent, RowEditingStartedEvent, RowEditingStoppedEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import * as moment from 'moment';
import { Moment } from 'moment';
import { map, Observable } from 'rxjs';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { CreateTenderComponent } from '../create-tender/create-tender.component';
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
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-pq-form',
  templateUrl: './pq-form.component.html',
  styleUrls: ['./pq-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PQFormComponent implements OnInit {
  stepperOrientation!: Observable<StepperOrientation>;
  adminPqForm!: FormGroup;
  contractorPqForm!: FormGroup;
  public userRole: string[] | undefined;
  public domLayout: any;
  //to hide tender details
  @ViewChild(CreateTenderComponent) createTenderComponent!: CreateTenderComponent;

  constructor(private route: ActivatedRoute, private ApiServicesService: ApiServicesService, protected keycloak: KeycloakService, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";

    //to hide tender details
    if (this.userRole?.includes('admin')) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.ApiServicesService.getTendersDatabyId(id).subscribe((data: tenderResopnse) => {
            this.createTenderComponent.tenderDetails.disable();
            this.createTenderComponent.btnstate = true;
            this.createTenderComponent.gridOptions.getColumn('Item Description').getColDef().editable = false;
            this.createTenderComponent.gridOptions.getColumn('Unit').getColDef().editable = false;
            this.createTenderComponent.gridOptions.getColumn('Quantity').getColDef().editable = false;
            this.createTenderComponent.gridApi.refreshCells();
          });
        }
      });
    }

  }
  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }

    //Project Info
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

    //Vendor General Company info
    this.contractorPqForm = this._formBuilder.group({
      nameOfCompany: ['', [Validators.required, Validators.maxLength(50)]],
      yearOfEstablishment: ['', [Validators.required,]],
      typeOfEstablishment: ['', [Validators.required,]],
      postalAddressCorporate: [''],
      postalAddressLocal: [''],
      telephone: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      fax: [''],
      contactPerson: ['', Validators.maxLength(50)],
      contactPersonDesignation: ['', Validators.maxLength(50)],
      contactPersonMobile: ['', [Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactPersonEmail: ['', [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      turnover: [''],
      nameValueSimilarLargestProjectExecuted: [''],
      scopeOfContract: [''],
      builtUpArea: [''],
    });
  }
  onSubmit() {
    console.log(this.adminPqForm.value);
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

  //year picker
  date = new FormControl(moment());
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  chosenYearHandler(normalizedYear: Moment, yearPicker: any) {
    const ctrlValue = this.date.value;
    ctrlValue?.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    yearPicker.close();
  }

  //ag-grid
  private gridApi!: GridApi;
  public gridOptions!: any;
  public editType: 'fullRow' = 'fullRow';

  addRow() {
    console.log("a");
    var employeesStrengthRowData = {
      name: '', designation: '', qualification: '', totalExp: '', totalExpPresent: ''
    }
    this.gridOptions.api.addItems([employeesStrengthRowData]);
    this.gridOptions.api.refreshView();
  }
  //Section B of PQ-Form
  public turnoverColumnDefs: ColDef[] = [
    { headerName: 'Turnover Details: [Rs. In Lacs]', field: 'details', editable: true },
    { headerName: '', field: '', editable: true },
  ];
  public turnoverDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public turnoverDetails = [
    { details: 'Total Turnover - Rs.in Lakhs', turnover: '', },
    { details: '', turnover: '', },
    { details: '', turnover: '', },
  ];
  //Section C of PQ-Form: Client References of 3 Major Projects
  public clientRefColumnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: false },
    { headerName: 'Project 1', field: 'project1', editable: true, wrapText: true },
    { headerName: 'Project 2', field: 'project2', editable: true, wrapText: true },
    { headerName: 'Project 3', field: 'project3', editable: true, wrapText: true },
  ];
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
    { headerName: 'Project 2', field: 'project2', editable: true, wrapText: true },
    { headerName: 'Project 3', field: 'project3', editable: true, wrapText: true },
  ];
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
      headerName: "Action", flex: 1, minWidth: 150,
      cellRenderer: (params: any) => {
        const divElement = document.createElement("div");
        const editingCells = params.api.getEditingCells();
        // checks if the rowIndex matches in at least one of the editing cells
        const isCurrentRowEditing = editingCells.some((cell: any) => {
          return cell.rowIndex === params.node.rowIndex;
        });
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
      editable: false,
      colId: "action",
      filter: false
    }
  ];
  public employeesStrengthDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public employeesStrengthRowData: any[] = [
    { name: '', designation: '', qualification: '', totalExp: '', totalExpPresent: '', },
  ];

  //Section C of PQ-Form: Employees Strength
  public capitalEquipmentsColumnDefs: ColDef[] = [
    { headerName: 'Description of Equipment', field: 'description', editable: true, flex: 2 },
    { headerName: 'Quantity', field: 'quantity', editable: true, flex: 2 },
    { headerName: 'Own / Rented', field: 'own_rented', editable: true, flex: 2 },
    { headerName: 'Capacity / Size', field: 'capacity_size', editable: true, flex: 2 },
    { headerName: 'Age / Condition', field: 'age_condition', editable: true, flex: 2 },
    {
      headerName: "Action", flex: 1, minWidth: 150,
      cellRenderer: (params: any) => {
        const divElement = document.createElement("div");
        const editingCells = params.api.getEditingCells();
        // checks if the rowIndex matches in at least one of the editing cells
        const isCurrentRowEditing = editingCells.some((cell: any) => {
          return cell.rowIndex === params.node.rowIndex;
        });
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
      editable: false,
      colId: "action",
      filter: false
    }
  ];
  public capitalEquipmentsDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public capitalEquipmentsRowData = [
    { description: '', quantity: '', own_rented: '', capacity_size: '', age_condition: '', },
  ];

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
    { headerName: 'Financial Year', field: 'details', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Gross turnover Rs.', field: 'turnover', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Net Profit before tax Rs.', field: '', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Profit After Tax Rs.', field: '', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Current Assets Rs.', field: '', editable: true, flex: 2, minWidth: 250 },
    { headerName: 'Current Liabilities Rs.', field: '', editable: true, flex: 2, minWidth: 250 },
    {
      headerName: "Action", flex: 1, minWidth: 150,
      cellRenderer: (params: any) => {
        const divElement = document.createElement("div");
        const editingCells = params.api.getEditingCells();
        // checks if the rowIndex matches in at least one of the editing cells
        const isCurrentRowEditing = editingCells.some((cell: any) => {
          return cell.rowIndex === params.node.rowIndex;
        });
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
      editable: false,
      colId: "action",
      filter: false
    }
  ];
  public financialDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public financialDetails = [
    { details: '', turnover: '', },
  ];

  //Section D Company Bankers of PQ-Form
  public companyBankersColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'details', editable: true, flex: 3, minWidth: 250 },
    { headerName: 'Address', field: '', editable: true, flex: 6, minWidth: 350, wrapText: true },
    {
      headerName: "Action", flex: 1, minWidth: 150,
      cellRenderer: (params: any) => {
        const divElement = document.createElement("div");
        const editingCells = params.api.getEditingCells();
        // checks if the rowIndex matches in at least one of the editing cells
        const isCurrentRowEditing = editingCells.some((cell: any) => {
          return cell.rowIndex === params.node.rowIndex;
        });
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
      editable: false,
      colId: "action",
      filter: false
    }
  ];
  public companyBankersDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public companyBankersDetails = [
    { details: '', turnover: '', },
  ];

  //Section D Company Bankers of PQ-Form
  public companyAuditorsColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'details', editable: true, flex: 3, minWidth: 250 },
    { headerName: 'Address', field: '', editable: true, flex: 6, minWidth: 350, wrapText: true },
    {
      headerName: "Action", flex: 1, minWidth: 150,
      cellRenderer: (params: any) => {
        const divElement = document.createElement("div");
        const editingCells = params.api.getEditingCells();
        // checks if the rowIndex matches in at least one of the editing cells
        const isCurrentRowEditing = editingCells.some((cell: any) => {
          return cell.rowIndex === params.node.rowIndex;
        });
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
      editable: false,
      colId: "action",
      filter: false,
    }
  ];
  public companyAuditorsDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public companyAuditorsDetails = [
    { details: '', turnover: '', },
  ];
}
