import { UserModel } from '@sdw/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export type UserRepositoryContract = RepositoryContract<UserModel>;
