import { Component } from '@angular/core';
import {UserViewHeaderComponent} from '../../components/user-view-header/user-view-header.component';
import {RouterLink} from '@angular/router';
import {NewArrivalsSectionComponent} from './new-arrivals-section/new-arrivals-section.component';

@Component({
  selector: 'app-main-page',
  imports: [
    RouterLink,
    NewArrivalsSectionComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
