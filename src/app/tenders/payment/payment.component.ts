import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridApi, ColDef, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ButtonRendererComponent } from 'src/app/renderers/button-renderer/button-renderer.component';
import { PageConstants } from 'src/app/shared/application.constants';
import { StatusValues } from 'src/app/shared/status-values';

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

  constructor(private _formBuilder: FormBuilder, protected keycloak: KeycloakService,) {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }
    this.paymentDetails = this._formBuilder.group({
      contactName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      contactPhoneNumber: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      contactPaymentAmount: ['', [Validators.required]],
      contactPaymentdescription: ['', [Validators.required]]
    });
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
  getParams() {
    let columnsForExport = { columnKeys: [''] };
    const allColumns = this.gridOptions.getColumns();
    allColumns.forEach((element: { colId: string; }) => {
      if (this.userRole?.includes("client")) {
        if (element.colId != "company_name" && element.colId != "action") {
          columnsForExport.columnKeys.push(element.colId)
        }
      } else {
        if (element.colId != "action") {
          columnsForExport.columnKeys.push(element.colId)
        }
      }
    });
    //console.log(columnsForExport)
    return columnsForExport;
  }
  exportTendersFile() {
    this.gridApi.exportDataAsCsv(this.getParams());
  }

  onSave() {

  }

  onSubmit() {

  }
}
