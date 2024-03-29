import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { registrationMasterData, registrationStatesData, registrationCitiesData } from './responses';
import { ErrorServiceService } from './error-service.service';
import { registrationApprovalResopnse } from '../commonservices/approvalsUserData';
import { KeycloakService } from 'keycloak-angular';
import { registrationAuditResopnse } from '../commonservices/auditUserData';
import { environment } from 'src/environments/environment';
import { tenderMasterData } from '../tenders/create-tender/createTender';
import { commonOptionsData } from './commonOptions';
import { tenderResopnse } from '../tenders/tender/tenderResponse';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { pqFormResponse } from '../tenders/pq-form/pqformresponse';
import { applicantsPqFormResponse } from '../tenders/tender-application-form/applicantpqformresponse';
import { clientUsersResponse } from './clientUsersResponse';
import { contractorUsersResponse } from './contractorUsersResponse';
import { userProfileResopnse } from '../profile/userProfileResponse';
import { appliedTenderResopnse } from '../tenders/applied-tenders/appliedTenderResponse';
import { tenderApplicantRankingResopnse } from '../tenders/view-applicants/tenderApplicantRankingResopnse';
import { enquiryResopnse } from '../contact/enquiryResponse';
import { paymentResponse } from '../tenders/payment/paymentResponse';
export interface toastPayload {
  message: string;
  title: string;
  ic: IndividualConfig;
  type: string;
}
@Injectable({
  providedIn: 'root'
})

export class ApiServicesService {
  public navigation = new Subject<any>();
  public navigation$ = this.navigation.asObservable();

  private url: string = environment.apiUrl;
  constructor(private httpClient: HttpClient, private errorService: ErrorServiceService, private kcService: KeycloakService,
    private toastr: ToastrService) {
    this.toastr.toastrConfig.enableHtml = true;
  }

  public getRegistrationMasterData(): Observable<registrationMasterData> {
    return this.httpClient.get<registrationMasterData>(this.url + '/registration-master-data');
  }
  public getRegistrationStatesData(id: string): Observable<registrationStatesData[]> {
    return this.httpClient.get<registrationStatesData[]>(this.url + '/geography/get-states?countryCode=' + id)
  }
  public getRegistrationCitiesData(id: number): Observable<registrationCitiesData[]> {
    return this.httpClient.get<registrationCitiesData[]>(this.url + '/geography/get-cities?stateCode=' + id)
  }
  //Save Registration postAPI
  public userRegistration(data: any) {
    return this.httpClient.post(this.url + '/user-registration', data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response"
    })
  }
  //pending approval getAPI
  public getRegistrationPendingApproval(): Observable<registrationApprovalResopnse> {
    return this.httpClient.get<registrationApprovalResopnse>(this.url + '/user-registration')
  }
  //pending approval postAPI
  public postRegistrationPendingApproval(id: any, data: any) {
    return this.httpClient.post(this.url + '/user-registration/approve-reject', data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response"
    })
  }
  //audit approval getAPI
  public getRegistrationAuditApproval(): Observable<registrationAuditResopnse> {
    return this.httpClient.get<registrationAuditResopnse>(this.url + '/user-registration/audit-info')
  }
  // Tender Master data GETApI
  public getTenderMasterData(): Observable<tenderMasterData> {
    return this.httpClient.get<tenderMasterData>(this.url + '/tender-master-data');
  }
  //Create Tender postAPI
  public createTender(data: any): Observable<tenderResopnse> {
    return this.httpClient.post<tenderResopnse>(this.url + '/tender', data);
  }
  //Update Tender putAPI
  public updateTender(id: any, data: any): Observable<tenderResopnse> {
    return this.httpClient.put<tenderResopnse>(this.url + '/tender/update/' + id, data);
  }
  // Tender data GETApI
  public getTenders(): Observable<tenderResopnse> {
    return this.httpClient.get<tenderResopnse>(this.url + '/tender/getAll');
  }

  // Applied Tender data GETApI
  public getAppliedTenders(): Observable<appliedTenderResopnse> {
    return this.httpClient.get<appliedTenderResopnse>(this.url + '/tender/applied-tenders');
  }

  // Tender data GETApI
  public getTendersDatabyId(id: any): Observable<tenderResopnse> {
    return this.httpClient.get<tenderResopnse>(this.url + '/tender/get/' + id);
  }

  //GET Common options for dropdowns and submit or save buttons
  public getCommonOptionsData(): Observable<commonOptionsData> {
    return this.httpClient.get<commonOptionsData>(this.url + '/common-options');
  }
  //Download Technical tender document and financial bid download
  public downloadTenderDocuments(tenderId: any, documentId:any, documentType:any) {
    return this.httpClient.get(this.url + '/tender/download/' + tenderId +'/id/'+ documentId + '/documentType/' + documentType);
  }
  //Delete financial bid documents 
  public deleteTenderDocuments(tenderId: any, documentId:any, data:any) {
    return this.httpClient.post(this.url + '/tender/' + tenderId +'/delete-document/'+ documentId,data);
  }
  //Get PQ Form by tender id
  public getPQForm(tenderId: any, pqId: any): Observable<pqFormResponse> {
    return this.httpClient.get<pqFormResponse>(this.url + '/tender/' + tenderId + '/pq-form/' + pqId);
  }
  //Create PQ Form postAPI
  public createPQForm(id: any, data: any): Observable<pqFormResponse> {
    return this.httpClient.post<pqFormResponse>(this.url + '/tender/' + id + '/pq-form', data);
  }
  //Update PQ Form postAPI
  public updatePQForm(id: any, pqID: any, data: any): Observable<pqFormResponse> {
    return this.httpClient.post<pqFormResponse>(this.url + '/tender/' + id + '/pq-form/update/' + pqID, data);
  }

  //Get Applicant PQ Form by tender id
  public getApplicantPQForm(tenderId: any, applicationId: any): Observable<applicantsPqFormResponse> {
    return this.httpClient.get<applicantsPqFormResponse>(this.url + '/tender/' + tenderId + '/application/' + applicationId);
  }
  //Create Applicant PQ Form postAPI
  public createApplicantPQForm(tenderId: any): Observable<applicantsPqFormResponse> {
    return this.httpClient.post<applicantsPqFormResponse>(this.url + '/tender/' + tenderId + '/application',null);
  }
  //Update Applicant PQ Form putAPI
  public updateApplicantPQForm(tenderId: any, applicationId: any, data: any): Observable<applicantsPqFormResponse> {
    return this.httpClient.put<applicantsPqFormResponse>(this.url + '/tender/' + tenderId + '/application/' + applicationId + '/update', data);
  }
  //file upload in update tender application form
  public updateApplicantPQFormFile(tenderId: any, applicationId: any, documentType: any, file: any) {
    return this.httpClient.put(this.url + '/tender/' + tenderId + '/application/' + applicationId + '/upload/' + documentType, file);
  }
  //file download in update tender application form
  public downloadApplicantPQFormFile(tenderId: any, applicationId: any, documentType: any) {
    return this.httpClient.get(this.url + '/tender/' + tenderId + '/application/' + applicationId + '/download/' + documentType);
  }
  //client users getAPI
  public getClientUsers(): Observable<clientUsersResponse> {
    return this.httpClient.get<clientUsersResponse>(this.url + '/client-users/getAll');
  }

  //contractor users getAPI
  public getContractorUsers(): Observable<contractorUsersResponse> {
    return this.httpClient.get<contractorUsersResponse>(this.url + '/contractor-users/getAll');
  }

  //user profile getAPI
  public getUserProfile(): Observable<userProfileResopnse> {
    return this.httpClient.get<userProfileResopnse>(this.url + '/user-profile');
  }

  //Update user profile putAPI
  public updateUserProfile(data: any): Observable<userProfileResopnse> {
    return this.httpClient.put<userProfileResopnse>(this.url + '/user-profile/update', data);
  }

  //APIs that get information about the tender applicants & their rankings
  public getTenderApplicantRanking(tenderId: any): Observable<tenderApplicantRankingResopnse> {
    return this.httpClient.get<tenderApplicantRankingResopnse>(this.url + '/tender-applicants/tender/' + tenderId);
  }

  //Update applicants rankings for a tender
  public updateTenderApplicantRanking(tenderId: any, data: any, action: any): Observable<tenderApplicantRankingResopnse> {
    return this.httpClient.put<tenderApplicantRankingResopnse>(this.url + '/tender-applicants/tender/' + tenderId + '/update/' + action, data);
  }

  //getAPI for compare tender applicants 
  public getTenderApplicantCompare(tenderId: any, applicantIds: any): Observable<applicantsPqFormResponse> {
    return this.httpClient.get<applicantsPqFormResponse>(this.url + '/tender-applicants/tender/' + tenderId + '/compare/' + applicantIds);
  }

  //Export to excel for compare applicants
  public exportExcelForCompareApplicants(tenderId: any, applicantIds: any) {
    return this.httpClient.get(this.url + '/tender-applicants/tender/' + tenderId + '/export-to-excel/' + applicantIds);
  }

  // Post API that allow qualified contractors to save/submit Financial & Technical bid info
  public tenderBidInfo(tenderId: any, data: any): Observable<tenderResopnse> {
    return this.httpClient.post<tenderResopnse>(this.url + '/' + tenderId + '/tender-bid-info', data);
  }

  // Post API allow qualified contractors to update Financial & Technical bid info
  public tenderBidInfoUpdate(tenderId: any, bidId: any, data: any): Observable<tenderResopnse> {
    return this.httpClient.put<tenderResopnse>(this.url + '/' + tenderId + '/tender-bid-info/update/' + bidId, data);
  }

  //Download Contractor Technical tender response document
  public downloadTenderBidInfoDocumentById(tenderId: any, userId: any) {
    return this.httpClient.get(this.url + '/' + tenderId + '/tender-bid-info/download/' + tenderId + '/tender-response/' + userId);
  }

  //Download Contractor Technical tender response document
  public downloadTenderBidInfoDocument(tenderId: any, userId: any) {
    return this.httpClient.get(this.url + '/' + tenderId + '/tender-bid-info/download/' + tenderId + '/tender-response/' + userId);
  }

  //Recommend a Contractor for Tender
  public recommendContractorForTender(tenderId: any, applicationFormId: any, data: any) {
    return this.httpClient.put(this.url + '/tender-applicants/tender/' + tenderId + '/recommend/' + applicationFormId, data);
  }

  //Get all enquiries
  public getEnquiries() {
    return this.httpClient.get(this.url + '/enquiry');
  }

  // Post API that enquiry about application
  public enquiry(data: any): Observable<enquiryResopnse> {
    return this.httpClient.post<enquiryResopnse>(this.url + '/enquiry/', data);
  }


  //Get client and applying contractors for the given tender
  public getClientContractors(tenderId: any): Observable<paymentResponse>{
    return this.httpClient.get<paymentResponse>(this.url + '/payment/' + tenderId);
  }
  // API generate payment links
  public generatePaymentLink(tenderId: any, data: any): Observable<paymentResponse> {
    return this.httpClient.post<paymentResponse>(this.url + '/payment/' + tenderId + '/generate-payment-link', data);
  }

  //download files converstion
  downloadFile(data: any) {
    const downlodFile = this.ConvertFile(data);
    const blob = new Blob([downlodFile], { type: data.fileType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let fileName = <string>data.fileName;
    link.download = fileName;
    link.click();
  }
  ConvertFile(data: { fileType: any; fileName?: any; encodedResponse?: any; }) {
    const base64Encode = data.encodedResponse;
    const blobFile = this.URItoBlob(base64Encode, data.fileType);
    const file = new File([blobFile], '', { type: data.fileType });
    return file;
  }
  URItoBlob(dataURI: string, fileType: any) {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: fileType });
    return blob;
  }
  //warning or error toastr
  showToast(toast: toastPayload) {
    this.toastr.show(
      toast.message,
      toast.title,
      toast.ic,
      'toast-' + toast.type
    );
  }

  //   // Error handling
  //   errorHandl(error: HttpErrorResponse) {
  //     let errorMessage = '';
  //     if (
  //       error.error &&
  //       error.error.type &&
  //       error.error.type === 'validation'
  //     ) {
  //       errorMessage = 'Validation Error'
  //     }
  //     else if (error.error && typeof error.error === 'string') {
  //       errorMessage =
  //         error.error
  //           ? error.error
  //           : 'Invalid value for parameter.';
  //     } else {
  //       errorMessage = 'Something went wrong.';
  //     }
  //     // console.log(errorMessage);
  //     return throwError(errorMessage);
  //   }
}
