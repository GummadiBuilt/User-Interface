import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { ApiServicesService } from '../../shared/api-services.service';
import { pqFormResponse } from './pqformresponse';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDlgComponent } from 'src/app/shared/confirmation-dlg.component';
import { MatDialog } from '@angular/material/dialog';
import { ComponentCanDeactivate } from 'src/app/shared/can-deactivate/deactivate.guard';
import { PageConstants } from 'src/app/shared/application.constants';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-pq-form',
  templateUrl: './pq-form.component.html',
  styleUrls: ['./pq-form.component.scss'],
})
export class PQFormComponent implements OnInit, ComponentCanDeactivate {
  public adminPqForm!: FormGroup;
  public userRole: string[] | undefined;
  public domLayout: any;
  public pqFormTenderId: any;
  public pqFormId!: any;
  public pqDocumentIssueDate!: any;
  public btnState: boolean = false;
  public warningMessage!: string;
  public constVariable = PageConstants;
  public applyBtnLabel: string = this.constVariable.applyBtn;
  public applicationFormId: any;
  public tenderDate: any;
  public applicationFormStatus: any;
  public btnTenderApplnstate!: boolean;
  public disableMsg!: string;

  constructor(private toastr: ToastrService, protected keycloak: KeycloakService,
    private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService,
    private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.route.paramMap.subscribe(params => {
      const tenderId = params.get('tenderId');
      const pqId = params.get('pqId');
      this.pqFormTenderId = tenderId;
      if (tenderId && pqId) {
        this.ApiServicesService.getPQForm(tenderId, pqId).subscribe((data: pqFormResponse) => {
          this.tenderDate = moment(data.tenderSubmissionDate, 'DD/MM/YYYY');
          this.getPQForms(data);
          this.pqFormDisable();
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
    //Project Info (Admin)
    this.adminPqForm = this._formBuilder.group({
      pqLastDateOfSubmission: ['', [Validators.required]],
      tentativeDateOfAward: ['', [Validators.required]],
      scheduledCompletion: ['', Validators.required],
      workflowStep: ['']
    });

  }

  canDeactivate(): boolean {
    return this.adminPqForm.dirty;
  }

  getPQForms(data: any) {
    this.adminPqForm.get('pqLastDateOfSubmission')?.patchValue(data.pqLastDateOfSubmission);
    this.adminPqForm.get('tentativeDateOfAward')?.patchValue(data.tentativeDateOfAward);
    this.adminPqForm.get('scheduledCompletion')?.patchValue(data.scheduledCompletion);
    // this.pqFormTenderId = data.tenderId;
    if (data.id != 0) {
      this.pqFormId = data.id
    }
    if (data.pqDocumentIssueDate) {
      this.pqDocumentIssueDate = data.pqDocumentIssueDate;
    }
    this.applicationFormId = data.applicationFormId;
    this.applicationFormStatus = data.applicationFormStatus;

    if (this.applicationFormId != null && this.applicationFormStatus!='DRAFT') {
      this.applyBtnLabel = this.constVariable.viewBtn;
    } else if(this.applicationFormId != null && this.applicationFormStatus!='SUBMIT') {
      this.applyBtnLabel = this.constVariable.editBtn;
    } else{
      this.applyBtnLabel = this.constVariable.applyBtn;
    }
    if(this.applicationFormId == 0 && this.applicationFormStatus == null && data.workflowStep == "UNDER_PROCESS"){
      this.btnTenderApplnstate = true;
      this.disableMsg = this.constVariable.disabledMsgForTenderApplicant;
      this.applyBtnLabel = this.constVariable.applyBtn;
     }
  }
  dateConverstion(input: any) {
    if (input) {
      const date = moment(input).format('DD/MM/YYYY');
      return date;
    }
    return;
  }

  applyPqForm() {
    if (this.applyBtnLabel == 'Apply') {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: this.constVariable.applyTenderMsg, msg: '' }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.router.navigate(['/tenders', this.pqFormTenderId, 'view-pq-form', this.pqFormId, 'tender-application-form']);
        }
      });
    } else {
      if(this.applyBtnLabel == 'View'){
        this.router.navigate(['/tenders', this.pqFormTenderId, 'view-pq-form', this.pqFormId, 'view-tender-application-form', this.applicationFormId]);
      }else{
        this.router.navigate(['/tenders', this.pqFormTenderId, 'view-pq-form', this.pqFormId, 'edit-tender-application-form', this.applicationFormId]);
      }
      
    }
  }

  onSave() {
    //console.log(this.adminPqForm.value.scheduledCompletion);
    this.adminPqForm.controls['workflowStep'].setValue('YET_TO_BE_PUBLISHED');
    if (this.adminPqForm.value.pqLastDateOfSubmission) {
      this.adminPqForm.value.pqLastDateOfSubmission = this.dateConverstion(this.adminPqForm.value.pqLastDateOfSubmission);
    } else {
      this.toastr.error('Please Select Valid PQ Last Date of Submission');
    }
    if (this.adminPqForm.value.tentativeDateOfAward) {
      this.adminPqForm.value.tentativeDateOfAward = this.dateConverstion(this.adminPqForm.value.tentativeDateOfAward);
    } else {
      this.toastr.error('Please Select Valid Tentative Date of Award');
    }
    if (this.adminPqForm.value.scheduledCompletion) {
      this.adminPqForm.value.scheduledCompletion = this.dateConverstion(this.adminPqForm.value.scheduledCompletion);
    } else {
      this.toastr.error('Please Select Valid Scheduled Completion');
    }
    const tenderLastDate = moment(this.tenderDate)
    const now = moment();
    if (now > tenderLastDate) {
      this.toastr.error('Please change the tender submission date before creating the PQ-Form');
    } else if (this.pqFormId && this.adminPqForm.valid) {
      //console.log('update form');
      this.ApiServicesService.updatePQForm(this.pqFormTenderId, this.pqFormId, this.adminPqForm.value).subscribe({
        next: ((response: pqFormResponse) => {
          // console.log('update', response);
          this.toastr.success('Successfully Updated');
        }),
        error: (error => {
          console.log(error);
        })
      })
    } else if (this.pqFormTenderId && this.adminPqForm.valid) {
      this.ApiServicesService.createPQForm(this.pqFormTenderId, this.adminPqForm.value).subscribe({
        next: ((response: pqFormResponse) => {
          this.pqFormId = response.id;
          this.adminPqForm.markAsPristine();
          this.router.navigate(['/tenders', this.pqFormTenderId, 'edit-pq-form', this.pqFormId]);
          this.toastr.success('Successfully Created');
        }),
        error: (error => {
          console.log(error);
        })
      });
    } else {
      console.log('error');
      this.toastr.error('Error in Creation PQ Form');
    }
  }
  onSubmit() {
    const tenderLastDate = moment(this.tenderDate)
    const now = moment();
    if (now > tenderLastDate) {
      this.toastr.error('Please change the tender submission date before creating the PQ-Form');
    }else if (this.pqFormId && this.adminPqForm.valid) {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: this.constVariable.submitPQFormTitle, msg: this.constVariable.submitPQFormMsg }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.adminPqForm.controls['workflowStep'].setValue('PUBLISHED');
          if (this.adminPqForm.value.pqLastDateOfSubmission) {
            this.adminPqForm.value.pqLastDateOfSubmission = this.dateConverstion(this.adminPqForm.value.pqLastDateOfSubmission);
          } else {
            this.toastr.error('Please Select Valid PQ Last Date of Submission');
          }
          if (this.adminPqForm.value.tentativeDateOfAward) {
            this.adminPqForm.value.tentativeDateOfAward = this.dateConverstion(this.adminPqForm.value.tentativeDateOfAward);
          } else {
            this.toastr.error('Please Select Valid Tentative Date of Award');
          }
          if (this.adminPqForm.value.scheduledCompletion) {
            this.adminPqForm.value.scheduledCompletion = this.dateConverstion(this.adminPqForm.value.scheduledCompletion);
          } else {
            this.toastr.error('Please Select Valid Scheduled Completion');
          }
          //console.log('update form');
          this.ApiServicesService.updatePQForm(this.pqFormTenderId, this.pqFormId, this.adminPqForm.value).subscribe({
            next: ((response: pqFormResponse) => {
              // console.log('update', response);
              this.adminPqForm.controls['workflowStep'].setValue(response.workflowStep);
              this.pqDocumentIssueDate = response.pqDocumentIssueDate;
              this.pqFormDisable();
              this.toastr.success('Successfully Submitted');
            }),
            error: (error => {
              console.log(error);
            })
          })
        }
      });
    } else {
      //error
      console.log('error');
      this.toastr.error('Error in Submitting PQ-Form');
    }
  }
  pqFormDisable() {
    if (this.userRole?.includes("client") || this.userRole?.includes("contractor")) {
      this.btnState = true;
      this.adminPqForm.disable();
    } else if (this.userRole?.includes("admin") && (this.adminPqForm.get('workflowStep')?.value == 'PUBLISHED' ||
      this.pqDocumentIssueDate)) {
      this.adminPqForm.disable();
      this.btnState = true;
      this.warningMessage = this.constVariable.disabledWarningPQFormMsg;
    }
  }

}
