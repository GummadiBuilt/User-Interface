import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { tenderResopnse } from 'src/app/tenders/tender/tenderResponse';
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
  public tenderId: string | null | undefined;
  public pqID!: number;
  public applicationFormId!: number;
  public applicationFormStatus!: string;
  @Input() tenderDetails!: FormGroup;
  @Input() adminPqForm!: FormGroup;
  private _tenderData: any;
  private _pqData: any;

  @Input() set tenderData(value: any) {
    this._tenderData = value;
  }
  get tenderData() {
    return this._tenderData;
  }

  @Input() set pqData(value: any) {
    this._pqData = value;
  }
  get pqData() {
    return this._pqData;
  }

  constructor(protected keycloak: KeycloakService, private toastr: ToastrService,
    public router: Router, private dialog: MatDialog, private route: ActivatedRoute,) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tenderId');
      this.tenderId = id;
    });
  }

  parentTenderData!: tenderResopnse;
  parentPqData!: any;
  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
      //console.log('user role', this.userRole);
    } catch (e) {
      this.toastr.error('Failed to load user details' + e);
    }

    this.parentTenderData = this.getTenderData(this.tenderData);
    if (this.parentTenderData) {
      this.pqID = this.parentTenderData.pqFormId;
      this.applicationFormId = this.parentTenderData.applicationFormId;
      this.applicationFormStatus = this.parentTenderData.applicationFormStatus;
    }

    this.parentPqData = this.getPqData(this.pqData);
    if (this.parentPqData) {
      this.pqID = this.parentPqData.id;
      this.applicationFormId = this.parentPqData.applicationFormId;
      this.applicationFormStatus = this.parentPqData.applicationFormStatus;
    }

    this.dropDownOptions();
  }

  getTenderData(data: any) {
    let tData = data;
    return tData;
  }

  getPqData(data: any) {
    let pqData = data;
    return pqData;
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
      if (this.applicationFormId === 0 && this.applicationFormStatus == null && this.tenderDetails?.get('workflowStep')?.value == "Under Process") {
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
