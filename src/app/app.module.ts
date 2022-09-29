import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ServiceComponent } from './pages/service/service.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { CoreValuesComponent } from './pages/core-values/core-values.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TendersComponent } from './components/tenders/tenders.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ContractorsComponent } from './components/contractors/contractors.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TenderDetailsComponent } from './components/tender-details/tender-details.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutUsComponent,
    ServiceComponent,
    ProjectsComponent,
    CoreValuesComponent,
    ContactUsComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TendersComponent,
    ClientsComponent,
    ContractorsComponent,
    SignupComponent,
    TenderDetailsComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
