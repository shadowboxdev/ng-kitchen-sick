import { DynamicModule, INestApplication, Logger, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { ExceptionFilter } from '../exceptions';
import { ServerOptions } from './interfaces';
import { RequestGuard } from './request.guard';

const GLOBAL_API_PREFIX = 'api' as const;
export class RestServer {
  private _options: ServerOptions | null = null;

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  public static async make(
    module: DynamicModule | Type<unknown>,
    options?: ServerOptions | undefined
  ): Promise<void> {
    const app = await NestFactory.create(module);

    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    app.enableCors({ origin: true });

    app.setGlobalPrefix(GLOBAL_API_PREFIX);

    RestServer._configureAuth(app);

    const config = app.get(ConfigService, { strict: false });
    const port = options?.port ?? config.get<number>('app.port')!;

    await app.listen(port);

    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${GLOBAL_API_PREFIX}`
    );
  }

  private static _configureAuth(app: INestApplication): void {
    app.useGlobalGuards(new RequestGuard());
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
  }
}
