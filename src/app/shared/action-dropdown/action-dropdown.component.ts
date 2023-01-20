import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { tenderResopnse } from 'src/app/tenders/tender/tenderResponse';
import { ApiServicesService } from '../api-services.service';
import { PageConstants } from '../application.constants';
import { ConfirmationDlgComponent } from '../confirmation-dlg.component';

@Component({
  selector: 'app-action-dropdown',
  templateUrl: './action-dropdown.component.html',
  styleUrls: ['./action-dropdown.component.scss']
})
export class ActionDropdownComponent implements OnInit {
  public constantVariable = PageConstants;
  public userRole: string[] | undefined;
  public applicantLabel!: any;
  public optionApplnState!: boolean;
  tenderDetails!: FormGroup;
  public tenderId: string | null | undefined;
  public pqID!: number;
  public applicationFormId!: number;
  public applicationFormStatus!: string;

  constructor(private _formBuilder: FormBuilder, protected keycloak: KeycloakService, private toastr: ToastrService,
    public router: Router, private dialog: MatDialog, private route: ActivatedRoute, private ApiServicesService: ApiServicesService,) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tenderId');
      this.tenderId = id;
      if (id) {
        this.ApiServicesService.getTendersDatabyId(id).subscribe((data: tenderResopnse) => {
          //console.log('Tender data by id', data);
          this.pqID = data.pqFormId;
          this.applicationFormId = data.applicationFormId;
          this.applicationFormStatus = data.applicationFormStatus;
          this.dropDownOptions();
        });
      }
    });
  }

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
      //console.log('user role', this.userRole);
    } catch (e) {
      this.toastr.error('Failed to load user details' + e);
    }
    this.tenderDetails = this._formBuilder.group({
      workflowStep: ['']
    });
  }

  dropDownOptions() {
    if (this.userRole?.includes('contractor')) {
      if (this.applicationFormId != 0 && this.applicationFormStatus === 'DRAFT') {
        this.applicantLabel = this.constantVariable.editBtn;
      } else if (this.applicationFormId != 0 && this.applicationFormStatus === 'SUBMIT') {
        this.applicantLabel = this.constantVariable.viewBtn;
      } else {
        this.applicantLabel = this.constantVariable.applyBtn;
      }
      if (this.applicationFormId === 0 && this.applicationFormStatus == null && this.tenderDetails.get('workflowStep')?.value == "Under Process") {
        this.optionApplnState = true;
        this.applicantLabel = this.constantVariable.applyBtn;
      }
    }
  }

  onSelected(event: any) {
    const value = event;
    const tender = this.tenderId;
    const pqForm = this.pqID;
    const applnTender = this.applicationFormId;
    if (value == 'PQForm') {
      if (this.pqID != (null || 0)) {
        this.router.navigate(['/tenders', tender, 'edit-pq-form', pqForm]);
      }
      else {
        this.router.navigate(['/tenders', tender, 'create-pq-form']);
      }
      return;
    }
    if (value == this.constantVariable.applyBtn && this.tenderDetails.get('workflowStep')?.value != 'UNDER_PROCESS') {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: this.constantVariable.applyTenderMsg, msg: '' }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.router.navigate(['/tenders', tender, 'tender-application-form']);
        }
      });

    } else {
      if (value == this.constantVariable.viewBtn) {
        if (this.applicationFormId) {
          this.router.navigate(['/tenders', tender, 'view-tender-application-form', applnTender]);
        }
      } else {
        this.router.navigate(['/tenders', tender, 'edit-tender-application-form', applnTender]);
      }
      return;
    }
  }

}
