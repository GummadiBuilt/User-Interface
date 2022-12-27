import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userData: Subject<any> = new Subject<any>();
  userData$: Observable<any> = this.userData.asObservable();
  constructor() {
  }
  getUserProfile(data: any) {
    this.userData.next(data);
  }
}
