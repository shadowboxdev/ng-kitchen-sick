import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';
import { Message } from '@sdw/api-interfaces';
import {
  AuthGuard,
  Resource,
  ResourceGuard,
  Scopes
} from 'nest-keycloak-connect';

import { AppService } from './app.service';

@Controller()
@Resource('Product')
@ApiOAuth2(['api'])
@UseGuards(AuthGuard, ResourceGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Scopes('View')
  public getData(): Message {
    return this.appService.getData();
  }
}
