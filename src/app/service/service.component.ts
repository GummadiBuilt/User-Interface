import { Component, OnInit } from '@angular/core';
import { PageConstants } from '../shared/application.constants';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  public constVariable = PageConstants;
  panelOpenState = false;
  constructor() { }

  ngOnInit(): void {
  }

  tableHeaderData = [
    { name: 'S No', width: '40px', rowspan: 2, colspan: 1 },
    { name: 'Task To Be Performed', width: '1000px', rowspan: 2, colspan: 1 },
    { name: 'Responsibility', width: '40px', rowspan: 1, colspan: 2 },
  ];
  tableHeaderData2 = [
    { name: 'Gummadi Built', width: '30px' },
    { name: 'Client', width: '30px'},
  ];
  tableData = [
    { position: 1, task: 'Recommend Best Suited Type of Contract Type/Strategy For the Project by Gummadi Built (ie. Lumpsum/Item Rate/Material/Labour/Design & Build/EPC Contract Models (Optional)', gummadi: true, client: false },
    { position: 2, task: 'Approval or intimate preference of Contract Type By Client', gummadi: false, client: true },
  ];
  tableData3 = [
    { position: 3, task: 'BOQ & Tender Estimates Provided By Client', gummadi: false, client: false },
  ];
  tableData3_1 = [
    { position: 3.1, task: 'Upload Tender Documents in Web Portal', gummadi: false, client: true },
    { position: 3.2, task: 'Verify, Review and Recommend value additions to client', gummadi: true, client: false },
    { position: 3.3, task: 'Modifications if any and Publishing of Tender Document in the Portal', gummadi: true, client: false },
  ];
  tableData4 = [
    { position: 4, task: 'BOQ & Tender Estimates Prepared By Gummadi Built (Optional)', gummadi: false, client: false },
  ];
  tableData4_1 = [
    { position: 4.1, task: 'Prepare BOQ & Tender Estimate based on Drawings provided by client', gummadi: true, client: false },
    { position: 4.2, task: 'Approval of Final Tender Estimate by Client', gummadi: false, client: true },
    { position: 4.3, task: 'Upload Tender Documents in the Web Portal ', gummadi: true, client: false },
  ];
  tableData5 = [
    { position: 5, task: 'Prequalification & Shortlisting of Contractors', gummadi: false, client: false },
  ];
  tableData5_1 = [
    { position: 5.1, task: 'tlist contractors for PQ Process based on preset criteria (Max 10 Nos)', gummadi: true, client: false },
    { position: 5.2, task: 'Collect Filled PQ Forms from the shortlisted Vendors/Contractors', gummadi: true, client: false },
    { position: 5.3, task: 'Analyse and shortlist final list of Vendors for Tendering process', gummadi: true, client: false },
  ];
  tableData6 = [
    { position: 6, task: 'Tendering and Work Award Phase', gummadi: false, client: false },
  ];
  tableData6_1 = [
    { position: 6.1, task: 'Publish Tenders to final shortlisted vendors', gummadi: true, client: false },
    { position: 6.2, task: 'Evaluate Tenders received from contractors', gummadi: true, client: false },
    { position: 6.3, task: 'Conduct Preliminary rounds of negotiations with vendors Offline', gummadi: true, client: false },
    { position: 6.4, task: 'Conduct final rounds of negotiations with final selected vendors in presence of client (Max 3 Nos)', gummadi: true, client: false },
    { position: 6.5, task: 'Provide final tender evaluation Reports and recommendations to client', gummadi: true, client: false },
    { position: 6.6, task: 'Section of Final Vendor for Work Award', gummadi: false, client: true },
    { position: 6.7, task: 'Prepare Draft LOI/LOA/WO/Agreement for Sign off between Client & Contractor', gummadi: true, client: false },
  ];
  tableData7 = [
    { position: 7, task: 'Construction Phase', gummadi: false, client: false },
  ];
  tableData7_1 = [
    { position: 7.1, task: 'Receive feedback on vendor performance from client during construction phase', gummadi: true, client: false },
    { position: 7.2, task: 'Coordinate between contractor and client to resolve important contractual issues affecting progress of works from time to time, in an amicable manner', gummadi: true, client: false },
    { position: 7.3, task: 'Assit client & contractor to resolve major contractual disputes and claims in legally tenable manner', gummadi: true, client: false },
    { position: 7.4, task: 'In case of default or breach of contract by contractor, provide alternative vendors or solution to client without any extra cost and/or time loss to client', gummadi: true, client: false },
  ];
}
