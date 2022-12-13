import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ApiServicesService } from '../../shared/api-services.service';
import { CreateTenderComponent } from '../create-tender/create-tender.component';
import { pqFormResponse } from './pqformresponse';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDlgComponent } from 'src/app/shared/confirmation-dlg.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-pq-form',
  templateUrl: './pq-form.component.html',
  styleUrls: ['./pq-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ],
})
export class PQFormComponent implements OnInit {
  stepperOrientation!: Observable<StepperOrientation>;
  adminPqForm!: FormGroup;

  safteyPolicyForm!: FormGroup;
  public userRole: string[] | undefined;
  public domLayout: any;
  @ViewChild(CreateTenderComponent) tender: any;
  pqformid: any;
  loading = false;
  tenderId: any;

  constructor(private toastr: ToastrService, protected keycloak: KeycloakService,
    private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService, private datePipe: DatePipe,
    private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tenderId = id;
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
      projectName: ['', Validators.required],
      workPackage: ['', [Validators.required, Validators.maxLength(50)]],
      typeOfStructure: ['', [Validators.required, Validators.maxLength(50)]],
      contractDuration: ['', [Validators.required, Validators.maxLength(5)]],
      durationCounter: ['', [Validators.required]],
      pqDocumentIssueDate: ['', [Validators.required]],
      pqLastDateOfSubmission: ['', [Validators.required]],
      tentativeDateOfAward: ['', [Validators.required]],
      scheduledCompletion: ['', Validators.required],
      workflowStep: ['']
    });
  }
  ngAfterViewInit() {
    this.pqformid = this.tender.tenderId;
    //console.log(this.pqformid)
    this.getPQForms(this.pqformid);
  }
  getPQForms(id: any) {
    // console.log('onload pqform');
    this.ApiServicesService.getPQForm(id).subscribe((data: pqFormResponse) => {
      console.log('Tender data by id', data);
    });
  }

  applyPqForm() {
    const dlg = this.dialog.open(ConfirmationDlgComponent, {
      data: { title: 'Are you sure you want to apply?', msg: '' }
    });
    dlg.afterClosed().subscribe((submit: boolean) => {
      this.router.navigate(['/tenders', this.tenderId, 'create-applicants-pq-form']);
    });
  }

  onSave() {
    console.log(this.adminPqForm.value);
    this.adminPqForm.controls['workflowStep'].setValue('SAVE');
    if (this.adminPqForm.value.pqDocumentIssueDate) {
      this.adminPqForm.value.pqDocumentIssueDate = this.datePipe.transform(this.adminPqForm.value.pqDocumentIssueDate, 'yyyy-MM-dd');
    } else {
      this.toastr.error('Please Select Valid PQ Document Issue Date');
    }
    if (this.adminPqForm.value.pqLastDateOfSubmission) {
      this.adminPqForm.value.pqLastDateOfSubmission = this.datePipe.transform(this.adminPqForm.value.pqLastDateOfSubmission, 'yyyy-MM-dd');
    } else {
      this.toastr.error('Please Select Valid PQ Last Date of Submission');
    }
    if (this.adminPqForm.value.tentativeDateOfAward) {
      this.adminPqForm.value.tentativeDateOfAward = this.datePipe.transform(this.adminPqForm.value.tentativeDateOfAward, 'yyyy-MM-dd');
    } else {
      this.toastr.error('Please Select Valid Tentative Date of Award');
    }
    if (this.adminPqForm.value.scheduledCompletion) {
      this.adminPqForm.value.scheduledCompletion = this.datePipe.transform(this.adminPqForm.value.scheduledCompletion, 'yyyy-MM-dd');
    } else {
      this.toastr.error('Please Select Valid Scheduled Completion');
    }

    this.loading = true;
    if (this.tenderId && this.adminPqForm.valid) {
      this.ApiServicesService.createPQForm(this.tenderId, this.adminPqForm.value).subscribe(
        (response: any) => {
          this.toastr.success('Successfully Created');
        },
        error => {
          console.log(error);
        }
      );
    }
    else {
      console.log('error');
      this.toastr.error('Error in Creation PQ Form');
    }
  }
  onSubmit() {
    console.log(this.adminPqForm.value);
  }

}
