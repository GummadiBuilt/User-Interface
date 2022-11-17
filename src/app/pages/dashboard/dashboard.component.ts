import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public userRole: string[] | undefined;
  constructor(protected keycloak: KeycloakService,private router: Router) { }

  ngOnInit(): void {
    //this.router.canceledNavigationResolution = 'computed';
    try {
       this.userRole = this.keycloak.getKeycloakInstance().tokenParsed?.realm_access?.roles
      //console.log('user role',this.userRole);
    } catch (e){
      console.log('Failed to load user details', e);
    }

  }

}
