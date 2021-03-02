import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { passwords } from "../../utils/mostCommonPasswords";

@ValidatorConstraint({ async: true })
export class isPasswordTooWeak implements ValidatorConstraintInterface {
  validate(password: string) {
    if (password.length < 4) return false;
    const simplePass = new RegExp(
      "/((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/"
    );
    if (password.match(simplePass)) return false;
    if (passwords.includes(password)) return false;
    return true;
  }
}

// Custom decorator is a factory function that gets called on the class
export function IsPasswordTooWeak(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isPasswordTooWeak,
    });
  };
}
