import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ApiServicesService } from 'src/app/shared/api-services.service';

@Component({
  selector: 'app-compare-applicants',
  templateUrl: './compare-applicants.component.html',
  styleUrls: ['./compare-applicants.component.scss']
})
export class CompareApplicantsComponent implements OnInit {
  tenderId: any;
  initials: any;

  constructor(private route: ActivatedRoute, private ApiServicesService: ApiServicesService,) {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
    });
  }

  ngOnInit(): void {
    const shortName = this.userData?.contactFirstName.substring(0, 1) + this.userData?.contactLastName.substring(0, 1);
    this.initials = shortName;
  }

  userData = {
    companyName: "Abhi Constructions",
    yearOfEstablishment: 1991,
    typeOfEstablishment: null,
    address: "Hyderabad",
    contactFirstName: "Abhiram",
    contactLastName: "KVH",
    contactDesignation: "Lead Engineer",
    contactPhoneNumber: "9999999999",
    contactEmailAddress: "abhi@gmail.com",
  }

}
