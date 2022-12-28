import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
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

  updatePwdUrl : string = environment.updatePwdUrl;

  constructor(private readonly keycloak: KeycloakService,
    private ApiServicesService: ApiServicesService, private router: Router) { }

  ngOnInit() {
    this.keycloak.loadUserProfile().then(user => {
      this.isLogIn = true;
      this.agentProfile = user;
    })

    this.getUserProfileData();

    if (!this.photoUrl) {
      this.showInitials = true;
      const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
      this.circleColor = this.colors[randomIndex];
    }
  }


  userData: any;
  getUserProfileData() {
    this.ApiServicesService.getUserProfile().subscribe((data: userProfileResopnse) => {
      this.userData = data;
      console.log(this.userData);
      // set data in service which is to be shared
      this.ApiServicesService.setUserProfileData(data)

      //generate profile photo with initials
      let initials = "";
      this.name = this.userData?.contactFirstName + " " + this.userData?.contactLastName;
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
    });
  }
}
