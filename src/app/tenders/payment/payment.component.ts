import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { PageConstants } from 'src/app/shared/application.constants';
import { clientContractors } from './clientContractors';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentDetails!: FormGroup;
  public constantVariable = PageConstants;
  public userRole: string[] | undefined;
  public rowData: any;
  public domLayout: any;
  public constVariable = PageConstants;
  tenderId: any;
  clientContractors = new Array<clientContractors>();
  clientContractorsList = new Array<clientContractors>();

  constructor(private _formBuilder: FormBuilder, protected keycloak: KeycloakService,
    private ApiServicesService: ApiServicesService, private route: ActivatedRoute,) {
    this.domLayout = "autoHeight";
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
    });
  }

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }
    this.paymentDetails = this._formBuilder.group({
      roleId: ['', Validators.required],
      contactName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactEmailAddress: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      paymentAmount: ['', [Validators.required, Validators.min(100)]],
      paymentDescription: ['', [Validators.required]],
      notifyViaEmail: true,
      notifyViaSms: true
    });
    this.getTendersMasterData();
  }
  getTendersMasterData() {
    this.ApiServicesService.getClientContractors(this.tenderId).subscribe((data: any) => {
      console.log(data);
      this.clientContractors = data;
      this.clientContractorsList = this.clientContractors.slice();
    });
  }

  onSelectValueChange() {
    const valueSelected = this.paymentDetails.get('roleId')?.value;
    console.log(valueSelected);
  }
  // Each Column Definition results in one Column.
  public gridApi!: GridApi;
  public gridOptions!: any;
  public columnDefs: ColDef[] = [
    { headerName: 'Tender ID', field: 'tender_id', flex: 1, filter: 'agTextColumnFilter', pinned: 'left' },
    { headerName: 'Transaction Id', field: 'last_date_of_submission', flex: 1, filter: 'agDateColumnFilter' },
    { headerName: 'Status', field: 'workflow_step', flex: 1, filter: 'agTextColumnFilter' },
  ];

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    minWidth: 200,
    resizable: true,
    menuTabs: ['filterMenuTab'],
    filter: true,
    floatingFilter: true,
  };
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ['filters'],
  };
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
  }

  onSave() {

  }

  onSubmit() {
    console.log(this.paymentDetails.value);
    this.ApiServicesService.generatePaymentLink(this.tenderId, this.paymentDetails.value).subscribe({
      next: ((response) => {
        console.log(response);
      }),
      error: (error => {
        console.log(error);
      })
    })
  }
}
