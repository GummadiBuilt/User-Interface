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
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ContractorsComponent } from './components/contractors/contractors.component';
import { ToastrModule } from 'ngx-toastr';
import { TendersComponent } from './components/tenders/tenders.component';
import { PendingApprovalsComponent } from './components/pending-approvals/pending-approvals.component';
import { AuditApprovalsComponent } from './components/audit-approvals/audit-approvals.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { CreateTenderComponent } from './components/create-tender/create-tender.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { AgGridModule } from 'ag-grid-angular';

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
    DashboardComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    KeycloakAngularModule,
    MatFileUploadModule,
    AgGridModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
bootstrap: [AppComponent]
})
export class AppModule { }
