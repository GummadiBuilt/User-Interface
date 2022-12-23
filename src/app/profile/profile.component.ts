import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { ApiServicesService } from '../shared/api-services.service';
import { userProfileResopnse } from './userProfileResponse';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  agentProfile: any = {};
  public isLogIn = false;

  constructor(private readonly keycloak: KeycloakService,
    private ApiServicesService: ApiServicesService, private router: Router,) { }

  ngOnInit() {
    this.keycloak.loadUserProfile().then(user => {
      this.isLogIn = true;
      this.agentProfile = user;
    })

    this.getUserProfileData();
  }
  userData: any;
  getUserProfileData() {
    this.ApiServicesService.getUserProfile().subscribe((data: userProfileResopnse) => {
      this.userData = data;
      console.log(this.userData);
    });
  }
}
