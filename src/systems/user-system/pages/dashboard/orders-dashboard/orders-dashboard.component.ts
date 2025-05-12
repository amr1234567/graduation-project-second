import { Component, DestroyRef, inject, signal } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { NotificationContext } from '../../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../../shared/models/notification.model';
import { OrderModel } from '../../../../../app/models/order.model';
import { CommonModule } from '@angular/common';
import { PaginationContext } from '../../../../../shared/contexts/pagination.context';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.scss'
})
export class OrdersDashboardComponent {
  private service = inject(OrdersService);
  private destroyRef = inject(DestroyRef);
  private _notificationCtx = inject(NotificationContext);
  private _paginationCtx = inject(PaginationContext);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  orders = signal<OrderModel[]>([]);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const sub = this.service.getAllOrders()
      .subscribe(orders => {
        this.orders.set(orders.orders);
        this._paginationCtx.setPaginationState({
          currentPage: orders.page,
          totalPages: orders.totalPages,
          onPageChange: this.onPageChange
        });
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  delete(order: OrderModel) {
    if (!confirm(`Delete order #${order.orderId}?`)) return;
    this.service.deleteOrder(order.orderId).subscribe(() => {
      this.orders.update(list => list.filter(o => o.orderId !== order.orderId));
      this._notificationCtx.addNotification("Order deleted successfully", NotificationTypeEnum.Success);
    });
  }

  onPageChange = (page: number, size: number = 10) => {
    if (page === this._paginationCtx.currentPage()) return;

    this._paginationCtx.setPaginationState({
      currentPage: page,
      totalPages: this._paginationCtx.totalPages() || 1,
      onPageChange: (page) => this.onPageChange(page)
    });
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { page, size },
      queryParamsHandling: 'merge'
    });
  }
}
