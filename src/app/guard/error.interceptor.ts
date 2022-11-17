import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(protected readonly keycloak: KeycloakService, private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) == -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                //this.keycloak.logout(window.location.origin);
            }
            const error = err.message?err.message: err.statusText;
            this.toastr.error(error);
            return throwError(error);
        }))
    }
}