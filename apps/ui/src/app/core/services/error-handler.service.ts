import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Provider } from '@angular/core';

import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

/** Application-wide error handler that adds a UI notification to the error handling
 * provided by the default Angular ErrorHandler.
 */
@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor(private readonly _notifications: NotificationService) {
    super();
  }

  public override handleError(error: Error | HttpErrorResponse): void {
    let displayMessage = 'An error occurred.';

    if (!environment.production) {
      displayMessage += ' See console for details.';
    }

    this._notifications.error(displayMessage);

    super.handleError(error);
  }
}

export const APP_ERROR_HANDLER: Provider = {
  provide: ErrorHandler,
  useClass: AppErrorHandler
};
