import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { User } from "../../entity/User";

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExists implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email } }).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

// Custom decorator is a factory function that gets called on the class
export function IsEmailAlreadyExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyExists,
    });
  };
}
