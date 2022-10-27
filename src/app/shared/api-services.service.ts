import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { registrationMasterData, typeOfEstablishment, countries, changeTracking, registrationStatesData, registrationCitiesData } from './responses';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private url: string = 'http://localhost:9001';
  constructor(private httpClient: HttpClient) { }

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
  // Error handling
  errorHandl(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}


