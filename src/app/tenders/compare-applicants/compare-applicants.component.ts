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

  getApplicantsData() {
    const selectedApplicantData: any[] = [];
    this.applicationFormIds = this.applicationFormIds.split(',');
    for (const value of this.applicationFormIds) {
      this.ApiServicesService.getApplicantPQForm(this.tenderId, value).subscribe((data: applicantsPqFormResponse) => {
        selectedApplicantData.push(data);
      });
    }
    this.rowData = selectedApplicantData;
    console.log(this.rowData);
  }

  ngOnInit(): void {
    // const shortName = this.userData?.contactFirstName.substring(0, 1) + this.userData?.contactLastName.substring(0, 1);
    // this.initials = shortName;

    this.getApplicantsData();
  }

  // userData = {
  //   companyName: "Abhi Constructions",
  //   yearOfEstablishment: 1991,
  //   typeOfEstablishment: null,
  //   address: "Hyderabad",
  //   contactFirstName: "Abhiram",
  //   contactLastName: "KVH",
  //   contactDesignation: "Lead Engineer",
  //   contactPhoneNumber: "9999999999",
  //   contactEmailAddress: "abhi@gmail.com",
  // }

}
