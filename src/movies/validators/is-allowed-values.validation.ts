import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAllowedValuesValidation', async: false })
export class IsAllowedValuesValidation implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const allowedKeys = args.constraints;
    if (typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }
    const values = Object.values(value);
    return values.every((value) => allowedKeys.includes(value));
  }
  defaultMessage(args: ValidationArguments) {
    return `Only the following keys are allowed: ${args.constraints.join(', ')}`;
  }
}
