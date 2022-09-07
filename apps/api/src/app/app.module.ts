import { CacheModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SdwCommonModule } from '@sdw/api/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard
} from 'nest-keycloak-connect';

import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppGuard } from './app.guard';
import { AppService } from './app.service';
import { CompaniesModule } from './companies';
import { DevicesModule } from './devices';
import { NotesModule } from './notes';
import withCache from './orm.config';
import { ProjectsModule } from './projects';
import { UsersModule } from './users';
import { UserSessionCache } from './users/gateway/user-session-cache';
import { UsersGateway } from './users/gateway/users.gateway';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true
    }),
    KeycloakConnectModule.register(environment.auth),
    TypeOrmModule.forRoot(withCache),
    CompaniesModule,
    ProjectsModule,
    UsersModule,
    DevicesModule,
    NotesModule,
    SdwCommonModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserSessionCache,
    UsersGateway,
    {
      provide: APP_GUARD,
      useClass: AppGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ]
})
export class AppModule {}
