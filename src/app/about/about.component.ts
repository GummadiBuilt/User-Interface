import { Component, OnInit } from '@angular/core';
import { PageConstants } from '../shared/application.constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public constVariable = PageConstants;
  constructor() { }

  ngOnInit(): void {
  }

}
