import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

export class User {
  id!: number;
  name!: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit {
  links = ['home', 'about-us', 'service', 'projects', 'core-values', 'contact-us'];
  titles = ['Home', 'About Us', 'Service', 'Projects', 'Core Values', 'Contact Us'];
  activeLink = this.links[0];

  isSignedIn!: boolean;

  constructor(
    public router: Router,
  ) {

  }

  ngOnInit() {

  }

  // Signout
  signOut() {
    this.router.navigate(['login']);
  }

  //image upload
  url: any;
  onSelectFile(event: any, id: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target?.result;
      }
    }
  }

  public delete() {
    this.url = null;
  }
}
