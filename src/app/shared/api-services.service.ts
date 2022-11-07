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
@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private url: string = 'http://localhost:9001';
  constructor(private httpClient: HttpClient, private errorService: ErrorServiceService,private kcService: KeycloakService) { }

  public getRegistrationMasterData(): Observable<registrationMasterData> {
    return this.httpClient.get<registrationMasterData>(this.url + '/api/registration-master-data')
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  public getRegistrationStatesData(id: string): Observable<registrationStatesData[]> {
    return this.httpClient.get<registrationStatesData[]>(this.url + '/api/geography/get-states?countryCode=' + id)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  public getRegistrationCitiesData(id: number): Observable<registrationCitiesData[]> {
    return this.httpClient.get<registrationCitiesData[]>(this.url + '/api/geography/get-cities?stateCode=' + id)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  //Save Registration postAPI
  public userRegistration(data: any) {
    return this.httpClient.post(this.url + '/api/user-registration', data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response"

    })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  //pending approval getAPI
  public getRegistrationPendingApproval(): Observable<registrationApprovalResopnse> {
    return this.httpClient.get<registrationApprovalResopnse>(this.url + '/api/user-registration')
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  //pending approval postAPI
  public postRegistrationPendingApproval(id: any, data: any) {
    return this.httpClient.post(this.url + '/api/user-registration/approve-reject', data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: "response"
    })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  //audit approval getAPI
  public getRegistrationAuditApproval(): Observable<registrationAuditResopnse> {
    return this.httpClient.get<registrationAuditResopnse>(this.url + '/api/user-registration/audit-info')
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  // Error handling
  errorHandl(error: HttpErrorResponse) {
    let errorMessage = '';
    if (
      error.error &&
      error.error.type &&
      error.error.type === 'validation'
    ) {
      errorMessage = 'Validation Error'
    }
    else if (error.error && typeof error.error === 'string') {
      errorMessage =
        error.error
          ? error.error
          : 'Invalid value for parameter.';
    } else {
      errorMessage = 'Something went wrong.';
    }
    // console.log(errorMessage);
    return throwError(errorMessage);
  }
}


