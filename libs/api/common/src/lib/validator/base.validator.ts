import { Injectable, Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { isEmpty } from 'ramda';

import { ValidationFailed } from '../exceptions';
import { startCase } from '../utils';

@Injectable()
export class BaseValidator {
  public async fire<T>(
    inputs: Record<string, any>,
    schemaMeta: Type<T>
  ): Promise<T> {
    const schema: T = plainToClass(schemaMeta, inputs);
    const errors = await validate(schema as Record<string, any>, {
      stopAtFirstError: true
    });

    /**
     * Process errors, if any.
     * Throws new ValidationFailed Exception with validation errors
     */
    let bag = {};
    if (errors.length > 0) {
      for (const error of errors) {
        const errorsFromParser = this.parseError(error) as Record<string, any>;
        const childErrorBag = {} as Record<string, any>;
        for (const key in errorsFromParser) {
          if (!isEmpty(errorsFromParser[key])) {
            childErrorBag[key] = errorsFromParser[key];
          }
        }

        bag = { ...bag, ...childErrorBag };
      }

      throw new ValidationFailed(bag);
    }

    return schema;
  }

  public parseError(error: any): any {
    const children = [];
    for (const child of error.children || []) {
      children.push(this.parseError(child));
    }

    const messages = [];
    // eslint-disable-next-line guard-for-in
    for (const c in error.constraints) {
      let message = error.constraints[c];
      message = message.replace(error.property, startCase(error.property));
      messages.push(message);
    }

    const errors = {} as Record<string, any>;
    if (!isEmpty(messages)) {
      errors[error.property] = messages;
    }

    for (const child of children) {
      // eslint-disable-next-line guard-for-in
      for (const key in child) {
        errors[`${error.property}.${key}`] = child[key];
      }
    }

    return errors;
  }
}
