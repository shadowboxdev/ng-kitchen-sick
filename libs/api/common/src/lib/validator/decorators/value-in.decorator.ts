import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { filter } from 'ramda';
import { included, isArray, isString } from 'ramda-adjunct';

@ValidatorConstraint({ async: true })
class ValueInConstraint implements ValidatorConstraintInterface {
  public async validate<T>(
    value: T | T[],
    args: ValidationArguments
  ): Promise<boolean> {
    const [validValues] = args.constraints;
    if (isString(value)) return validValues.includes(value);

    if (isArray(value)) {
      const difference = filter(included(validValues), value);

      return !difference.length;
    }

    return false;
  }

  public defaultMessage(args: ValidationArguments): string {
    const property = args.property;

    return `${property} contains invalid values`;
  }
}

export function valueIn(
  validValues: any[] | any,
  validationOptions?: ValidationOptions
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validValues],
      validator: ValueInConstraint
    });
  };
}
