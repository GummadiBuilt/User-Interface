import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest  } from '@angular/common/http';
import { registrationMasterData, typeOfEstablishment, countries, changeTracking, registrationStatesData, registrationCitiesData } from './responses';
import { userRegistrationResopnse } from '../signup/signResponses';
import { ErrorServiceService } from './error-service.service';
import { registrationApprovalResopnse } from '../components/commonservices/approvalsUserData';
import { KeycloakService } from 'keycloak-angular';
import { registrationAuditResopnse } from '../components/commonservices/auditUserData';
import { environment } from 'src/environments/environment';
import { tenderMasterData } from '../components/create-tender/createTender';
import { commonOptionsData } from './commonOptions';
@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

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
      //  headers: new HttpHeaders({
      //    'Content-Type':''
      //   'Content-Type': 'multipart/form-data',
      //   'enctype': 'multipart/form-data',
      //   'Accept': 'application/json',
      //  }),
      observe: "events"
    })
      
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


