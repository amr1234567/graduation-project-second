import {Component, DestroyRef, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {CustomFormInputComponent} from '../../../../shared/components/custom-form-input/custom-form-input.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {passwordComplexityValidator} from '../../validators/password-complexity.validator';
import {AuthService} from '../../services/auth.service';
import {NotificationContext} from '../../../../shared/contexts/notification.context';
import UserContext from '../../../../shared/contexts/user.context';
import {NotificationTypeEnum} from '../../../../shared/models/notification.model';
import {AuthPagesHeaderComponent} from '../../components/auth-pages-header/auth-pages-header.component';
import {SendButtonComponent} from '../../components/send-button/send-button.component';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    CustomFormInputComponent,
    ReactiveFormsModule,
    AuthPagesHeaderComponent,
    SendButtonComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private authServices = inject(AuthService);
  private notificationCtx = inject(NotificationContext);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private userCtx = inject(UserContext);

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8), passwordComplexityValidator])
  })


  login(){
    if(this.loginForm.invalid){
      this.notificationCtx.addNotification("Data isn't correct", NotificationTypeEnum.Error);
      return;
    }
    const conn = this.authServices.login(this.loginForm.value.email ?? "", this.loginForm.value.password ?? "")
      .subscribe(d => {
        if(d)
          this.router.navigate(this.userCtx.getRoute());
      });
    this.destroyRef.onDestroy(() => conn.unsubscribe());
  }
}
