import { get } from 'lodash';

import { Transformer } from '../transformers/transformer';

export class RestController {
  /**
   * Transform a object
   *
   * @param obj
   * @param transformer
   * @param options
   */
  public async transform(
    obj: Record<string, any>,
    transformer: Transformer,
    options?: Record<string, any> | undefined
  ): Promise<Record<string, any>> {
    transformer = this.setTransformerContext(transformer, options);

    return await transformer
      .parseIncludes(this.getIncludes(options?.['req']))
      .work(obj);
  }

  /**
   * Transform collection/array
   *
   * @param collect
   * @param transformer
   * @param options
   */
  public async collection(
    collect: Array<Record<string, any>>,
    transformer: Transformer,
    options?: Record<string, any>
  ): Promise<Array<Record<string, any>>> {
    transformer = this.setTransformerContext(transformer, options);

    const collection = [];
    for (const o of collect) {
      collection.push(
        await transformer
          .parseIncludes(this.getIncludes(options?.['req']))
          .work(o)
      );
    }
    return collection;
  }

  /**
   * Transform with paginate
   * @param obj
   * @param transformer
   * @param options
   */
  public async paginate(
    obj: Record<string, any>,
    transformer: Transformer,
    options?: Record<string, any>
  ): Promise<Record<string, any>> {
    const collection = this.collection(obj['data'], transformer, options);

    return {
      data: await collection,
      pagination: obj['pagination']
    };
  }

  public getIncludes(req: any): string {
    if (!req) return '';

    return get(req.all(), 'include', '');
  }

  private setTransformerContext(
    transformer: Transformer,
    options?: Record<'req', any>
  ): Transformer {
    // add request object to the transformer's context
    transformer.ctx.setRequest(options?.['req'] || {});
    return transformer;
  }
}
