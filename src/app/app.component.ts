import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions, KeycloakProfile, KeycloakRoles } from 'keycloak-js';
import { Router } from '@angular/router';
import { AppAuthGuard } from './guard/auth.guard';
import { MatMenuTrigger } from '@angular/material/menu';

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
  public userProfile: KeycloakProfile | any = null;
  public userRole: boolean | undefined;
  public menuName = 'Login';
  public userRoleEnable: string[] | undefined;

  constructor(private readonly keycloak: KeycloakService, public router: Router, private authGuard: AppAuthGuard) {
    this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles.includes('admin');
  }
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened!: boolean;
  photoUrl!: string;
  public showInitials = false;
  public initials!: string;
  name: any;
  isBadgeHidden = false;

  clickHandler() {
    this.sidenav.close();
  }

  keycloakLoginOptions: KeycloakLoginOptions = {
    redirectUri: 'http://localhost:4200/tenders'
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

        //generate profile photo with initials
        const shortName = this.userProfile.firstName.substring(0, 1) + this.userProfile.lastName.substring(0, 1);
        this.initials = shortName;
      }
    });
  }
  public login() {
    this.keycloak.login(this.keycloakLoginOptions);
  }

  public logout() {
    this.keycloak.logout(window.location.origin);
  }

}
