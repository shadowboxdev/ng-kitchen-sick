import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Message } from '@sdw/api-interfaces';
import { AuthGuard, RoleGuard, Resource, Scopes } from 'nest-keycloak-connect';

import { AppService } from './app.service';

@ApiOAuth2(['api'], 'openId')
@Controller()
@Resource('Product')
@UseGuards(AuthGuard, RoleGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Scopes('View')
  @UseGuards(AuthGuard, RoleGuard)
  public getData(): Message {
    return this.appService.getData();
  }
}
