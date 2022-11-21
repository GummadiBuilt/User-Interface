import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  params: any;
  label!: string;
  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  btnClickedHandler($event: any) {
    this.params.clicked(this.params.value);
  }

  refresh() {
    return false;
  }

  constructor(private ngZone: NgZone,
    private router: Router) { }

  navigate(link: any) {
    this.ngZone.run(() => {
      this.router.navigate([link, this.params.value]);
    });
  }

}
