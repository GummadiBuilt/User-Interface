import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable, Subject, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest  } from '@angular/common/http';
import { registrationMasterData, typeOfEstablishment, countries, changeTracking, registrationStatesData, registrationCitiesData } from './responses';
import { userRegistrationResopnse } from '../signup/signResponses';
import { ErrorServiceService } from './error-service.service';
import { registrationApprovalResopnse } from '../commonservices/approvalsUserData';
import { KeycloakService } from 'keycloak-angular';
import { registrationAuditResopnse } from '../commonservices/auditUserData';
import { environment } from 'src/environments/environment';
import { tenderMasterData } from '../tenders/create-tender/createTender';
import { commonOptionsData } from './commonOptions';
import { tenderResopnse } from '../tenders/tender/tenderResponse';
@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  public navigation = new Subject<any>();
  public navigation$ = this.navigation.asObservable();
  private url: string = environment.apiUrl;
  constructor(private httpClient: HttpClient, private errorService: ErrorServiceService,private kcService: KeycloakService) { }

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
  public createTender(data:any) {
    return this.httpClient.post(this.url + '/tender',data, {
      observe: "events"
    })
      
  }
  //Update Tender putAPI
  public updateTender(id:any,data:any) {
    return this.httpClient.put(this.url + '/tender/update/'+id,data, {
      observe: "events"
    })
      
  }
  // Tender data GETApI
  public getTenders(): Observable<tenderResopnse>  {
    return this.httpClient.get<tenderResopnse>(this.url + '/tender/getAll');
  }

  // Tender data GETApI
  public getTendersDatabyId(id:any): Observable<tenderResopnse>  {
    return this.httpClient.get<tenderResopnse>(this.url + '/tender/get/'+id);
  }

  //GET Common options for dropdowns and submit or save buttons
  public getCommonOptionsData(): Observable<commonOptionsData> {
    return this.httpClient.get<commonOptionsData>(this.url + '/common-options');
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


