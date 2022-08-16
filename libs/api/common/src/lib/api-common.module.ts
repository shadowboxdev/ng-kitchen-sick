import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { config } from '@sdw/api/config';

import { BaseValidator } from './validator';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config
    })
  ],
  providers: [BaseValidator],
  exports: []
})
export class SdwCommonModule {}
