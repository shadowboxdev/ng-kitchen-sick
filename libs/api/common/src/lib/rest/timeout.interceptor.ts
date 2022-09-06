import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException
} from '@nestjs/common';
import { is } from 'ramda';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

const isTimeout = is(TimeoutError);

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  public intercept(
    _: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    return next.handle().pipe(
      timeout(30000),
      catchError((err) =>
        throwError(() => (isTimeout(err) ? new RequestTimeoutException() : err))
      )
    );
  }
}
