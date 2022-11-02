import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakRoles } from 'keycloak-js';
import { Router } from '@angular/router';
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
  public menuName = 'login';
  constructor(private readonly keycloak: KeycloakService, private router: Router) {
    this.userRole = keycloak.isUserInRole("admin");
    //console.log('ser Role in constructor', this.userRole)
  }
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened!: boolean;
  clickHandler() {
    this.sidenav.close();
  }
  public async ngOnInit() {
    this.keycloak.isLoggedIn().then(async isLogged => {
      this.isLoggedIn = isLogged;
      //console.log('isloggedin', this.isLoggedIn)
      if (this.isLoggedIn) {

      this.menuName = 'logout';
        //console.log('in getrole', this.isLoggedIn);
        this.userProfile = await this.keycloak.loadUserProfile();
        if (this.userRole) {
          this.router.navigate(['/dashboard/pending-approvals']);
        }
        else{
          this.router.navigate(['/profile']);
        }
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
