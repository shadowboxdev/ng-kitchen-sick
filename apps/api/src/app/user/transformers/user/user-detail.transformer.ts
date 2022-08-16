import { Transformer } from '@sdw/api/common';

export class UserDetailTransformer extends Transformer {
  public readonly availableIncludes = ['extra', 'address', 'pin'];
  public readonly defaultIncludes = ['pin'];

  public async transform(
    user: Record<string, any>
  ): Promise<Record<string, any>> {
    return {
      id: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }

  public async includeExtra(
    user: Record<string, any>
  ): Promise<Record<string, any>> {
    return { username: user.username };
  }

  public async includeAddress(
    user: Record<string, any>
  ): Promise<Record<string, any>> {
    return { country: 'INDIA', cityName: 'Gurugram' };
  }

  public async includePin(
    user: Record<string, any>
  ): Promise<Record<string, any>> {
    return { code: '122002' };
  }
}
