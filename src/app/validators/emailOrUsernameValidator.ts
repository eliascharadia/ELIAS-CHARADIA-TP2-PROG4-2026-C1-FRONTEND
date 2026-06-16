import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailOrUsernameValidator(control: AbstractControl): ValidationErrors | null {

    const value = control.value;

    if (!value) {
        return null;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isEmail =
        emailRegex.test(value);

    const isUsername =
        value.length >= 4;

    return isEmail || isUsername
        ? null
        : { invalidLogin: true };
}