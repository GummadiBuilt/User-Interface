import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { forkJoin, map, mergeMap, reduce } from 'rxjs';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { ExcelService } from 'src/app/shared/excel.service';
import { applicantsPqFormResponse } from '../tender-application-form/applicantpqformresponse';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';
import { tenderApplicantRankingResopnse } from '../view-applicants/tenderApplicantRankingResopnse';

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
  public empStrengthsData: any;
  public capitalEquipData: any;
  public finInfoData: any;
  public compBankersData: any;
  public compAuditorsData: any;
  /* the table reference */
  @ViewChild('userTable') userTable!: ElementRef;

  constructor(private route: ActivatedRoute, private ApiServicesService: ApiServicesService,
    private excelService: ExcelService, private _formBuilder: FormBuilder, private toastr: ToastrService,
    protected keycloak: KeycloakService,) {
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
    let array = value.map((array: any, i: any) => {
      let resultArray = array.reduce((acc: any, item: any) => {
        const { details, project1, project2, project3 } = acc;
        if (item.hasOwnProperty('details')) {
          details.push(item.details);
        }
        if (item.hasOwnProperty('Project 1')) {
          project1.push(item['Project 1']);
        } else {
          project1.push(item['Project 1']);
        }
        if (item.hasOwnProperty('Project 2')) {
          project2.push(item['Project 2']);
        } else {
          project2.push(item['Project 2']);
        }
        if (item.hasOwnProperty('Project 3')) {
          project3.push(item['Project 3']);
        } else {
          project3.push(item['Project 3']);
        }
        return { details, project1, project2, project3 };
      },
        { details: [], project1: [], project2: [], project3: [] }
      );
      array = resultArray;
      return resultArray;
    });
    return array;
  }

  getApplicantsData(data: any) {
    this.applicantsData = data;
    // console.log(this.applicantsData);
    const clientRowData = this.applicantsData;
    let clientArr: any[] = [];
    let simArr: any[] = [];
    let empStrengthsArr: any[] = [];
    let capitalEquipArr: any[] = [];
    let finInfoArr: any[] = [];
    let compBankersArr: any[] = [];
    let compAuditorsArr: any[] = [];
    clientRowData.forEach((element: any) => {
      clientArr.push(JSON.parse(element.clientReferences));
      simArr.push(JSON.parse(element.similarProjectNature));
      empStrengthsArr.push(JSON.parse(element.employeesStrength));
      capitalEquipArr.push(JSON.parse(element.capitalEquipment));
      finInfoArr.push(JSON.parse(element.financialInformation));
      compBankersArr.push(JSON.parse(element.companyBankers));
      compAuditorsArr.push(JSON.parse(element.companyAuditors));
    });
    this.clientRefData = this.reduceArray(clientArr);
    this.projectSimilarData = this.reduceArray(simArr);
    this.empStrengthsData = empStrengthsArr;
    this.capitalEquipData = capitalEquipArr;
    this.finInfoData = finInfoArr;
    this.compBankersData = compBankersArr;
    this.compAuditorsData = compAuditorsArr;
  }

  applicantRankForm!: FormGroup;
  public userRole: string[] | undefined;

  ngOnInit(): void {
    try {
      this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
      //console.log('user role', this.userRole);
    } catch (e) {
      this.toastr.error('Failed to load user details' + e);
    }

    this.applicantRankForm = this._formBuilder.group({
      applicantRank: [''],
    });

    this.getTenderApplicantsRankingData();
  }

  applicantRankingData: any;
  getTenderApplicantsRankingData() {
    this.ApiServicesService.getTenderApplicantRanking(this.tenderId).subscribe((data: tenderApplicantRankingResopnse) => {
      this.applicantRankingData = data;
      console.log(this.applicantRankingData);
      this.editData(this.applicantRankingData);
      // this.applicantRankingData.forEach((item:any)=>{
      //   this.editData(item);
      // });
    });
  }
  editData(data: any) {
    console.log(data);
    if (data) {
      data.forEach((item: any) => {
        this.applicantRankForm?.get('applicantRank')?.patchValue(item.applicantRank);
      });
      // this.applicantRankForm?.get('applicantRank')?.patchValue(data.applicantRank);
    } else {
      this.toastr.error('No data to display');
    }
  }

  exportToExcel(event: any) {
    setTimeout(() => {
      this.excelService.exportAsExcelFile(this.userTable, 'compare.xlsx');
    }, 500)
  }

  statutoryCompliancesHeaders = ["ESI Registration", "EPF Registration", "GST Registration", "PAN Number",];
  safteyPolicyHeaders = ["Safety Policy Manual", "PPE to Staff", "PPE to Work Men", "Saftey Office Availability",];

  onUpdate() {
    console.log(this.applicantRankForm.value);
    // if (this.tenderId && this.applicantRankForm.valid && this.userRole?.includes('admin')) {
    //   this.ApiServicesService.updateTenderApplicantRanking(this.tenderId, this.applicantRankForm.value, 'DRAFT').subscribe({
    //     next: (response => {
    //       this.toastr.success('Rank Updated Successfully');
    //     }),
    //     error: (error => {
    //       console.log(error);
    //     })
    //   });
    // } else {
    //   //error
    //   console.log('error');
    //   this.toastr.error('Error in Updating Applicant Rank');
    // }
  }
}
