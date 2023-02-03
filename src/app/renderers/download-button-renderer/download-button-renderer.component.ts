import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { PageConstants } from 'src/app/shared/application.constants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-download-button-renderer',
  templateUrl: './download-button-renderer.component.html',
  styleUrls: ['./download-button-renderer.component.scss']
})
export class DownloadButtonRendererComponent implements ICellRendererAngularComp {
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  private params: any;
  public label!: string;
  public financeLabel!: string;
  public rowData: any;
  public constantVariables = PageConstants;

  public userRole: string[] | undefined;
  constructor(private ngZone: NgZone, private router: Router, protected keycloak: KeycloakService,
    private dialog: MatDialog, private toastr: ToastrService, private ApiServicesService: ApiServicesService,) {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }
  }

  agInit(params: any): void {
    this.rowData = params.data;
    this.params = params;
    this.label = this.rowData.tenderDocument || null;
    if (this.rowData.tenderFinanceInfo) {
      this.financeLabel = 'Financial Bid'
    }
  }
  tenderTechnicalDownload() {
    this.ApiServicesService.downloadTenderBidInfoDocumentById(this.rowData.tenderId, this.rowData.applicationUserId).subscribe((response) => {
      this.ApiServicesService.downloadFile(response);
      this.toastr.success('File Downloaded successfully');
    });
  }

  tenderFinanceDownload(data: any) {
    const tenderFinanceModified = this.restructureObjectForSheet(data.tenderFinanceInfo);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tenderFinanceModified);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // /* save to file */  
    XLSX.writeFile(wb, 'export.xlsx');
  }
  restructureObjectForSheet(obj: any) {
    const uniqKeys = Array.from(new Set(obj.map((o: any) => Object.keys(o)).flat()));
    const unitKey = "Unit";
    const unitHeaders = uniqKeys.filter(k => k !== unitKey).concat(unitKey);
    const quantityKey = "Quantity";
    const quantityHeaders = unitHeaders.filter(k => k !== quantityKey).concat(quantityKey);
    const unitPriceKey = "Unit Price";
    const unitPriceHeaders = quantityHeaders.filter(k => k !== unitPriceKey).concat(unitPriceKey);
    const finalKey = "Total Price";
    const finalHeaders = unitPriceHeaders.filter(k => k !== finalKey).concat(finalKey);
    const modifiedJSON = obj.map((o: any) => {
      return finalHeaders.reduce((a: any, c: any) => { a[c] = o[c]; return a }, {});
    });
    return modifiedJSON;
  }

}
