import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-unit-cell-renderer',
  templateUrl: './unit-cell-renderer.component.html',
  styleUrls: ['./unit-cell-renderer.component.scss']
})
export class UnitCellRendererComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams;
  public rowData: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.rowData = params.value;
  }

  refresh() {
    return false;
  }
}
