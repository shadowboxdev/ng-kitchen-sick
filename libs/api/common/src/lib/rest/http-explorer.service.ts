import { join } from 'path';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

import { GenericFunction } from '../constants';
import { ROUTE_NAME } from './constants';
import { HttpMetadata } from './http-metadata.class';

@Injectable()
export class HttpExplorer implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner
  ) {}

  public onModuleInit(): void {
    HttpMetadata.setBaseUrl(this.config.get('app.url')!);

    const wrappers = this.discovery.getControllers();

    wrappers.forEach((w) => {
      const { instance } = w;
      if (
        !instance ||
        typeof instance === 'string' ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) =>
          this.lookupListeners(
            instance,
            key,
            Reflect.getMetadata(PATH_METADATA, w.metatype)
          )
      );
    });
  }

  public lookupListeners(
    instance: Record<string, GenericFunction>,
    key: string,
    baseRoute?: string
  ): void {
    baseRoute = baseRoute || '';
    const hasRouteName = Reflect.hasMetadata(ROUTE_NAME, instance, key);

    if (!hasRouteName) return;

    const routeName = Reflect.getMetadata(ROUTE_NAME, instance, key);

    HttpMetadata.addNamedRoute(
      routeName,
      join(baseRoute, Reflect.getMetadata(PATH_METADATA, instance[key]))
    );
  }
}
