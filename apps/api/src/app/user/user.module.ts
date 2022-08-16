import { Module } from '@nestjs/common';

import { GreetUser } from './commands';
import { UserModuleConstants } from './constants';
import { UserController } from './controllers';
import { UserRepository } from './repositories';
import { UserService } from './services';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    GreetUser,
    { provide: UserModuleConstants.userRepo, useClass: UserRepository }
  ]
})
export class UserModule {}
