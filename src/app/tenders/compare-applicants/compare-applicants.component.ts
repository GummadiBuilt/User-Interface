import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { forkJoin, map, mergeMap, reduce } from 'rxjs';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { applicantsPqFormResponse } from '../tender-application-form/applicantpqformresponse';

@Component({
  selector: 'app-compare-applicants',
  templateUrl: './compare-applicants.component.html',
  styleUrls: ['./compare-applicants.component.scss']
})
export class CompareApplicantsComponent implements OnInit {
  public tenderId: any;
  public initials: any;
  private applicationFormIds: any;
  public applicantsData: any;
  public clientRefData: any;
  public projectSimilarData: any;
  public employeeStrengthData: any;
  public employeeStrengthHeader:any;

  constructor(private route: ActivatedRoute, private ApiServicesService: ApiServicesService,) {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
      this.applicationFormIds = params.get('applicationFormIds');
      const appIDArray = this.applicationFormIds.split(',');
      this.ApiServicesService.getTenderApplicantCompare(this.tenderId, appIDArray).subscribe((data: applicantsPqFormResponse) => {
        this.getApplicantsData(data);
      });
    });
  }
  reduceArray(value: any) {
    let array = value.map((array: any,i:any) => {
      
      let resultArray = array.reduce((acc: any, item: any) => {
        
        const { details, project1, project2, project3 } = acc;
        if (item.hasOwnProperty('details')) {
          details.push(item.details);
        }
        if (item.hasOwnProperty('Project 1')) {
          project1.push(item['Project 1']);
        }
        if (item.hasOwnProperty('Project 2')) {
          project2.push(item['Project 2']);
        }
        if (item.hasOwnProperty('Project 3')) {
          project3.push(item['Project 3']);
        }
        return { details, project1, project2, project3 };
      },
        { details: [], project1: [], project2: [], project3: [] }
      );
       // array = resultArray;
        return resultArray;
    });
    return array;
  }
  reduceEmployeeArray(value:any){
    let empArray = value.map((eArray: any) => {
      let resultEmpArray = eArray.reduce((acc: any, item: any) => {
        const obj=Object.keys(item);
        this.employeeStrengthHeader = obj;
        const { name, designation, qualification, totalExp,totalExpPresent } = acc;
        if (item.hasOwnProperty('name')) {
          name.push(item.name);
        }
        if (item.hasOwnProperty('designation')) {
          designation.push(item.designation);
        }
        if (item.hasOwnProperty('qualification')) {
          qualification.push(item.qualification);
        }
        if (item.hasOwnProperty('totalExp')) {
          totalExp.push(item.totalExp);
        }
        if (item.hasOwnProperty('totalExpPresent')) {
          totalExpPresent.push(item.totalExpPresent);
        }
        return { name, designation, qualification, totalExp,totalExpPresent };
      },
        {name:[], designation:[], qualification:[], totalExp:[],totalExpPresent:[] }
      );
        return resultEmpArray;
        
    });
    return empArray;
  }

  getApplicantsData(data: any) {
    this.applicantsData = data;
    const clientRowData = this.applicantsData;
    let clientArr: any[] = [];
    let simArr: any[] = [];
    let employeeStrengthArr:any[]=[];
    clientRowData.forEach((element: any) => {
     // console.log(element)
      clientArr.push(JSON.parse(element.clientReferences));
      simArr.push(JSON.parse(element.similarProjectNature));
      employeeStrengthArr.push(JSON.parse(element.employeesStrength));
    });
    this.clientRefData = this.reduceArray(clientArr);
    this.projectSimilarData = this.reduceArray(simArr);
    this.employeeStrengthData = this.reduceEmployeeArray(employeeStrengthArr)

  }

  ngOnInit(): void {
    // this.getApplicantsData();
  }


  // clientReferenceHeaders = ["Name & Location of Project", "Scope of Contract", "Built Up Area",
  //   "Contract Duration", "Contract Value", "Current Status", "Employers Name & Address", "Referee’s Name",
  //   "Referee’s Position", "Contact details", "Remarks if any"];

  statutoryCompliancesHeaders = ["ESI Registration", "EPF Registration", "GST Registration", "PAN Number",];

  // employeeStrengthHeaders = ["Name", "Designation", "Qualification", "Total Years of Experience", "Years of Experience in the Present Position"];

  // capitalEquipmentsHeaders = ["Description of Equipment", "Quantity", "Own / Rented", "Capacity / Size", "Age / Condition"];

  safteyPolicyHeaders = ["Safety Policy Manual", "PPE to Staff", "PPE to Work Men", "Saftey Office Availability",];

  // financialInformationHeaders = ["Financial Year", "Gross Turnover Rs.", "Net Profit before Tax Rs.",
  //   "Profit after Tax Rs.", "Current Assets Rs.", "Current Liabilities RS."];

  // companyBankersHeaders = ["Name", "Address",];

  // companyAuditorsHeaders = ["Name", "Address",];

}