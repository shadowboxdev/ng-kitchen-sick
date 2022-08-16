import { URL } from 'url';

import * as queryString from 'query-string';
import { mapObjIndexed } from 'ramda';

export class HttpMetadata {
  public static store: Record<string, any> = { routes: {}, baseUrl: '' };

  public static addNamedRoute(routeName: string, path: string): void {
    HttpMetadata.store['routes'][routeName] = path;
  }

  public static getRoute(
    routeName: string,
    params?: Record<string, any> | undefined
  ): string | null {
    let route = HttpMetadata.store['routes'][routeName];
    if (!route) return null;

    let notPathParams: Record<string, any> | null = null;
    if (params && Object.keys(params).length) {
      notPathParams = {};

      mapObjIndexed((value, key) => {
        if (route.includes(`:${key}`)) {
          route = route.replace(`:${key}`, params[key]);
        } else {
          notPathParams![key] = params[key];
        }
      }, params);
    }
    const url = new URL(
      notPathParams
        ? `${route}?${queryString.stringify(notPathParams)}`
        : route,
      HttpMetadata.store['baseUrl']
    );

    return url.href;
  }

  public static setBaseUrl(url: string): void {
    HttpMetadata.store['baseUrl'] = url;
  }
}
