import { GenericFunction } from '../constants';

export interface ObjectionModel {
  $fetchGraph?: GenericFunction | undefined;
  $load?(exp: LoadRelSchema): Promise<void> | undefined;
}

export interface NestedLoadRelSchema {
  $recursive?: boolean | number | undefined;
  $relation?: string | undefined;
  $modify?: string[] | undefined;
}

export interface NestedLoadRelSchemaProps {
  [key: string]: boolean | number | string | string[] | NestedLoadRelSchema;
}

export interface LoadRelSchema {
  [key: string]: boolean | (NestedLoadRelSchema & NestedLoadRelSchemaProps);
}
