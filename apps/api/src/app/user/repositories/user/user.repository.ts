import { Injectable } from '@nestjs/common';
import { UserModel } from '@sdw/models';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

import { UserRepositoryContract } from './contract.type';

@Injectable()
export class UserRepository
  extends DatabaseRepository<UserModel>
  implements UserRepositoryContract
{
  @InjectModel(UserModel)
  public readonly model!: UserModel;
}
