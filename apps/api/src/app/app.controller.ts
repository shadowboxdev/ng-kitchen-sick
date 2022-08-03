import { Controller, Get } from '@nestjs/common';
import { Message } from '@sdw/api-interfaces';
import { Public, Resource, Scopes } from 'nest-keycloak-connect';

import { AppService } from './app.service';

@Controller()
@Resource('Product')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Public(false)
  @Scopes('View')
  public getData(): Message {
    return this.appService.getData();
  }
}
