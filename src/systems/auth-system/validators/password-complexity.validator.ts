import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
      return null; // Let required validator handle empty values
    }

    // Regular expressions to test each requirement:
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    // Adjust the special character set as needed.
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;

    if (!valid) {
      return {
        passwordComplexity: {
          hasUpperCase,
          hasLowerCase,
          hasDigit,
          hasSpecialChar
        }
      };
    }
    return null;
  };
}
