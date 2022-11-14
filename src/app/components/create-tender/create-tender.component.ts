import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
export interface Element {
  position: string;
  item_description: string;
  unit: string;
  quantity: string;
}

const ELEMENT_DATA: Element[] = [
  { position: '1', item_description: 'STRUCTURAL STEEL WORK', unit: 'Ton', quantity: '20' },
  { position: '2', item_description: 'STRUCTURAL STEEL WORK', unit: 'Kilo', quantity: '40' },
];
@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.component.html',
  styleUrls: ['./create-tender.component.scss']
})
export class CreateTenderComponent implements OnInit {
  tenderDetails!: FormGroup;
  ftdTableRows!: FormGroup;
  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit(): void {
    this.tenderDetails = this._formBuilder.group({
      type_of_work: ['', Validators.required],
      description_of_work: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      project_location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type_of_contract: ['', [Validators.required]],
      contract_duration: ['', [Validators.required]],
      date_of_submission: ['', [Validators.required]],
      budget: ['', [Validators.required]],
      file: ['', Validators.required],
      fileSource: ['', Validators.required],
      ftdTableRows: this._formBuilder.group({
        position: ['', Validators.required],
        item_description: ['', [Validators.required]],
        unit: ['', Validators.required],
        quantity: ['', Validators.required]
      })
    });
  }

  isFileUploaded = false;
  file: any;
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      // console.log(this.file.name);
      this.tenderDetails.patchValue({
        fileSource: this.file
      });
    }
  }
  removeSelectedFile(f: any) {
    if (f) {
      this.file = '';
    }
  }

  typeOfWorks = ['Consultancy Services',
    'Structure Works (Civil)',
    'Structure Works (Steel/PEB/Precast)',
    'Structural Post Tensioning Works',
    'Interior Finishes',
    'Interior Fitout Works',
    'Elevation Façade / Glazing',
    'Waterproofing Works',
    'Building Electrical Works (LT)',
    'Building Electrical Works (HT)',
    'Fire Fighting System Installation',
    'HVAC Systems',
    'Elevators',
    'Sewage Treatment Plants (STP)',
    'Water Treatment Plants (WTP)',
    'Landscaping',
    'Diesel Generators',
    'IBMS (Integrated Building Management System)',
    'CCTV, Access Control, Security & Surveilance Systems',
    'Building Automation Systems',
    'Compressed Air Systems',
    'LPG/LNG Gas Distribution Systems',
    'Nurse Call Systems',
    'Medical Gas Systems',
    'Pneumatic Tube Systems'
  ];
  public typeOfWorksList = this.typeOfWorks.slice();

  typeOfContracts = ['Itemised Fixed Rate Contract',
    'Fixed Lumpsum Price Contract',
    'Design & Build Contract',
    'GMP Contract',
    'Cost Plus Percentage Contract'
  ]
  public typeOfContractsList = this.typeOfContracts.slice();

//AG GRID COMPONENTS
  public columnDefs: ColDef[] = [
    { field: 'Make' },
    { field: 'Model' },
    { field: 'Price' }
  ];
  public rowData: any;
  public rowSelection: 'single' | 'multiple' = 'single';


  onGridReady(params: GridReadyEvent) {
    console.log('grid ready', params)
  }
  importExcel(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      const dataHeaders = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log('headers', dataHeaders[0]);
      // console.log(data); // Data will be logged in array format containing objects
      this.rowData = data;
    };
  }
}
