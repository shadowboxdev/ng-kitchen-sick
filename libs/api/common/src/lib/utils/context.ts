import { Request } from '../rest';

export class Context {
  public req: Request | null = null;

  public setRequest(req: Request): this {
    this.req = req;

    return this;
  }

  public getRequest(): Request | null {
    return this.req;
  }
}
