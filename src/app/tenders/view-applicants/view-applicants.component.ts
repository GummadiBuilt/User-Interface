import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridReadyEvent, RowDragEndEvent, RowDragLeaveEvent } from 'ag-grid-community';
import { ApiServicesService } from 'src/app/shared/api-services.service';
import { tenderApplicantRankingResopnse } from 'src/app/tenders/view-applicants/tenderApplicantRankingResopnse';

@Component({
  selector: 'app-view-applicants',
  templateUrl: './view-applicants.component.html',
  styleUrls: ['./view-applicants.component.scss']
})
export class ViewApplicantsComponent implements OnInit {
  public domLayout: any;
  // rowData: any;
  tenderId: any;

  constructor(private ApiServicesService: ApiServicesService, private route: ActivatedRoute,) {
    this.route.paramMap.subscribe(params => {
      this.tenderId = params.get('tenderId');
    });
    this.domLayout = "autoHeight";
  }

  ngOnInit(): void {
    // this.getTenderApplicantsRankingData();
  }

  // getTenderApplicantsRankingData() {
  //   this.ApiServicesService.getTenderApplicantRanking(this.tenderId).subscribe((data: tenderApplicantRankingResopnse) => {
  //     this.rowData = data;
  //     console.log('tender applicants ranking', this.rowData);
  //   });
  // }

  onRowDragMove(event: any) {
    var movingNode = event.node;
    var overNode = event.overNode;
    // console.log(overNode);
    var changedRank = overNode.data.applicant_rank;
    // console.log(changedRank);
    var needToChangeRank = movingNode.applicant_rank !== changedRank;
    if (needToChangeRank) {
      var movingData = movingNode.data;
      movingData.applicant_rank = changedRank;
      this.gridApi.applyTransaction({ update: [movingData] });
      this.gridApi.clearFocusedCell();
    }
  }

  public rowData: any[] = [
    { company_name: 'Abhi Constructions', applicant_rank: '1', justification_note: 'note 1' },
    { company_name: 'Bhargav Constructions', applicant_rank: '2', justification_note: 'note 2' },
    { company_name: 'Arun Constructions', applicant_rank: '3', justification_note: 'note 3' },
    { company_name: 'Raj Constructions', applicant_rank: '4', justification_note: 'note 4' },
  ]
  public columnDefs: ColDef[] = [
    { headerName: 'Contractor Name', field: 'company_name', rowDrag: true, filter: 'agTextColumnFilter', flex: 3, autoHeight: true, wrapText: true },
    { headerName: 'Applicant Rank', field: 'applicant_rank', filter: 'agTextColumnFilter', flex: 1, autoHeight: true, wrapText: true, },
    { headerName: 'Remarks', field: 'justification_note', filter: 'agTextColumnFilter', flex: 5, autoHeight: true, wrapText: true },
  ];
  public defaultColDef: ColDef = {
    minWidth: 200,
    resizable: true,
    menuTabs: ['filterMenuTab'],
    filter: true,
    floatingFilter: true,
    sortable: true,
  };

  gridApi: any;
  gridOptions: any;
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridOptions = params.columnApi;
  }

  dragChanged(params: any) {
    this.gridApi.refreshCells(params);
  }

  onRowDragLeave(e: RowDragLeaveEvent) {
    console.log('onRowDragLeave', e);
    console.log('rowIndex', e.node.rowIndex);
  }

}
