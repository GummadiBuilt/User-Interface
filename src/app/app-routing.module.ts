import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuditApprovalsComponent } from './components/audit-approvals/audit-approvals.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ContractorsComponent } from './components/contractors/contractors.component';
import { PendingApprovalsComponent } from './components/pending-approvals/pending-approvals.component';
import { TendersComponent } from './components/tenders/tenders.component';
import { ContactComponent } from './contact/contact.component';
import { CorevaluesComponent } from './corevalues/corevalues.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { ServiceComponent } from './service/service.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'corevalues', component: CorevaluesComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [{ path: '', redirectTo: 'tenders', pathMatch: 'full' },
    { path: 'tenders', component: TendersComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'contractors', component: ContractorsComponent },
    { path: 'pending-approvals', component: PendingApprovalsComponent },
    { path: 'audit-approvals', component: AuditApprovalsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
