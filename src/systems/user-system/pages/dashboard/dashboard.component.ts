import { Component, inject, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { PaginationContext } from '../../../../shared/contexts/pagination.context';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    this._paginationCtx.clearPaginationState();
  }
  private _paginationCtx = inject(PaginationContext)

}
