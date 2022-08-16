import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { get, omit } from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class RequestGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.bindRequestHelpers(context.switchToHttp().getRequest());
    this.bindResponseHelpers(context.switchToHttp().getResponse());

    return true;
  }

  /**
   * Bind Response Helpers
   *
   * @param response
   */
  public bindResponseHelpers(response: any): any {
    const success = (
      data: Record<string, any> | Array<any> | string,
      status = 200
    ): any =>
      response.status(status).json({
        success: true,
        code: status,
        data: data
      });

    const error = (_error: Record<string, any> | string, status = 401): any => {
      let message: string = 'Something went wrong!';
      let errors: Record<string, any> | null = null;
      if (_error instanceof Object) {
        message = _error['message'];
        errors = _error['errors'];
      } else {
        message = _error;
      }

      return response.status(status).json({
        success: false,
        code: status,
        message,
        errors
      });
    };

    const noContent = (): any => response.status(204).end();

    const withMeta = (data: Record<string, any>, status = 200): any =>
      response.status(status).json({
        success: true,
        code: status,
        data: get(data, 'data'),
        meta: omit(data, ['data'])
      });

    response.success = success;
    response.error = error;
    response.noContent = noContent;
    response.withMeta = withMeta;

    return response;
  }

  /**
   * Bind Request Helpers
   *
   * @param request
   */
  public bindRequestHelpers(request: any): any {
    const all = function (): Record<string, any> {
      const inputs = { ...request.query, ...request.body, ...request.params };

      // eslint-disable-next-line guard-for-in
      for (const key in inputs) {
        const value = inputs[key];
        if (typeof value === 'string' || value instanceof String) {
          inputs[key] = value.trim();
        }
      }

      return inputs;
    };

    request.all = all;
    return request;
  }
}
