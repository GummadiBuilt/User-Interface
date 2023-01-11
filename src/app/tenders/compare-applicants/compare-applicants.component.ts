import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { applicantsPqFormResponse } from '../tender-application-form/applicantpqformresponse';

@Component({
  selector: 'app-compare-applicants',
  templateUrl: './compare-applicants.component.html',
  styleUrls: ['./compare-applicants.component.scss']
})
export class CompareApplicantsComponent implements OnInit {
  tenderId: any;
  initials: any;
  applicationFormIds: any;
  rowData: any;
  constructor(private route: ActivatedRoute, private ApiServicesService: ApiServicesService,) {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
      this.applicationFormIds = params.get('applicationFormIds');
      console.log(this.applicationFormIds);
    });
  }

  clientRefData: any;
  getApplicantsData() {
    const selectedApplicantData: any[] = [];
    var clientReferencesData: any[] = [];
    this.applicationFormIds = this.applicationFormIds.split(',');
    for (const value of this.applicationFormIds) {
      this.ApiServicesService.getApplicantPQForm(this.tenderId, value).subscribe((data: applicantsPqFormResponse) => {
        selectedApplicantData.push(data);
        console.log(selectedApplicantData);
        console.log(data.clientReferences)
        clientReferencesData.push(data.clientReferences);
        console.log(clientReferencesData);
      });
    }
    this.rowData = selectedApplicantData;
    // console.log(this.rowData);
    // console.log(clientReferencesData);
  }

  ngOnInit(): void {
    this.getApplicantsData();
  }

  clientReferenceHeaders = ["Name & Location of Project", "Scope of Contract", "Built Up Area",
    "Contract Duration", "Contract Value", "Current Status", "Employers Name & Address", "Referee’s Name",
    "Referee’s Position", "Contact details", "Remarks if any"];

  statutoryCompliancesHeaders = ["ESI Registration", "EPF Registration", "GST Registration", "PAN Number",];

  employeeStrengthHeaders = ["Name", "Designation", "Qualification", "Total Years of Experience", "Years of Experience in the Present Position"];

  capitalEquipmentsHeaders = ["Description of Equipment", "Quantity", "Own / Rented", "Capacity / Size", "Age / Condition"];

  safteyPolicyHeaders = ["Safety Policy Manual", "PPE to Staff", "PPE to Work Men", "Saftey Office Availability",];

  financialInformationHeaders = ["Financial Year", "Gross Turnover Rs.", "Net Profit before Tax Rs.",
    "Profit after Tax Rs.", "Current Assets Rs.", "Current Liabilities RS."];

  companyBankersHeaders = ["Name", "Address",];

  companyAuditorsHeaders = ["Name", "Address",];

}
