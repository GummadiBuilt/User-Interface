import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../shared/api-services.service';

@Component({
  selector: 'app-action-button-renderer',
  templateUrl: './action-button-renderer.component.html',
  styleUrls: ['./action-button-renderer.component.scss']
})
export class ActionButtonRendererComponent implements ICellRendererAngularComp {

  constructor(private ApiServicesService: ApiServicesService, private toastr: ToastrService) { }
  refresh() {
    return false;
  }
  private params: any;
  public rowData: any;

  agInit(params: any): void {
    this.rowData = params.data;
    this.params = params;
  }

  approved(selectedData: any) {
    console.log(this.params.data.id);
    let selectedGridIds = this.params.data.id;
    this.params.context.onApproveSelected();
    // let selectedGridIds = this.params.data.id;
    // console.log(selectedGridIds);
    // return selectedGridIds;
  }
  rejected(data: any) {
    this.params.context.onRejectSelected();
  }
}
