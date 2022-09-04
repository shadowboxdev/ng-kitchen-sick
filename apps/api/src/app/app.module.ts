import { CacheModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SdwCommonModule } from '@sdw/api/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard
} from 'nest-keycloak-connect';

import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSessionCache } from './users/gateway/user-session-cache';
import { UsersGateway } from './users/gateway/users.gateway';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true
    }),
    KeycloakConnectModule.register(environment.auth),
    // ObjectionModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => config.get('db'),
    //   inject: [ConfigService]
    // }),
    SdwCommonModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserSessionCache,
    UsersGateway,
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
