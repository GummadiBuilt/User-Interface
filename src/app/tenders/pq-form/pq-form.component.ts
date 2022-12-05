import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CellEditingStartedEvent, CellEditingStoppedEvent, ColDef, GridApi, GridReadyEvent, RowEditingStartedEvent, RowEditingStoppedEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
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
  //to hide tender details
  @ViewChild(CreateTenderComponent) createTenderComponent!: CreateTenderComponent;

  constructor(private route: ActivatedRoute, private ApiServicesService: ApiServicesService, protected keycloak: KeycloakService, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";

    //to hide tender details
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
    { headerName: 'Details', field: 'details', editable: true },
    { headerName: 'Project 1', field: 'project1', editable: true },
    { headerName: 'Project 2', field: 'project2', editable: true },
    { headerName: 'Project 3', field: 'project3', editable: true },
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
    { headerName: 'Details', field: 'details', editable: true },
    { headerName: 'Project 1', field: 'project1', editable: true },
    { headerName: 'Project 2', field: 'project2', editable: true },
    { headerName: 'Project 3', field: 'project3', editable: true },
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
    { headerName: 'Company Registration', field: 'details', editable: true },
    { headerName: '', field: 'inDetail', editable: true },
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
    { headerName: 'SI No', field: 'sNo', editable: true },
    { headerName: 'Name', field: 'name', editable: true },
    { headerName: 'Designation', field: 'designation', editable: true },
    { headerName: 'Qualification', field: 'qualification', editable: true },
    { headerName: 'Total Years of Experience', field: 'totalExp', editable: true },
    { headerName: 'Years of Experience in the Present Position', field: 'totalExpPresent', editable: true },
  ];
  public employeesStrengthDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public employeesStrengthRowData = [
    { sNo: '1', name: '', designation: '', totalExp: '', totalExpPresent: '', },
    { sNo: '2', name: '', designation: '', totalExp: '', totalExpPresent: '', },
    { sNo: '3', name: '', designation: '', totalExp: '', totalExpPresent: '', },
    { sNo: '4', name: '', designation: '', totalExp: '', totalExpPresent: '', },
    { sNo: '5', name: '', designation: '', totalExp: '', totalExpPresent: '', },
    { sNo: '6', name: '', designation: '', totalExp: '', totalExpPresent: '', },
    { sNo: '7', name: '', designation: '', totalExp: '', totalExpPresent: '', },
  ];

  //Section C of PQ-Form: Employees Strength
  public capitalEquipmentsColumnDefs: ColDef[] = [
    { headerName: 'Description of Equipment', field: 'description', editable: true },
    { headerName: 'Quantity', field: 'quantity', editable: true },
    { headerName: 'Own / Rented', field: 'own_rented', editable: true },
    { headerName: 'Capacity / Size', field: 'capacity_size', editable: true },
    { headerName: 'Age / Condition', field: 'age_condition', editable: true },
  ];
  public capitalEquipmentsDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
    resizable: true,
  };
  public capitalEquipmentsRowData = [
    { description: '', quantity: '', own_rented: '', capacity_size: '', age_condition: '', },
    { description: '', quantity: '', own_rented: '', capacity_size: '', age_condition: '', },
  ];

  //Section C of PQ-Form: Saftey policy and Systems
  public safteyPolicyColumnDefs: ColDef[] = [
    { headerName: 'SI No', field: 'sNo', editable: true },
    { headerName: 'Particulars', field: 'particulars', editable: true },
    { headerName: 'Details', field: 'details', editable: true },
  ];
  public safteyPolicyDefaultColDef: ColDef = {
    flex: 1,
    editable: true,
    minWidth: 150,
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
