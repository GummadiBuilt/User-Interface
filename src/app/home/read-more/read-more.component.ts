import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageConstants } from 'src/app/shared/application.constants';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {
  public constVariable = PageConstants;
  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  goToSignUp(value: any) {
    console.log(value);
    let applicantRoleId = value;
    // this.router.navigate(['/signup']);
    this.router.navigate(['/signup', { userType: applicantRoleId }]);
  }

}
