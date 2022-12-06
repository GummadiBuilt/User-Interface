import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  templateUrl:  './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  private params: any;
  label!: string;
  public rowData: any;
  agInit(params: any): void {
    this.rowData= params.data;
    this.params = params;
    this.label = this.rowData.tenderDocumentName || null;
  }

  btnClickedHandler(data: any) {
    //console.log('medals won!',data);
    //this.params.clicked(this.params.value);
    this.params.context.downloadDocument(data);
    
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
