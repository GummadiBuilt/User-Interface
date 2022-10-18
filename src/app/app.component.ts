import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

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

  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened!: boolean;
  clickHandler() {
    this.sidenav.close();
  }
}
