import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface TenderStatus {
  status: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  myControl = new FormControl<string | TenderStatus>('');
  options: TenderStatus[] = [{ status: 'Yet to be published' }, { status: 'Published' }, { status: 'Under-Process' },
  { status: 'Vendor recommended $ Concluded' }, { status: 'Archive' }, { status: 'Suspended' }];

  filteredOptions!: Observable<TenderStatus[]>;

  constructor() {

  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const status = typeof value === 'string' ? value : value?.status;
        return status ? this._filter(status as string) : this.options.slice();
      }),
    );
  }

  displayFn(tender: TenderStatus): string {
    return tender && tender.status ? tender.status : '';
  }

  private _filter(status: string): TenderStatus[] {
    const filterValue = status.toLowerCase();

    return this.options.filter(option => option.status.toLowerCase().includes(filterValue));
  }

}
