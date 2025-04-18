import { Component } from '@angular/core';
import {UserViewHeaderComponent} from '../../components/user-view-header/user-view-header.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [
    UserViewHeaderComponent,
    RouterLink
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
