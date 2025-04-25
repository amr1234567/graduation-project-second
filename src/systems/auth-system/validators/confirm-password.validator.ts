import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm  = control.get('confirmPassword');

  // if either control is missing, we can't compare yet
  if (!password || !confirm) return null;

  // if they match, clear any mismatch error
  if (password.value === confirm.value) {
    confirm.setErrors(null);
    return null;
  }

  // else, set a mismatch error on the confirmPassword control
  confirm.setErrors({ passwordMismatch: true });
  return { passwordMismatch: true };
};
