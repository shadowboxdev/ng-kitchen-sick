import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { isEmpty, isNil, join, values } from 'ramda';
import { isArray, isNotNil } from 'ramda-adjunct';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsValueFromConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(private config: ConfigService) {}

  public validate(
    value: string,
    { constraints: [options] }: ValidationArguments
  ): boolean {
    const validValues = this.getValues(options.key);

    if (isEmpty(validValues) || !isArray(validValues)) return false;

    return validValues.includes(value);
  }

  public defaultMessage(args: ValidationArguments): string {
    const [options] = args.constraints;
    const validValues = this.getValues(options.key);

    if (isNil(validValues)) return '';

    return `${args.property} should have either of ${join(
      ', ',
      validValues
    )} as value`;
  }

  private getValues(key: string): string[] | undefined {
    const validValues: string[] | undefined = this.config.get(key);

    if (isNotNil(validValues)) return values(validValues) as string[];

    return validValues;
  }
}

export function isValueFromConfig<T = any>(
  options: Record<string, T>,
  validationOptions?: ValidationOptions
) {
  return function (object: Record<string, T>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsValueFromConfigConstraint
    });
  };
}
