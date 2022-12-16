import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AuditApprovalsComponent } from './audit-approvals/audit-approvals.component';
import { ClientsComponent } from './clients/clients.component';
import { ContractorsComponent } from './contractors/contractors.component';
import { CreateTenderComponent } from './tenders/create-tender/create-tender.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TendersComponent } from './tenders/tender/tenders.component';
import { ContactComponent } from './contact/contact.component';
import { CorevaluesComponent } from './corevalues/corevalues.component';
import { AppAuthGuard } from './guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectsComponent } from './projects/projects.component';
import { ServiceComponent } from './service/service.component';
import { SignupComponent } from './signup/signup.component';
import { PQFormComponent } from './tenders/pq-form/pq-form.component';
import { ViewApplicantsPQFormComponent } from './tenders/view-applicants-pqform/view-applicants-pqform.component';
import { ViewApplicantsComponent } from './tenders/view-applicants/view-applicants.component';
import { PendingChangesGuard } from './shared/can-deactivate/can-deactivate.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: AppComponent, canActivate: [AppAuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'corevalues', component: CorevaluesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AppAuthGuard] },
  { path: 'clients', component: ClientsComponent, data: { breadcrumb: 'Clients' } },
  { path: 'contractors', component: ContractorsComponent, data: { breadcrumb: 'Contractors' } },
  { path: 'pending-approvals', component: PendingApprovalsComponent, canActivate: [AppAuthGuard], data: { breadcrumb: 'Pending Approvals' } },
  { path: 'audit-approvals', component: AuditApprovalsComponent, canActivate: [AppAuthGuard], data: { breadcrumb: 'Audit Approvals' } },
  {
    path: 'tenders', canActivate: [AppAuthGuard], data: { breadcrumb: { label: 'Tenders', info: 'fa-solid fa-file-invoice' } },
    children: [
      { path: '', component: TendersComponent, data: { breadcrumb: { label: 'Tenders', info: 'fa-solid fa-file-invoice' } } },
      { path: 'create-tender', component: CreateTenderComponent, canDeactivate: [PendingChangesGuard], canActivate: [AppAuthGuard], data: { breadcrumb: { label: 'Create Tender', info: 'fa-solid fa-square-plus' } } },
      { path: 'edit-tender/:tenderId', component: CreateTenderComponent, data: { breadcrumb: { label: 'Edit Tender', info: 'fa-solid fa-pen-to-square' } } },
      {
        path: ':tenderId', data: { breadcrumb: {} },
        children: [
          { path: '', component: CreateTenderComponent, data: { breadcrumb: {} } },
          { path: 'create-pq-form', component: PQFormComponent, data: { breadcrumb: { info: 'fa-solid fa-square-plus' } } },
          { path: 'edit-pq-form/:pqId', component: PQFormComponent, data: { breadcrumb: { info: 'fa-solid fa-pen-to-square' } } },
          { path: 'view-pq-form/:pqId', component: PQFormComponent, data: { breadcrumb: { info: 'fa-solid fa-pen-to-square' } } },
          { path: 'create-applicants-pq-form', component: ViewApplicantsPQFormComponent, data: { breadcrumb: { info: 'fa-solid fa-square-plus' } } },
          { path: 'view-applicants', component: ViewApplicantsComponent, },
        ]
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
