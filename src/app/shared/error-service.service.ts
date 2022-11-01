import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ErrorServiceService {

  constructor(private router: Router) {}

  getErrorMessageByStatusCode(response:any): string {
    debugger;
    //const labels = LABELS[labelType];
    let errorMessage: string = '';
    switch (response.status) {
      case 400:
        if (
          response.error &&
          response.error.type &&
          response.error.type === 'validation'
        ) {
          const fields = response.error.fields || {};
          const keys = Object.keys(fields);
          const messages: string[] = [];
          keys.forEach((key) => {
            const errors = fields[key].map((err:any) => `${err.message}`);
            const msg = `- ${ key} ${errors.join(
              ' and '
            )}`;
            messages.push(msg);
          });
          errorMessage = messages.join('</br>');
        } else {
          errorMessage =
            response.error && typeof response.error === 'string'
              ? response.error
              : 'Invalid value for parameter.';
        }
        break;
      case 401:
        errorMessage = 'Unauthorized.';
        break;
      case 403:
        errorMessage =
          (response && response.error && response.error.message) ||
          'Forbidden.';
        this.router.navigateByUrl('/403');
        break;
      case 404:
        errorMessage =
          response.error && typeof response.error === 'string'
            ? response.error
            : 'Not Found.';
        break;
      case 500:
        errorMessage = response && response.error && response.error.message;
        break;
      default:
        errorMessage = 'Something went wrong.';
        break;
    }
    return errorMessage;
  }
}
