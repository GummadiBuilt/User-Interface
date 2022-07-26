import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakRoles } from 'keycloak-js';
import { Router } from '@angular/router';
import { AppAuthGuard } from './guard/auth.guard';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gummadi-constructions';
  links = ['home', 'about', 'service', 'projects', 'corevalues', 'contact'];
  titles = ['Home', 'About Us', 'Service', 'Projects', 'Core Values', 'Contact Us'];
  activeLink = this.links[0];
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  public userRole: boolean | undefined;
  public menuName = 'Login';
  public userRoleEnable: string[] | undefined;
  
  constructor(private readonly keycloak: KeycloakService, public router: Router, private authGuard: AppAuthGuard) {
    this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles.includes('admin');
    //console.log('ser Role in constructor', this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles.includes('admin'))
  }
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened!: boolean;
  clickHandler() {
    this.sidenav.close();
  }
  public async ngOnInit() {
    try {
      this.userRoleEnable = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
     // console.log('user role', this.userRoleEnable);
    } catch (e) {
     // console.log('Failed to load user details', e);
    }
   // this.router.canceledNavigationResolution = 'computed';
    this.keycloak.isLoggedIn().then(async isLogged => {
      this.isLoggedIn = isLogged;
      //console.log('isloggedin', this.isLoggedIn)
      if (this.isLoggedIn) {

        this.menuName = 'Logout';
        //console.log('in getrole', this.isLoggedIn);
        this.userProfile = await this.keycloak.loadUserProfile();
        // if (this.userRole) {
        //   this.router.navigate(['/pending-approvals']);
        // }
        // else {
          //console.log('users',this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles)
          //this.router.navigate(['/tenders']);
        //}
      }
    });
  }
  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout(window.location.origin);
  }
}
