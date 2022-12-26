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
  badgeContent: number;

  constructor(private readonly keycloak: KeycloakService, public router: Router, private authGuard: AppAuthGuard) {
    this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles.includes('admin');
    //console.log('ser Role in constructor', this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles.includes('admin'))
    this.badgeContent = 10;
  }
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened!: boolean;
  photoUrl!: string;
  public showInitials = false;
  public initials!: string;
  name: any;
  public circleColor!: string;
  private colors = [
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];
  isBadgeHidden = false;

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

        //generate profile photo with initials
        this.name = this.userProfile.firstName + " " + this.userProfile.lastName;
        console.log(this.name);
        let initials = "";
        for (let i = 0; i < this.name.length; i++) {
          if (this.name.charAt(i) === ' ') {
            continue;
          }
          if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
            initials += this.name.charAt(i);

            if (initials.length == 2) {
              break;
            }
          }
        }
        this.initials = initials;
      }
    });

    if (!this.photoUrl) {
      this.showInitials = true;
      const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
      this.circleColor = this.colors[randomIndex];
    }

  }
  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout(window.location.origin);
  }

}
