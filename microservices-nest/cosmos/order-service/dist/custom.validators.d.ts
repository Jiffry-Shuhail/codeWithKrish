import { ValidationOptions, ValidatorConstraintInterface } from "class-validator";
export declare class IsNotEmptyOrWhitespaceConstraint implements ValidatorConstraintInterface {
    validate(text: string): boolean;
    defaultMessage(): string;
}
export declare function IsNotEmptyOrWhitespace(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
