import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response, RestController } from '@sdw/api/common';
import { Public, Resource } from 'nest-keycloak-connect';

import { UserService } from '../services';
import { UserDetailTransformer } from '../transformers';

@Controller('users')
@Resource('Users')
export class UserController extends RestController {
  constructor(private service: UserService) {
    super();
  }

  @Get('/profile')
  @Public(false)
  public async getProfile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    const user = await this.service.get();
    return res.success(
      await this.transform(user, new UserDetailTransformer(), { req })
    );
  }
}
