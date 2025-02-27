"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotEmptyOrWhitespaceConstraint = void 0;
exports.IsNotEmptyOrWhitespace = IsNotEmptyOrWhitespace;
const class_validator_1 = require("class-validator");
let IsNotEmptyOrWhitespaceConstraint = class IsNotEmptyOrWhitespaceConstraint {
    validate(text) {
        console.log('********************************************');
        return text.trim().length > 0;
    }
    defaultMessage() {
        return 'Text should not be empty or consist only of white spaces';
    }
};
exports.IsNotEmptyOrWhitespaceConstraint = IsNotEmptyOrWhitespaceConstraint;
exports.IsNotEmptyOrWhitespaceConstraint = IsNotEmptyOrWhitespaceConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsNotEmptyOrWhitespaceConstraint);
function IsNotEmptyOrWhitespace(validationOptions) {
    console.log('++++++++++++++++++++++++++++++++++++++++++');
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotEmptyOrWhitespaceConstraint,
        });
    };
}
//# sourceMappingURL=custom.validators.js.map