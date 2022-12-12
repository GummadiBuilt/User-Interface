import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-upload-button-renderer',
  templateUrl: './upload-button-renderer.component.html',
  styleUrls: ['./upload-button-renderer.component.scss']
})
export class UploadButtonRendererComponent implements ICellRendererAngularComp {

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

  public file: any;
  public isFileUploaded = false;
  fileName: any;

  //upload functionality in Vendor's General Company Information in PQ-Form
  onFileChange(event: any) {
    this.fileName = '';
    this.isFileUploaded = true;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
    else {
      this.file = null;
    }
  }

  removeSelectedFile(f: any) {
    if (f) {
      this.file = null;
    }
  }

  // btnDownloadDocument(data: any) {
  //   this.params.context.downloadRefDocument(data);
  // }

}
