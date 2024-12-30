import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAllowedKeys', async: false })
export class IsAllowedKeysValidation implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const allowedKeys = args.constraints;
    if (typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }
    const keys = Object.keys(value);
    return keys.every((key) => allowedKeys.includes(key));
  }
  defaultMessage(args: ValidationArguments) {
    const allowedKeys = args.constraints;
    return `Only the following keys are allowed: ${allowedKeys.join(', ')}`;
  }
}
