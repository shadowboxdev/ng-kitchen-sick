import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { objOf } from 'ramda';

import { USER_REQUEST_KEY } from './constants';
import { UsersService } from './users';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    req[USER_REQUEST_KEY] = await this.usersService.findOneBy(objOf('id', 1));

    return true;
  }
}
