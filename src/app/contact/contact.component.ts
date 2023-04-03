import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiServicesService } from '../shared/api-services.service';
import { PageConstants } from '../shared/application.constants';
import { ComponentCanDeactivate } from '../shared/can-deactivate/deactivate.guard';
import { applicationRoles, registrationMasterData } from '../shared/responses';
import { enquiryResopnse } from './enquiryResponse';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, ComponentCanDeactivate {
  contactUsForm!: FormGroup;
  public constVariable = PageConstants;
  applicationRoles = new Array<applicationRoles>();

  constructor(private _formBuilder: FormBuilder, private ApiServicesService: ApiServicesService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.contactUsForm = this._formBuilder.group({
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      applicationRole: [null, Validators.required],
      emailAddress: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      mobileNumber: [null, [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
      enquiryDescription: [null, [Validators.required, Validators.maxLength(250)]],
    });
    this.getMasterdata();
  }

  canDeactivate(): boolean {
    return this.contactUsForm.dirty;
  }

  getMasterdata() {
    this.ApiServicesService.getRegistrationMasterData().subscribe((data: registrationMasterData) => {
      this.applicationRoles = data.applicationRoles.filter(item => item.displayToAll === true);
    });
  }

  onSubmit() {
    if (this.contactUsForm.valid) {
      console.log(this.contactUsForm.value);
      this.ApiServicesService.enquiry(this.contactUsForm.value).subscribe({
        next: ((response: enquiryResopnse) => {
          this.contactUsForm.reset();
          Object.keys(this.contactUsForm.controls).forEach(key => {
            this.contactUsForm.get(key)?.setErrors(null);
          });
          this.toastr.success('Thank you for reaching us out, will get back to you as soon as possible');
        }),
        error: (error => {
          console.log(error);
        })
      })
    }
    else {
      console.log('Enquiry Form is invalid');
    }
  }

}
