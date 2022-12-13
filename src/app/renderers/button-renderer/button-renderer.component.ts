import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  private params: any;
  label!: string;
  public rowData: any;
  agInit(params: any): void {
    this.rowData = params.data;
    this.params = params;
    this.label = this.rowData.tender_document_name || null;
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
  constructor(private ngZone: NgZone, private router: Router, protected keycloak: KeycloakService,) {
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
    if (this.rowData.pq_id != null) {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'edit-pq-form']);
    } else {
      this.router.navigate(['/tenders', this.rowData.tender_id, 'create-pq-form']);
    }
  }
  // navigateToApplyPQForm() {
  //   this.router.navigate(['/tenders', this.rowData.tenderId, 'create-applicants-pq-form']);
  // }
  // navigateToApplicants(){
  //   this.router.navigate(['/tenders', this.rowData.tenderId, 'view-applicants']);
  // }
}
