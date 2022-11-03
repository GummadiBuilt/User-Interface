import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  agentProfile: any = {};
  public isLogIn = false;

  constructor(private readonly keycloak: KeycloakService) { }

  ngOnInit() {
    this.keycloak.loadUserProfile().then(user => {
      this.isLogIn = true;
      this.agentProfile = user;
    })
  }
  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout(window.location.origin);
  }
}
