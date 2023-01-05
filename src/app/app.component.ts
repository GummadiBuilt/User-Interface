import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakRoles } from 'keycloak-js';
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
  badgeContent: number;

  constructor(private readonly keycloak: KeycloakService, public router: Router, private authGuard: AppAuthGuard) {
    this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles.includes('admin');
    //console.log('ser Role in constructor', this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles.includes('admin'))
    this.badgeContent = 10;

    this.dataLoad();
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

  public notifications: any;
  public resultData: any[] = [];
  dataLoad() {
    this.notifications = [
      { date: '2022-12-27 11:05:36.630', header: 'New tender applied', description: 'Client applied a new tender' },
      { date: '2022-12-27 11:05:36.630', header: 'New tender applied', description: 'Client applied a new tender' },
      { date: '2022-12-26 11:05:36.630', header: 'New tender applied', description: 'Client applied a new tender' },
      { date: '2022-12-26 11:05:36.630', header: 'New tender applied', description: 'Client applied a new tender and submitted succesfully' },
      { date: '2022-12-25 11:05:36.630', header: 'New tender applied', description: 'Client applied a new tender' },
      { date: '2021-12-24 11:05:36.630', header: 'New tender applied', description: 'Client applied a new tender and submitted succesfully' },
    ]

    let data = new Set(this.notifications.map((item: any) => item.date));
    data.forEach((date) => {
      this.resultData.push({
        date: date,
        notifications: this.notifications.filter((i: any) => i.date === date)
      });
    });
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
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout(window.location.origin);
  }

}
