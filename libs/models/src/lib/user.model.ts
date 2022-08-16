import { BaseModel } from '@squareboat/nestjs-objection';

export class UserModel extends BaseModel {
  public static tableName: string = 'users';
}
