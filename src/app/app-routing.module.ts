import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { ContractorsComponent } from './components/contractors/contractors.component';
import { TenderDetailsComponent } from './components/tender-details/tender-details.component';
import { TendersComponent } from './components/tenders/tenders.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { CoreValuesComponent } from './pages/core-values/core-values.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RegisterComponent } from './pages/register/register.component';
import { ServiceComponent } from './pages/service/service.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'core-values', component: CoreValuesComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'user-profile/:userId', component: UserProfileComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [{ path: '', redirectTo: 'tenders', pathMatch: 'full' },
    { path: 'tenders', component: TendersComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'contractors', component: ContractorsComponent },
    ]
  },
  { path: 'tenders/:tenderId', component: TenderDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
