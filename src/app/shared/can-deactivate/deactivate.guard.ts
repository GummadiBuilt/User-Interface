import { HostListener, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { ConfirmationDlgComponent } from "../confirmation-dlg.component";

type CanDeactivateType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
export interface ComponentCanDeactivate {
    canDeactivate: () => CanDeactivateType;
}

@Injectable()
export class DeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(private dialog: MatDialog) { }

    canDeactivate(
        component: ComponentCanDeactivate,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): CanDeactivateType {
        if (component.canDeactivate()) {
            return this.openUnsavedChangesDialog();
        }
        else {
            return of(true);
        }
    }

    private openUnsavedChangesDialog(): Observable<boolean> {
        const dialogRef = this.dialog.open(ConfirmationDlgComponent, {
            data: { title: 'Confirmation?', msg: 'Are you sure you want to leave the page?' }
        });
        return dialogRef.afterClosed();
    }
}