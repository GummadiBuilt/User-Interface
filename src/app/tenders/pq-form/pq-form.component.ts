import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { CellEditingStartedEvent, CellEditingStoppedEvent, ColDef, GridApi, GridReadyEvent, RowEditingStartedEvent, RowEditingStoppedEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { map, Observable } from 'rxjs';

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
  pqForm!: FormGroup;
  public userRole: string[] | undefined;
  public domLayout: any;

  constructor(protected keycloak: KeycloakService, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";
  }
  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }
    this.pqForm = this._formBuilder.group({
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
  }
  onSubmit() {
    console.log(this.pqForm.value);
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
  private gridApi!: GridApi;
  public editType: 'fullRow' = 'fullRow';
  //Section C of PQ-Form
  public columnDefs: ColDef[] = [
    { headerName: 'Details', field: 'details', editable: true },
    { headerName: 'Project 1', field: 'project1', editable: true },
    { headerName: 'Project 2', field: 'project2', editable: true },
    { headerName: 'Project 3', field: 'project3', editable: true },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 200,
    resizable: true,
  };
  public rowData = [
    { details: 'Name & Location of Project:', project1: '', project2: '', project3: '', },
    { details: 'Scope of Contract:', project1: '', project2: '', project3: '', },
    { details: 'Built Up Area:', project1: '', project2: '', project3: '', },
    { details: 'Contract Value:', project1: '', project2: '', project3: '', },
    { details: 'Current Status (If completed date of completion):', project1: '', project2: '', project3: '', },
    { details: 'Employers Name & Address', project1: '', project2: '', project3: '', },
    { details: 'Referee’s Name', project1: '', project2: '', project3: '', },
    { details: 'Referee’s Position', project1: '', project2: '', project3: '', },
    { details: 'Contact details', project1: '', project2: '', project3: '', },
    { details: 'Remarks if any', project1: '', project2: '', project3: '', },
  ];
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

  //Section D of PQ-Form
  public financialColumnDefs: ColDef[] = [
    { headerName: 'Financial Year', field: 'details', editable: true },
    {
      headerName: 'Gross turnover Rs.', field: 'turnover', editable: true,
      colSpan: (params) => {
        const turnover = params.data.turnover;
        if (turnover === 'Rs. In Lakhs') {
          return 5;
        } else {
          return 1;
        }
      },
      cellStyle: { textAlign: 'center' },
    },
    { headerName: 'Net Profit before tax Rs.', field: '', editable: true },
    { headerName: 'Profit After Tax Rs.', field: '', editable: true },
    { headerName: 'Current Assets Rs.', field: '', editable: true },
    { headerName: 'Current Liabilities Rs.', field: '', editable: true },
  ];
  public financialDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public financialDetails = [
    { details: '', turnover: 'Rs. In Lakhs', },
    { details: 'Year', turnover: '', },
    { details: 'Year', turnover: '', },
    { details: 'Year', turnover: '', },
  ];
  //Section D Company Bankers of PQ-Form
  public companyBankersColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'details', editable: true },
    { headerName: 'Address', field: '', editable: true },
  ];
  public companyBankersDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public companyBankersDetails = [
    { details: '', turnover: '', },
    { details: '', turnover: '', },
  ];
  //Section D Company Bankers of PQ-Form
  public companyAuditorsColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'details', editable: true },
    { headerName: 'Address', field: '', editable: true },
  ];
  public companyAuditorsDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public companyAuditorsDetails = [
    { details: '', turnover: '', },
    { details: '', turnover: '', },
  ];
}
