import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PageConstants } from '../shared/application.constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  locationUrl: string = environment.locationUrl;
  public constVariable = PageConstants;
  constructor() { }

  ngOnInit(): void {
  }

}
