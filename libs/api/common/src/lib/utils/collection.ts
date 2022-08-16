import { isObject, orderBy } from 'lodash';
import {
  append,
  concat,
  dec,
  equals,
  filter,
  gt,
  head,
  mapObjIndexed,
  nth,
  path,
  toString,
  propEq,
  reduce
} from 'ramda';
import { mapIndexed } from 'ramda-adjunct';

import { GenericFunction } from '../constants';

export class Collection<T = any, K extends keyof T = keyof T> {
  public raw: T[] = [];
  public size: number = 0;

  constructor(data?: T[] | undefined) {
    this.raw = data ?? [];
    this.size = this.raw.length;
  }

  public static make<U>(data?: U[]): Collection<U> {
    return new Collection<U>(data);
  }

  public first(): T | null {
    return head(this.raw) ?? null;
  }

  public last(): T | null {
    return nth(dec(this.size), this.raw) ?? null;
  }

  public isNotEmpty(): boolean {
    return gt(this.size, 0);
  }

  public isEmpty(): boolean {
    return equals(0, this.size);
  }

  public remove(elem: T): Collection<T> {
    return new Collection(filter((e) => e !== elem, this.raw));
  }

  public pluck(key: string): Collection<T> {
    let values: T[] = [];

    if (isObject(this.raw[0])) {
      values = reduce(
        (acc: T[], el: T) => append(path<T>([key], el), acc) as any,
        [] as T[],
        this.raw
      );
    }

    return new Collection(values);
  }

  public join(delimiter: string): string {
    return this.raw.join(delimiter);
  }

  public groupBy(key: keyof T): Record<string, any> {
    const obj = {} as Record<string, any>;

    for (const el of this.raw) {
      const value = path<string>([toString(key)], el)!;

      if (!obj[value]) obj[value] = [];

      obj[value].push(el);
    }

    return obj;
  }

  public push(value: T): this {
    this.raw = append(value, this.raw);
    this.size = this.raw.length;

    return this;
  }

  public merge(values: T[]): this {
    this.raw = concat(this.raw, values);
    this.size = this.raw.length;

    return this;
  }

  public where(condition: Record<string, any>): Collection<T, K> {
    let filteredArray = this.raw;

    mapObjIndexed<T, unknown, K & string>((value, key) => {
      filteredArray = filter(propEq<K & string>(key, value), filteredArray);
    }, condition);

    return new Collection(filteredArray);
  }

  public each(cb: GenericFunction): void {
    mapIndexed((value, key) => {
      cb(value, key);
    }, this.raw);
  }

  public sortByDesc(arr: T[], key: string): T[] {
    return orderBy(arr, [key], ['desc']);
  }

  public sortBy(arr: T[], key: string): T[] {
    return orderBy(arr, [key], ['asc']);
  }
}
