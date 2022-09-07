/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import {
  DynamicModule,
  INestApplication,
  Logger,
  Type,
  VersioningType
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Queue } from 'bull';
import { useContainer } from 'class-validator';
import expressBasicAuth from 'express-basic-auth';
import { SessionOptions } from 'express-session';
import helmet from 'helmet';
import { objOf } from 'ramda';

import { ExceptionFilter } from '../exceptions';
import { BullOptions, ServerOptions } from './interfaces';
import { RequestGuard } from './request.guard';

const DEFAULT_SESSION_OPTIONS: SessionOptions = {
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
};

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

    if (options?.bullOptions) {
      // RestServer._configureBull(app, options.bullOptions!);
    }

    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'script-src': [ '\'self\'', '\'sha256-4IiDsMH+GkJlxivIDNfi6qk0O5HPtzyvNwVT3Wt8TIw=\'' ],
            'connect-src': [
              '\'self\'',
              'http://localhost:8080/realms/keycloak-angular-sandbox/.well-known/openid-configuration',
            ],
          },
        },
        crossOriginOpenerPolicy: {
          policy: 'unsafe-none',
        },
      })
    );
    // app.use(compression());
    // app.use(session(options?.sessionOptions ?? DEFAULT_SESSION_OPTIONS));
    // app.use(csurf());
    app.enableCors({ origin: true });
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalGuards(new RequestGuard());
    app.useGlobalFilters(new ExceptionFilter());
    app.enableVersioning({
      type: VersioningType.HEADER,
      header: 'API_VERSION'
    });
    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(new ExceptionFilter(httpAdapter));

    RestServer._configureSwagger(app);

    await app.listen(port);

    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  }

  private static _configureBull(
    app: INestApplication,
    options: BullOptions
  ): void {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/bull-board');

    const aQueue = app.get<Queue>(`BullQueue_${options!.queueName}`);

    createBullBoard({
      queues: [new BullAdapter(aQueue)],
      serverAdapter
    });

    app.use(
      '/bull-board',
      expressBasicAuth({
        users: options.users ?? objOf('admin', 'password'),
        challenge: true
      }),
      serverAdapter.getRouter()
    );
  }

  private static _configureSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addTag('api')
      .addOAuth2({
        type: 'oauth2',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        openIdConnectUrl:
          'http://localhost:8080/realms/keycloak-angular-sandbox/.well-known/openid-configuration',
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
        },
        
      }, 'openId')
      // .addOAuth2(
      //   {
      //     type: 'openIdConnect',
      //     scheme: 'bearer',
      //     bearerFormat: 'JWT',
      //     openIdConnectUrl:
      //       'http://localhost:8080/realms/keycloak-angular-sandbox/.well-known/openid-configuration'
      // flows: {
      //   implicit: {
      //     authorizationUrl:
      //       'http://localhost:8080/realms/keycloak-angular-sandbox/protocol/openid-connect/auth',
      //     tokenUrl:
      //       'http://localhost:8080/realms/keycloak-angular-sandbox/protocol/openid-connect/token',
      //     scopes: {
      //       openid: 'open id',
      //       api: 'Api Access',
      //       profile: 'user profile'
      //     }
      //   }
      // }
      // }
      // {
      //   type: 'openIdConnect',
      //   scheme: 'bearer',
      //   bearerFormat: 'JWT',
      //   openIdConnectUrl:
      //     'http://localhost:8080/realms/keycloak-angular-sandbox/.well-known/openid-configuration'
      // },
      // 'auth'
      // )
      // .addBearerAuth(
      //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      //   'JWT'
      // )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document, {
      swaggerOptions: {}
    });
  }
}
