import { Request as BaseRequest } from 'express';
import { Response as BaseResponse } from 'express';

export interface Request extends BaseRequest {
  /**
   * Get the current user from the request object
   */
  user: Record<string, any>;

  /**
   * Get all inputs from the request object
   */
  all(): Record<string, any>;
}

export interface Response extends BaseResponse {
  success(
    data: Record<string, any> | any[] | string,
    status?: number | string | undefined
  ): any;

  error(
    error: Record<string, any> | string,
    status?: number | string | undefined
  ): any;

  noContent(): any;

  withMeta(
    data: Record<string, any>,
    status?: number | string | undefined
  ): any;
}

export interface ServerOptions {
  addValidationContainer?: boolean | undefined;
  port?: number | undefined;
  globalPrefix?: string | undefined;
}
