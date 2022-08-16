import { Injectable, Inject } from '@nestjs/common';
import { ListensTo } from '@squareboat/nest-events';

import { UserModuleConstants } from '../constants';
import { UserSignedUp } from '../events/user-signed-up';
import { UserRepositoryContract } from '../repositories';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserModuleConstants.userRepo)
    private readonly _users: UserRepositoryContract
  ) {}

  @ListensTo('USER_SIGNED_UP')
  public userSignedUp(event: UserSignedUp): void {
    console.log('EVENT RECEIVED ===>', event);
    // add your logic here
    return;
  }

  public async get(): Promise<Record<string, any>> {
    return this._users.firstWhere({});
  }
}
