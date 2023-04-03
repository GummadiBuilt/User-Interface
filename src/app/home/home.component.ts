import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageConstants } from '../shared/application.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public constVariable = PageConstants;
  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  goToSignUp(value: any) {
    console.log(value);
    let applicantRoleId = value;
    this.router.navigate(['/signup', { userType: applicantRoleId }]);
  }

}
