import { join } from 'path';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { forEach } from 'ramda';
import { isString } from 'ramda-adjunct';

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

    forEach((w) => {
      const { instance } = w;
      const prototype = Object.getPrototypeOf(instance);

      if (!instance || isString(instance) || !prototype) return;

      this.metadataScanner.scanFromPrototype(
        instance,
        prototype,
        (key: string) =>
          this.lookupListeners(
            instance,
            key,
            Reflect.getMetadata(PATH_METADATA, w.metatype)
          )
      );
    }, this.discovery.getControllers());
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
