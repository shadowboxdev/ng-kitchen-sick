/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { forEachObjIndexed } from 'ramda';

import { Transformer$IncludeMethodOptions } from '../models';
import { Context } from '../utils/context';
import { ExpParser } from '../utils/exp-parser';

export abstract class Transformer {
  public availableIncludes = [];
  public defaultIncludes = [];
  public ctx = new Context();

  protected includes = {};

  /**
   * Use this when you want to include single object,
   * which is transformed by some other transformer.
   *
   * @param obj
   * @param transformer
   * @param options
   */
  public async item(
    obj: Record<string, any>,
    transformer: Transformer,
    options?: Transformer$IncludeMethodOptions
  ): Promise<Record<string, any> | null> {
    if (!obj) return null;
    transformer = this.applyOptions(transformer, options);
    return transformer.work(obj);
  }

  /**
   * Use this when you want to include multiple objects,
   * which is transformed by some other transformer.
   *
   * @param arr
   * @param transformer
   * @param options
   */
  public async collection(
    arr: Array<Record<string, any> | string>,
    transformer: Transformer,
    options?: Transformer$IncludeMethodOptions
  ): Promise<Array<any>> {
    if (!arr || arr.length === 0) return [];
    transformer = this.applyOptions(transformer, options);
    const result = [];
    for (let data of arr) {
      data = await transformer.work(data);
      result.push(data);
    }
    return result;
  }

  public applyOptions(
    transformer: Transformer,
    options?: Transformer$IncludeMethodOptions
  ): Transformer {
    options = options || {};

    if (options.include) {
      transformer.parseIncludes(options.include.join(','));
    }

    transformer.ctx.setRequest(this.ctx.getRequest()!);
    return transformer;
  }

  public parseIncludes(include = ''): this {
    this.includes = ExpParser.from(include).toObj();
    return this;
  }

  public async work(
    data: any
  ): Promise<Record<string, any> | Record<string, any>[]> {
    let result = {} as Record<string, any>;

    if (data instanceof Object) {
      result = (await this.transform(data))!;
    }

    const handlerName = (name: string): keyof this =>
      ('include' +
        name.charAt(0).toUpperCase() +
        name.slice(1)) as unknown as keyof this;

    forEachObjIndexed(async (include) => {
      const handler = handlerName(include);
      const nestedIncludes = this.includes[include];
      if (this[handler]) {
        result[include] = await (this[handler] as any)(data, {
          include: nestedIncludes || ''
        });
      }
    }, this.includes);

    return result;
  }

  public abstract transform(object: any): Promise<Record<string, any> | null>;
}
