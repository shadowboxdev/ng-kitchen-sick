import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { mergeRight, compose, objOf } from 'ramda';

const setDefaultOptions = mergeRight({ duration: 2000 });
const getOptionsForType = compose(
  objOf('panelClass'),
  (type: string) => `${type}-notification-overlay`
);

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private readonly _snackBar: MatSnackBar,
    private readonly _ngZone: NgZone
  ) {}

  public default(message: string): void {
    this._show(message, getOptionsForType('default'));
  }

  public info(message: string): void {
    this._show(message, getOptionsForType('info'));
  }

  public success(message: string): void {
    this._show(message, getOptionsForType('success'));
  }

  public warn(message: string): void {
    this._show(message, getOptionsForType('warning'));
  }

  public error(message: string): void {
    this._show(message, getOptionsForType('error'));
  }

  private _show(message: string, configuration: MatSnackBarConfig): void {
    this._ngZone.run(() =>
      this._snackBar.open(message, undefined, setDefaultOptions(configuration))
    );
  }
}
