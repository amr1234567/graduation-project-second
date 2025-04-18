import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'auth-decorator-layout',
  template: `
    <router-outlet/>`,
  imports: [
    RouterOutlet
  ]
})
export default class AuthDecoratorLayoutComponent {
}
