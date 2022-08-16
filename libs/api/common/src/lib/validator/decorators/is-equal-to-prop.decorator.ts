import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { path } from 'ramda';

@ValidatorConstraint({ async: true })
class IsEqualToConstraint implements ValidatorConstraintInterface {
  public async validate(
    value: string,
    args: ValidationArguments
  ): Promise<boolean> {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = path(['object', relatedPropertyName], args);

    return value === relatedValue;
  }

  public defaultMessage(args: ValidationArguments): string {
    const property = args.property;
    const [relatedPropertyName] = args.constraints;

    return `${property} should be equal to ${relatedPropertyName}`;
  }
}

export function isEqualToProp(
  property: string,
  validationOptions?: ValidationOptions
) {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsEqualToConstraint
    });
  };
}
