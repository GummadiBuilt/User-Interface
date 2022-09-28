import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'gummadi-constructions';
  //public currentTabIndex = 1 
  currentTabIndex = new FormControl(0);
  nodeList: any;
//   getSelectedIndex(): number {
//     return this.currentTabIndex
// }

// onTabChange(event: MatTabChangeEvent) {
//     this.currentTabIndex = event.index
// }
@HostListener('window:scroll', ['$event'])
onWindowScroll($event) {
  console.log('scroll');
  this.currentTabIndex.setValue(this.currentTabIndex.value+1);
  console.log('scroll next', this.currentTabIndex);
}
@ViewChild('sidenav') sidenav: MatSidenav;

  opened: boolean;

  constructor() { }

  ngOnInit() {
  }

  clickHandler() {
    this.sidenav.close();
  }
}
