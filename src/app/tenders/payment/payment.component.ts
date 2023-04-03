import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { PageConstants } from 'src/app/shared/application.constants';
import { ComponentCanDeactivate } from 'src/app/shared/can-deactivate/deactivate.guard';
import { applicationRole } from './clientContractors';
import { paymentResponse } from './paymentResponse';
import { CopyButtonRendererComponent } from 'src/app/renderers/copy-button-renderer/copy-button-renderer.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, ComponentCanDeactivate {

  paymentDetails!: FormGroup;
  public constantVariable = PageConstants;
  public userRole: string[] | undefined;
  public rowData: any;
  public domLayout: any;
  public constVariable = PageConstants;
  tenderId: any;
  clientContractors!: any;
  clientContractorsList!: any;
  private emailValidators = [
    Validators.required,
    Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
  ];
  private phoneValidators = [
    Validators.required,
    Validators.pattern("^[1-9][0-9]*$"),
    Validators.minLength(10),
    Validators.maxLength(10)
  ];
  submitted = false;
  constructor(private _formBuilder: FormBuilder, protected keycloak: KeycloakService,
    private ApiServicesService: ApiServicesService, private route: ActivatedRoute, private toastr: ToastrService,) {
    this.domLayout = "autoHeight";
    this.route.paramMap.subscribe(params => {
      const id = params.get('tenderId');
      this.tenderId = id;
      if (id) {
        this.ApiServicesService.getClientContractors(id).subscribe((data: paymentResponse) => {
          this.clientContractors = data;
          this.clientContractorsList = this.clientContractors.slice();
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
    this.paymentDetails = this._formBuilder.group({
      roleId: ['', Validators.required],
      contactName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactEmailAddress: ['', this.emailValidators],
      contactPhoneNumber: ['', this.phoneValidators],
      paymentAmount: ['', [Validators.required, Validators.min(100)]],
      paymentDescription: ['', [Validators.required]],
      notifyViaEmail: [false, Validators.requiredTrue],
      notifyViaSms: [false, Validators.requiredTrue]
    });
    this.paymentDetails.get('notifyViaEmail')?.valueChanges
      .subscribe(value => {
        if (value) {
          this.paymentDetails.get('contactEmailAddress')?.setValidators(this.emailValidators.concat(Validators.required))
          this.paymentDetails.get('contactEmailAddress')?.updateValueAndValidity();
        } else {
          this.paymentDetails.get('contactEmailAddress')?.setValidators(this.emailValidators);
          this.paymentDetails.get('contactEmailAddress')?.updateValueAndValidity();
        }
      });
    this.paymentDetails.get('notifyViaSms')?.valueChanges
      .subscribe(value => {
        if (value) {
          this.paymentDetails.get('contactPhoneNumber')?.setValidators(this.phoneValidators.concat(Validators.required));
          this.paymentDetails.get('contactPhoneNumber')?.updateValueAndValidity();
        } else {
          this.paymentDetails.get('contactPhoneNumber')?.setValidators(this.phoneValidators);
          this.paymentDetails.get('contactPhoneNumber')?.updateValueAndValidity();
        }
      });
  }

  canDeactivate(): boolean {
    return this.paymentDetails.dirty;
  }

  onSelectValueChange(event: any) {
    const index = event.value;
    const dataValue = this.clientContractors[index];
    this.paymentDetails.get('roleId')?.patchValue(dataValue.applicationRoleId);
    this.paymentDetails.get('contactName')?.patchValue(dataValue.contactName);
    this.paymentDetails.get('contactEmailAddress')?.patchValue(dataValue.contactEmailAddress);
    this.paymentDetails.get('contactPhoneNumber')?.patchValue(dataValue.contactPhoneNumber);
    this.paymentDetails.get('notifyViaSms')?.setValue(true);
    this.paymentDetails.get('notifyViaEmail')?.setValue(true);
    this.paymentDetails.get('paymentAmount')?.setValue(null);
    this.paymentDetails.get('paymentDescription')?.setValue(null);
  }
  // Each Column Definition results in one Column.
  public gridApi!: GridApi;
  public gridOptions!: any;
  public columnDefs: ColDef[] = [
    { headerName: 'Reference ID', field: 'referenceId', flex: 1, filter: 'agTextColumnFilter', pinned: 'left' },
    { headerName: 'Contact Name', field: 'contactName', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Phone Number', field: 'contactPhoneNumber', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Email Address', field: 'contactEmailAddress', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Application Role', field: 'applicationRole.roleName', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Payment ID', field: 'paymentId', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Payment Amount', field: 'paymentAmount', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Payment Description', field: 'paymentDescription', flex: 1, filter: 'agTextColumnFilter' },
    {
      headerName: 'Payment URL', field: 'shortUrl', flex: 1, filter: 'agTextColumnFilter',
      cellRenderer: CopyButtonRendererComponent, minWidth: 350
    },
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

  onSubmit() {
    this.submitted = true;
    // console.log(this.paymentDetails.value);
    this.paymentDetails.value.contactPhoneNumber = '+91' + this.paymentDetails.get('contactPhoneNumber')?.value;
    console.log(this.paymentDetails.value.contactPhoneNumber);
    if (this.paymentDetails.value.notifyViaEmail || this.paymentDetails.value.notifyViaSms) {
      this.ApiServicesService.generatePaymentLink(this.tenderId, this.paymentDetails.value).subscribe({
        next: ((response) => {
          this.rowData = response;
          this.paymentDetails.reset();
          Object.keys(this.paymentDetails.controls).forEach(key => {
            this.paymentDetails.get(key)?.setErrors(null);
          });
          this.toastr.success('Payment link sent successfully');
        }),
        error: (error => {
          console.log(error);
        })
      })
    }
  }
}
