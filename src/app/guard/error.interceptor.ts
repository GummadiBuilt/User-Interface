// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr';
// import { KeycloakService } from 'keycloak-angular';

// @Injectable()
// export class ErrorInterceptor implements HttpInterceptor {
//     constructor(protected readonly keycloak: KeycloakService, private toastr: ToastrService) { }

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         return next.handle(request).pipe(catchError(err => {
//             if ([401, 403].indexOf(err.status) == -1) {
//                 // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
//                 //this.keycloak.logout(window.location.origin);
//             }
//             const error = err.message?err.message: err.statusText;
//             this.toastr.error(error);
//             return throwError(error);
//         }))
//     }
// }
import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private toastr: ToastrService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
       // console.log("Passed through the interceptor in request");

        return next.handle(request)
            .pipe(
                map(res => {
                    //console.log("Passed through the interceptor in response");
                    return res
                }),
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    if (error.error instanceof ErrorEvent) {
                        //console.log('This is client side error');
                        errorMsg = `Error: ${error.error.message}`;
                        this.toastr.error(errorMsg);
                    } else {
                        //console.log('This is server side error');
                        if (
                            error.error &&
                            error.error.type &&
                            error.error.type === 'validation'
                          ) {
                            errorMsg = 'Validation Error'
                          }
                          else if (error.error && typeof error.error === 'string') {
                            errorMsg =
                              error.error
                                ? error.error
                                : 'Invalid value for parameter.';
                          } else {
                            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                          }
                        //errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                        this.toastr.error(errorMsg);
                    }
                   // console.log(errorMsg);
                   // this.toastr.error(errorMsg);
                    return throwError(errorMsg);
                })
            )
    }
}