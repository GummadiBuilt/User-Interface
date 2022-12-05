import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { ServiceComponent } from './service/service.component';
import { CorevaluesComponent } from './corevalues/corevalues.component';
import { ProjectsComponent } from './projects/projects.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ClientsComponent } from './clients/clients.component';
import { ContractorsComponent } from './contractors/contractors.component';
import { ToastrModule } from 'ngx-toastr';
import { TendersComponent } from './tenders/tender/tenders.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { AuditApprovalsComponent } from './audit-approvals/audit-approvals.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { CreateTenderComponent } from './tenders/create-tender/create-tender.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { AgGridModule } from 'ag-grid-angular';
import { ErrorInterceptor } from './guard/error.interceptor';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { ButtonRendererComponent } from './button-renderer/button-renderer.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from './shared/loader.service';
import { LoaderInterceptor } from './shared/loader-interceptor.service';
import { MyLoaderComponent } from './my-loader/my-loader.component';
import { BlurFormatDirective } from './directives/blur-format.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDlgComponent } from './shared/confirmation-dlg.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: environment.KEYCLOAK_REALM,
        url: environment.KEYCLOAK_URL,
        clientId: environment.KEYCLOAK_CLIENT_ID
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}
export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  allowZero: true,
  decimal: ".",
  precision: 0,
  prefix: "₹ ",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    ServiceComponent,
    CorevaluesComponent,
    ProjectsComponent,
    AboutComponent,
    LoginComponent,
    SignupComponent,
    ClientsComponent,
    ContractorsComponent,
    TendersComponent,
    PendingApprovalsComponent,
    AuditApprovalsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    NumbersOnlyDirective,
    CreateTenderComponent,
    DragDropFileUploadDirective,
    ButtonRendererComponent,
    MyLoaderComponent,
    BlurFormatDirective,
    ConfirmationDlgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatDialogModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    KeycloakAngularModule,
    MatFileUploadModule,
    AgGridModule,
    BreadcrumbModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  providers: [
    DatePipe,
    LoaderService,
    
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
bootstrap: [AppComponent]
})
export class AppModule { }
