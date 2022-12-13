import { Component, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent, RowDragEndEvent, RowDragLeaveEvent } from 'ag-grid-community';

@Component({
  selector: 'app-view-applicants',
  templateUrl: './view-applicants.component.html',
  styleUrls: ['./view-applicants.component.scss']
})
export class ViewApplicantsComponent implements OnInit {
  public domLayout: any;

  constructor() {
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
  }

  public columnDefs: ColDef[] = [
    { headerName: 'Contractor Name', field: 'contractorName', rowDrag: true, filter: 'agTextColumnFilter', flex: 2, autoHeight: true, wrapText: true },
    { headerName: 'Rank', field: 'rank', filter: 'agTextColumnFilter', flex: 1, autoHeight: true, wrapText: true },
  ];
  public defaultColDef: ColDef = {
    minWidth: 200,
    resizable: true,
    menuTabs: ['filterMenuTab'],
    filter: true,
    floatingFilter: true,
    sortable: true,
  };
  public rowData: any[] = [
    { contractorName: 'Abhi Constructions', rank: '1' },
    { contractorName: 'Bhargav Constructions', rank: '2' },
    { contractorName: 'Arun Constructions', rank: '3' },
    { contractorName: 'Raj Constructions', rank: '4' },
  ]
  gridApi: any;
  gridOptions: any;
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
  }

  // dragChanged(params: any) {
  //   setTimeout(() => {
  //     let num = 0;
  //     params.api.forEachNode((node:any) => {
  //       node.setDataValue('rank', num++);
  //     });
  //   });
  // }

  onRowDragLeave(e: RowDragLeaveEvent) {
    console.log('onRowDragLeave', e);
    console.log('rowIndex', e.node.rowIndex);
  }

}
