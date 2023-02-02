import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-radio-button-renderer',
  templateUrl: './radio-button-renderer.component.html',
  styleUrls: ['./radio-button-renderer.component.scss']
})
export class RadioButtonRendererComponent implements ICellRendererAngularComp {
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  public rowData: any;
  constructor() { }

  ngOnInit(): void {
  }
  agInit(params: any): void {
    this.rowData = params.data;
  }
}
