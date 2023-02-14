import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { ExcelService } from 'src/app/shared/excel.service';
import { applicantsPqFormResponse } from '../tender-application-form/applicantpqformresponse';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';

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
  public tenderFinanceData: any;
  public tenderFinancePricesData: any;
  /* the table reference */
  @ViewChild('userTable') userTable!: ElementRef;
  isReadMore: boolean[]=[];


  showText(index:any) {
    this.isReadMore[index] = !this.isReadMore[index]
  }

  constructor(private route: ActivatedRoute, private ApiServicesService: ApiServicesService,
    private excelService: ExcelService, private _formBuilder: FormBuilder, private toastr: ToastrService,
    protected keycloak: KeycloakService,) {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
      this.applicationFormIds = params.get('applicationFormIds');
      const appIDArray = this.applicationFormIds.split(',');
      this.ApiServicesService.getTenderApplicantCompare(this.tenderId, appIDArray).subscribe((data: applicantsPqFormResponse) => {
        // console.log(data);
        this.getApplicantsData(data);
        this.editData(data);
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
    const clientRowData = this.applicantsData;
    let clientArr: any[] = [];
    let simArr: any[] = [];
    let empStrengthsArr: any[] = [];
    let capitalEquipArr: any[] = [];
    let finInfoArr: any[] = [];
    let compBankersArr: any[] = [];
    let compAuditorsArr: any[] = [];
    let tenderFinanceArr: any[] = [];
    let tenderFinancePricesArr: any[] = [];
    clientRowData.forEach((element: any) => {
      clientArr.push((typeof element.applicationFormDto?.clientReferences === 'string' ? JSON.parse(element.applicationFormDto?.clientReferences) : element.applicationFormDto?.clientReferences));
      simArr.push((typeof element.applicationFormDto?.similarProjectNature === 'string' ? JSON.parse(element.applicationFormDto?.similarProjectNature) : element.applicationFormDto?.similarProjectNature));
      empStrengthsArr.push((typeof element.applicationFormDto?.employeesStrength === 'string' ? JSON.parse(element.applicationFormDto?.employeesStrength) : element.applicationFormDto?.employeesStrength));
      capitalEquipArr.push((typeof element.applicationFormDto?.capitalEquipment === 'string' ? JSON.parse(element.applicationFormDto?.capitalEquipment) : element.applicationFormDto?.capitalEquipment));
      finInfoArr.push((typeof element.applicationFormDto?.financialInformation === 'string' ? JSON.parse(element.applicationFormDto?.financialInformation) : element.applicationFormDto?.financialInformation));
      compBankersArr.push((typeof element.applicationFormDto?.companyBankers === 'string' ? JSON.parse(element.applicationFormDto?.companyBankers) : element.applicationFormDto?.companyBankers));
      compAuditorsArr.push((typeof element.applicationFormDto?.companyAuditors === 'string' ? JSON.parse(element.applicationFormDto?.companyAuditors) : element.applicationFormDto?.companyAuditors));
      if(element.tenderDetailsDto){
        tenderFinanceArr.push((element.tenderDetailsDto?.tenderFinanceInfo));
        tenderFinancePricesArr.push((element.tenderDetailsDto?.tenderFinanceInfo));
      }else{
        tenderFinancePricesArr.push(this.assignNull());
      }
    });
    this.clientRefData = this.reduceArray(clientArr);
    this.projectSimilarData = this.reduceArray(simArr);
    this.empStrengthsData = empStrengthsArr;
    this.capitalEquipData = capitalEquipArr;
    this.finInfoData = finInfoArr;
    this.compBankersData = compBankersArr;
    this.compAuditorsData = compAuditorsArr;
    this.tenderFinanceData = tenderFinanceArr[0];
    this.tenderFinancePricesData = tenderFinancePricesArr;
    if(this.tenderFinanceData){
      this.tenderFinanceData.forEach((i:any)=>{
        this.isReadMore.push(true);
      })      
    }
    //console.log(this.applicantsData);
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
  }

  assignNull():any {
    const unit = [{'Unit Price':0,'Total Price': 0}];
    return unit;
  }

  editData(data: any) {
    // console.log(data);
    // let ranks = data.map((i: any) => i.tenderApplicantsDto.applicantRank);
    // console.log(ranks);
    // for (let i = 1; i <= ranks.length; i++) {
    //   this.applicantRankForm?.get('applicantRank')?.patchValue(i);
    // }
    if (data) {
      data.forEach((item: any) => {
        this.applicantRankForm?.get('applicantRank')?.patchValue(item.tenderApplicantsDto?.applicantRank);
      });
    } else {
      this.toastr.error('No data to display');
    }
    // this.applicantRankForm.patchValue({
    //   applicantRank: data.forEach((item: any) => {
    //     return item.tenderApplicantsDto?.applicantRank;
    //   }),
    // })
  }

  exportToExcel(event: any) {
    setTimeout(() => {
      this.excelService.exportAsExcelFile(this.userTable, 'compare.xlsx');
    }, 500)
  }

  statutoryCompliancesHeaders = ["ESI Registration", "EPF Registration", "GST Registration", "PAN Number",];
  safteyPolicyHeaders = ["Safety Policy Manual", "PPE to Staff", "PPE to Work Men", "Saftey Office Availability",];

  tenderTechnicalDownload(applicationUserId: any) {
    // console.log(applicationUserId);
    this.ApiServicesService.downloadTenderBidInfoDocumentById(this.tenderId, applicationUserId).subscribe((response) => {
      this.ApiServicesService.downloadFile(response);
      this.toastr.success('File Downloaded successfully');
    });
  }

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
