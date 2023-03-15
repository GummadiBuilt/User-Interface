import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-copy-button-renderer',
  templateUrl: './copy-button-renderer.component.html',
  styleUrls: ['./copy-button-renderer.component.scss']
})
export class CopyButtonRendererComponent implements ICellRendererAngularComp {

  params!: ICellRendererParams;
  constructor(private clipboard: Clipboard, private toastr: ToastrService,) {

  }
  agInit(params: ICellRendererParams) {
    this.params = params;
  }

  refresh() {
    return false;
  }

  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
    this.toastr.success("Payment link copied to clipboard");
  }

}
