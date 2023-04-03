import { Component, Input, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { PageConstants } from 'src/app/shared/application.constants';
import { ConfirmationDlgComponent } from 'src/app/shared/confirmation-dlg.component';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  private params: any;
  public label!: string;
  public rowData: any;
  public constantVariables = PageConstants;
  public buttonLabel!: string;
  public applyBtnLabel!: string;
  public btnTenderApplnstate!: boolean;
  public disableMsg: string = '';

  agInit(params: any): void {
    this.rowData = params.data;
    this.params = params;
    this.label = this.rowData.tender_document_name || null;
    if (this.rowData.pq_id != null && this.rowData.workflow_step == 'YET_TO_BE_PUBLISHED') {
      this.buttonLabel = this.constantVariables.editPQFormBtn;
    } else if (this.rowData.pq_id != null) {
      this.buttonLabel = this.constantVariables.viewPQFormBtn;
    }
    else {
      this.buttonLabel = this.constantVariables.createPQFormBtn;
    }
    if (this.rowData.application_form_id != null && this.rowData.app_form_status != 'DRAFT') {
      this.applyBtnLabel = this.constantVariables.viewBtn;
    } else if (this.rowData.application_form_id != null && this.rowData.app_form_status != 'SUBMIT') {
      this.applyBtnLabel = this.constantVariables.editBtn;
    } else {
      this.applyBtnLabel = this.constantVariables.applyBtn;
    }
    if (this.applyBtnLabel == this.constantVariables.applyBtn && this.rowData.workflow_step == 'UNDER_PROCESS') {
      this.btnTenderApplnstate = true;
      this.disableMsg = this.constantVariables.disabledMsgForTenderApplicant;
    }
  }

  btnClickedHandler(data: any) {
    //console.log('medals won!',data);
    //this.params.clicked(this.params.value);
    this.params.context.downloadDocument(data);

  }

  refresh() {
    return false;
  }
  public userRole: string[] | undefined;
  constructor(private ngZone: NgZone, private router: Router, protected keycloak: KeycloakService,
    private dialog: MatDialog, private toastr: ToastrService,) {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
    } catch (e) {
      console.log('Failed to load user details', e);
    }
  }

  navigate(link: any) {
    this.ngZone.run(() => {
      this.router.navigate([link, this.params.value]);
    });
  }

  navigateToPQForm() {
    if (this.buttonLabel == this.constantVariables.editPQFormBtn) {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'edit-pq-form', this.rowData.pq_id]);
    } else if (this.buttonLabel == this.constantVariables.viewPQFormBtn) {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'view-pq-form', this.rowData.pq_id]);
    } else {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'create-pq-form']);
    }
  }
  viewPQForm() {
    if (this.rowData.pq_id != null) {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'view-pq-form', this.rowData.pq_id]);
    }
  }
  viewTenderApplicants() {
    if (this.rowData.tender_id != null) {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'view-applicants']);
    }
  }
  navigateToPayments(){
    if (this.rowData.tender_id != null) {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'payment']);
    }
  }
  applyTenderApplicantForm() {
    //console.log(this.rowData)
    if (this.applyBtnLabel == this.constantVariables.applyBtn && this.rowData.workflow_step != 'UNDER_PROCESS') {
      const dlg = this.dialog.open(ConfirmationDlgComponent, {
        data: { title: this.constantVariables.applyTenderMsg, msg: '' }
      });
      dlg.afterClosed().subscribe((submit: boolean) => {
        if (submit) {
          this.router.navigate(['/tenders', this.rowData.tender_id, 'tender-application-form']);
        }
      });
    } else {
      if (this.applyBtnLabel == this.constantVariables.viewBtn) {
        if (this.rowData.application_form_id) {
          this.router.navigate(['/tenders', this.rowData.tender_id, 'view-tender-application-form', this.rowData.application_form_id]);
        }
      } else {
        this.router.navigate(['/tenders', this.rowData.tender_id, 'edit-tender-application-form', this.rowData.application_form_id]);
      }
    }
  }
}
