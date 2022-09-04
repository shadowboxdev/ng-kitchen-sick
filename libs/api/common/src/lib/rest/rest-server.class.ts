import { DynamicModule, INestApplication, Logger, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { ExceptionFilter } from '../exceptions';
import { ServerOptions } from './interfaces';
import { RequestGuard } from './request.guard';

export class RestServer {
  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  public static async make(
    module: DynamicModule | Type<unknown>,
    options?: ServerOptions | undefined
  ): Promise<void> {
    const app = await NestFactory.create(module);

    const config = app.get(ConfigService, { strict: false });
    const port = options?.port ?? config.get<number>('app.port')!;
    const globalPrefix = options?.globalPrefix ?? 'api';

    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    // app.use(hsts());
    app.enableCors({ origin: true });
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalGuards(new RequestGuard());

    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(new ExceptionFilter(httpAdapter));

    RestServer._configureSwagger(app);

    await app.listen(port);

    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  }

  private static _configureSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addTag('api')
      .addOAuth2(
        {
          type: 'oauth2',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          flows: {
            implicit: {
              authorizationUrl:
                'http://localhost:8080/realms/keycloak-angular-sandbox/protocol/openid-connect/auth',
              tokenUrl:
                'http://localhost:8080/realms/keycloak-angular-sandbox/protocol/openid-connect/token',
              scopes: {
                openid: 'open id',
                api: 'Api Access',
                profile: 'user profile'
              }
            }
          }
        }
        // {
        //   type: 'openIdConnect',
        //   scheme: 'bearer',
        //   bearerFormat: 'JWT',
        //   openIdConnectUrl:
        //     'http://localhost:8080/realms/keycloak-angular-sandbox/.well-known/openid-configuration'
        // },
        // 'auth'
      )
      // .addBearerAuth(
      //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      //   'JWT'
      // )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document, {});
  }
}
