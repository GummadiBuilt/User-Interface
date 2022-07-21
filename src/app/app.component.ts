import { Component, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
}
