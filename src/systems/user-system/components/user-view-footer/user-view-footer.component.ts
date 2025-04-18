import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-view-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './user-view-footer.component.html',
  styleUrl: './user-view-footer.component.scss'
})
export class UserViewFooterComponent {
  address: string = "Tanta - Garbia - Egypt";

  get currentYear(){
    return new Date().getFullYear();
  }
}
