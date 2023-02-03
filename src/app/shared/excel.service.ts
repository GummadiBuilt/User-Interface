import {ElementRef, Injectable} from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
  })
export class ExcelService {

  constructor() {
  }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(element: ElementRef, excelFileName: string): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    // XLSX.writeFile(workbook, ExcelService.toExportFileName(excelFileName));
    //let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element.nativeElement,  {raw:true});
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, excelFileName);
  }
}