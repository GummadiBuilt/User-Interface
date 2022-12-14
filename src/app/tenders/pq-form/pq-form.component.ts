import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
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
import { MatStepper } from '@angular/material/stepper';
import { PageEvent } from '@angular/material/paginator';
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
  pqFormTenderId: any;
  pqFormId!: any;
  pqdurationList!: any;
  loading = false;
  tenderId: any;
  @ViewChild('stepper') stepper!: MatStepper;

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
    this.getCommonOptions();
    this.pqFormDisable();
  }

  //append step state to url from mat-stepper
  // selectionChange(event: StepperSelectionEvent): void {
  //   console.log(event.selectedStep.state);
  //   console.log(this.router.url + '#' + event.selectedStep.state);

  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: {
  //       step: event.selectedStep.state
  //     },
  //     queryParamsHandling: 'merge',
  //     // skipLocationChange: true,
  //   });
  // }

  ngAfterViewInit() {
    this.pqFormTenderId = this.tender.tenderId;
    //console.log(this.pqformid)
    this.getPQForms(this.pqFormTenderId);

    //default step is 2 for contractor
    if (this.userRole?.includes('contractor') || this.userRole?.includes('client')) {
      setTimeout(() => {
        this.stepper.selectedIndex = 1;
      });
    }
  }

  getCommonOptions() {
    this.pqdurationList = [{ id: "MONTHS", text: "MONTHS" }, { id: "DAYS", text: "DAYS" }];
  }

  getPQForms(id: any) {
    // console.log('onload pqform');
    this.ApiServicesService.getPQForm(id).subscribe((data: pqFormResponse) => {
      // console.log('Tender data by id', data);
      this.adminPqForm.get('projectName')?.patchValue(data.projectName);
      this.adminPqForm.get('workPackage')?.patchValue(data.workPackage);
      this.adminPqForm.get('typeOfStructure')?.patchValue(data.typeOfStructure);
      this.adminPqForm.get('pqDocumentIssueDate')?.patchValue(this.dateConverstion(data.pqDocumentIssueDate));
      this.adminPqForm.get('pqLastDateOfSubmission')?.patchValue(this.dateConverstion(data.pqLastDateOfSubmission));
      this.adminPqForm.get('tentativeDateOfAward')?.patchValue(this.dateConverstion(data.tentativeDateOfAward));
      this.adminPqForm.get('scheduledCompletion')?.patchValue(this.dateConverstion(data.scheduledCompletion));
      this.adminPqForm.get('contractDuration')?.patchValue(data.contractDuration);
      this.adminPqForm.get('durationCounter')?.patchValue(data.durationCounter);
      if (data.id != 0) {
        this.pqFormId = data.id
      }
    });
  }
  dateConverstion(input: any) {
    if (input) {
      const date = input;
      const [day, month, year] = date.split('/');
      const convertedDate = new Date(+year, +month - 1, +day);
      return convertedDate;
    }
    return;
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
    this.adminPqForm.controls['workflowStep'].setValue('YET_TO_BE_PUBLISHED');
    if (this.adminPqForm.value.pqDocumentIssueDate) {
      this.adminPqForm.value.pqDocumentIssueDate = this.datePipe.transform(this.adminPqForm.value.pqDocumentIssueDate, 'dd/MM/yyyy');
    } else {
      this.toastr.error('Please Select Valid PQ Document Issue Date');
    }
    if (this.adminPqForm.value.pqLastDateOfSubmission) {
      this.adminPqForm.value.pqLastDateOfSubmission = this.datePipe.transform(this.adminPqForm.value.pqLastDateOfSubmission, 'dd/MM/yyyy');
    } else {
      this.toastr.error('Please Select Valid PQ Last Date of Submission');
    }
    if (this.adminPqForm.value.tentativeDateOfAward) {
      this.adminPqForm.value.tentativeDateOfAward = this.datePipe.transform(this.adminPqForm.value.tentativeDateOfAward, 'dd/MM/yyyy');
    } else {
      this.toastr.error('Please Select Valid Tentative Date of Award');
    }
    if (this.adminPqForm.value.scheduledCompletion) {
      this.adminPqForm.value.scheduledCompletion = this.datePipe.transform(this.adminPqForm.value.scheduledCompletion, 'dd/MM/yyyy');
    } else {
      this.toastr.error('Please Select Valid Scheduled Completion');
    }

    this.loading = true;
    //console.log(this.adminPqForm.value, this.pqFormId);
    if (this.pqFormId && this.adminPqForm.valid) {
      //console.log('update form');
      this.ApiServicesService.updatePQForm(this.tenderId, this.pqFormId, this.adminPqForm.value).subscribe({
        next: ((response: pqFormResponse) => {
          // console.log('update', response);
          this.toastr.success('Successfully Updated');
        }),
        error: (error => {
          console.log(error);
        })
      })
    } else if (this.tenderId && this.adminPqForm.valid) {
      this.ApiServicesService.createPQForm(this.tenderId, this.adminPqForm.value).subscribe({
        next: ((response: pqFormResponse) => {
          this.pqFormId = response.id;
          this.router.navigate(['tenders/' + this.tenderId + '/edit-pq-form/']);
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
    console.log(this.adminPqForm.value);
  }
  pqFormDisable() {
    if (this.userRole?.includes("client") || this.userRole?.includes("contractor")) {
      this.adminPqForm.disable();
    }
  }
}
