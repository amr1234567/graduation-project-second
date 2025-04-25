import {Component, DestroyRef, inject} from '@angular/core';
import {AuthPagesHeaderComponent} from '../../components/auth-pages-header/auth-pages-header.component';
import {CustomFormInputComponent} from '../../../../shared/components/custom-form-input/custom-form-input.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SendButtonComponent} from '../../components/send-button/send-button.component';
import {AuthService, RegisterRequest} from '../../services/auth.service';
import {NotificationContext} from '../../../../shared/contexts/notification.context';
import {Router, RouterLink} from '@angular/router';
import {passwordComplexityValidator} from '../../validators/password-complexity.validator';
import {switchMap, throwError} from 'rxjs';
import {NotificationTypeEnum} from '../../../../shared/models/notification.model';
import UserContext from '../../../../shared/contexts/user.context';
import {confirmPasswordValidator} from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    AuthPagesHeaderComponent,
    CustomFormInputComponent,
    ReactiveFormsModule,
    SendButtonComponent,
    RouterLink
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {
  private authService = inject(AuthService);
  private notificationCtx = inject(NotificationContext);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private userCtx = inject(UserContext);

  signUpForm = new FormGroup({
    name : new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), passwordComplexityValidator]),
    confirmPassword: new FormControl("", [Validators.required, Validators.minLength(8), passwordComplexityValidator])
  }, { validators: confirmPasswordValidator });

  submit() {
    if (this.signUpForm.invalid){
      this.notificationCtx.addNotification("the from is invalid", NotificationTypeEnum.Error);
      return;
    }
    const params : RegisterRequest = {
      email : this.signUpForm.value.email!,
      password : this.signUpForm.value.password!,
      name : this.signUpForm.value.name!,
      confirmPassword : this.signUpForm.value.confirmPassword!,
    }
    const conn = this.authService.register(params)
      .pipe(switchMap(d => {
        if(d)
          return this.authService.login(this.signUpForm.value.email!, this.signUpForm.value.password!);

        this.notificationCtx.addNotification("can't sign up correctly", NotificationTypeEnum.Error);
        return throwError("can't sign up correctly");
      }))
      .subscribe(d => {
        if(d){
          this.notificationCtx.addNotification("Welcome back :)", NotificationTypeEnum.Success);
          this.router.navigate(this.userCtx.getRoute());
        } else
          this.notificationCtx.addNotification("can't sign up correctly", NotificationTypeEnum.Error);
      });

    this.destroyRef.onDestroy(() => conn.unsubscribe());
  }
}
