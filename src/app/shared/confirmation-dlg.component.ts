import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
   selector: 'app-confirmation-dlg',
   template: `
      <div fxLayoutAlign="start center" mat-dialog-title>{{data.title}}</div>
      <div class="msg" mat-dialog-content>
         {{data.msg}}
      </div>
      <a href="#"></a>
      <mat-dialog-actions fxLayoutAlign="end center">
         <button mat-button [mat-dialog-close]="true" class="color"><mat-icon>check</mat-icon>Yes</button>
         <button mat-button [mat-dialog-close]="false" class="colors"><mat-icon>close</mat-icon>No</button>
      </mat-dialog-actions>`,
   styles: [`
      .title {font-size: large;}
      .msg {font-size: medium;}
      .colors {color: white; background-color: #891010;}
      .color {color: white; background-color: #008000;}
      button {flex-basis: 100px;}
   `]
})
export class ConfirmationDlgComponent {
   constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}