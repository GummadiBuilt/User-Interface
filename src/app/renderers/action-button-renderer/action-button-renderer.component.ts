import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-button-renderer',
  templateUrl: './action-button-renderer.component.html',
  styleUrls: ['./action-button-renderer.component.scss']
})
export class ActionButtonRendererComponent implements ICellRendererAngularComp {

  constructor() { }
  refresh() {
    return false;
  }
  private params: any;
  public rowData: any;

  agInit(params: any): void {
    this.rowData = params.data;
    this.params = params;
  }

  //Approve in Pending Approvals
  approvedPendingApproval(selectedId: any) {
    selectedId = this.params.data.id;
    this.params.context.onApproveClicked(selectedId);
  }

 //Reject in Pending Approvals
  rejectedPendingApproval(selectedId: any) {
    selectedId = this.params.data.id;
    this.params.context.onApproveRejected(selectedId);
  }
}
