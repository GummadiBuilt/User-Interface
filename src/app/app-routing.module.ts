import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AuditApprovalsComponent } from './components/audit-approvals/audit-approvals.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ContractorsComponent } from './components/contractors/contractors.component';
import { CreateTenderComponent } from './components/create-tender/create-tender.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PendingApprovalsComponent } from './components/pending-approvals/pending-approvals.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TendersComponent } from './components/tenders/tenders.component';
import { ContactComponent } from './contact/contact.component';
import { CorevaluesComponent } from './corevalues/corevalues.component';
import { AppAuthGuard } from './guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectsComponent } from './projects/projects.component';
import { ServiceComponent } from './service/service.component';
import { SignupComponent } from './signup/signup.component';

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
  {
    path: 'tenders', component: TendersComponent, canActivate: [AppAuthGuard], data: { breadcrumb: { label: 'Tenders', info: 'receipt_long' } },
    children: [{ path: 'create-tender', component: CreateTenderComponent, canActivate: [AppAuthGuard], data: { breadcrumb: { label: 'Create Tender', info: 'add_circle' } } },
    { path: 'edit-tender', component: CreateTenderComponent, data: { breadcrumb: { label: 'Edit Tender', info: 'edit' } } }]
  },

  { path: 'clients', component: ClientsComponent, data: { breadcrumb: 'Clients' } },
  { path: 'contractors', component: ContractorsComponent, data: { breadcrumb: 'Contractors' } },
  { path: 'pending-approvals', component: PendingApprovalsComponent, canActivate: [AppAuthGuard], data: { breadcrumb: 'Pending Approvals' } },
  { path: 'audit-approvals', component: AuditApprovalsComponent, canActivate: [AppAuthGuard], data: { breadcrumb: 'Audit Approvals' } },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
