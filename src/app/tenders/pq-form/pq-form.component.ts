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
  pqformid:any;
  constructor(private toastr: ToastrService, protected keycloak: KeycloakService,
    private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver,
    private ApiServicesService: ApiServicesService) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.domLayout = "autoHeight";
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
      workflowStep:['']
    });
  }
  ngAfterViewInit() {
    this.pqformid = this.tender.tenderId;
    //console.log(this.pqformid)
    this.getPQForms(this.pqformid);
  }
  getPQForms(id:any){
   // console.log('onload pqform');
    this.ApiServicesService.getPQForm(id).subscribe((data:pqFormResponse) => {
       console.log('Tender data by id', data);
    });
  }
  
  onSave() {
    console.log(this.adminPqForm.value);
  }
  onSubmit() {
    console.log(this.adminPqForm.value);
  }
  
}
