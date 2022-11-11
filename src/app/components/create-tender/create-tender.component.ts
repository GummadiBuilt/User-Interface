import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.component.html',
  styleUrls: ['./create-tender.component.scss']
})
export class CreateTenderComponent implements OnInit {
  tenderDetails!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.tenderDetails = this._formBuilder.group({
      type_of_work: ['', Validators.required],
      description_of_work: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      project_location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type_of_contract: ['', [Validators.required]],
      contract_duration: ['', [Validators.required]],
      date_of_submission: ['', [Validators.required]],
      budget: ['', [Validators.required]],
      technical_tender_form: [''],
    });
  }


  // file upload reference
  // https://stackblitz.com/edit/file-upload-drag-n-drop?file=src%2Fapp%2Fapp.component.ts

  public files: any[] = [];
  onFileChange(pFileList: any) {
    this.files = Object.keys(pFileList).map(key => pFileList[key]);
    this._snackBar.open("Successfully upload!", 'Close', {
      duration: 2000,
    });
  }

  deleteFile(f:any) {
    this.files = this.files.filter(function (w) { return w.name != f.name });
    this._snackBar.open("Successfully delete!", 'Close', {
      duration: 2000,
    });
  }

}
