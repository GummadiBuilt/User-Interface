import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService, toastPayload } from '../../shared/api-services.service';

@Component({
  selector: 'app-upload-button-renderer',
  templateUrl: './upload-button-renderer.component.html',
  styleUrls: ['./upload-button-renderer.component.scss']
})
export class UploadButtonRendererComponent implements ICellRendererAngularComp {
  fileUploadbtn: boolean = false;

  constructor(private ApiServicesService: ApiServicesService, private toastr: ToastrService,) { }

  refresh() {
    return false;
  }
  private params: any;
  public rowData: any;
  public file: any;
  public isFileUploaded: any;
  fileName: any;

  agInit(params: any): void {
    this.rowData = params.data;
    this.params = params;
    if(this.params.data.fileName){
      this.fileName = this.params.data.fileName;
    }
    //console.log(this.params.context.applicantPqForm.value.actionTaken)
    if(this.params.context.applicantPqForm.value.actionTaken == 'SUBMIT'){
      this.fileUploadbtn = true;
    }
  }

  //upload functionality in Vendor's General Company Information in PQ-Form
  onFileChange(event: any) {
   // console.log(this.rowData)
    this.fileName = '';
    this.isFileUploaded = true;
    const pqFormTenderId = this.params.context.pqFormTenderId;
    const applicantPqFormId = this.params.context.applicantPqFormId;
    let yearRow = this.params.data.row;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.params.data.fileName = event.target.files[0].name
    }
    else {
      this.file = null;
    }
    let formData = new FormData();
    const blob = new Blob();
    formData.append('yearDocument', this.file || blob);

    if (pqFormTenderId && applicantPqFormId && this.params.data.year) {
     // console.log('update form', formData);
      this.ApiServicesService.updateApplicantPQFormFile(pqFormTenderId, applicantPqFormId, yearRow, formData).subscribe({
        next: ((response) => {
          //console.log(response)
         // this.fileName = this.params.data.fileName;
          this.toastr.success('Successfully Updated');
        }),
        error: (error => {
          console.log(error);
        })
      })
    } else if (!applicantPqFormId || !this.params.data.year) {
      //error
      this.file = null;
      this.fileName = '';
      console.log('File upload error');
      this.toastr.error('Please save the form & row data before uploading file');
    } else {
      //error
      console.log('error');
      this.file = null;
      this.fileName = '';
      this.toastr.error('Please upload the file');
    }
  }

  removeSelectedFile(f: any) {
    if (f) {
      this.file = null;
      this.fileName = '';
      console.log(this.params.data.fileName)
    }
  }

  // btnDownloadDocument(data: any) {
  //   this.params.context.downloadRefDocument(data);
  // }

}
