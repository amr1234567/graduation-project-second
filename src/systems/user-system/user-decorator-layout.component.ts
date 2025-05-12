import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserViewHeaderComponent} from './components/user-view-header/user-view-header.component';
import {UserViewFooterComponent} from './components/user-view-footer/user-view-footer.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@Component({
  selector: 'user-system-layout',
  imports: [
    RouterOutlet,
    UserViewHeaderComponent,
    UserViewFooterComponent,
    PaginationComponent
  ],
  template: `
    <app-user-view-header />
    <router-outlet />
    <app-pagination />
    <app-user-view-footer />
  `,
})
export default class UserDecoratorLayoutComponent {
}
