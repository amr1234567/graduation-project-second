import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DeliveryMethodsService } from '../../../services/delivery-methods.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeliveryMethod } from '../../../models/delivery-method.model';
import { NotificationContext } from '../../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../../shared/models/notification.model';
import { FormsModule } from '@angular/forms';
import { TableCellComponent } from '../table-cell/table-cell.component';
import { PaginationContext } from '../../../../../shared/contexts/pagination.context';

@Component({
  selector: 'app-delivery-methods-dashboard',
  standalone: true,
  imports: [TableCellComponent, FormsModule],
  templateUrl: './delivery-methods-dashboard.component.html',
  styleUrl: './delivery-methods-dashboard.component.scss'
})
export class DeliveryMethodsDashboardComponent {
  private service = inject(DeliveryMethodsService);
  private destroyRef = inject(DestroyRef);
  private _notificationCtx = inject(NotificationContext);
  private _paginationCtx = inject(PaginationContext);

  deliveryMethods = signal<DeliveryMethod[]>([]);
  isAdding = signal(false);
  newMethod = {
    shortName: '',
    description: '',
    deliveryTime: '',
    cost: 0
  };

  ngOnInit() {
    this.loadDeliveryMethods();
    this._paginationCtx.setPaginationState({
      currentPage: 1,
      totalPages: 1,
      onPageChange: () => { }
    });
  }

  loadDeliveryMethods() {
    const sub = this.service.getAllDeliveryMethods()
      .subscribe(methods => {
        this.deliveryMethods.set(methods);
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  updateField(method: DeliveryMethod, field: keyof DeliveryMethod, value: any) {
    this.service.updateDeliveryMethod(method.id, { [field]: value })
      .subscribe(updatedMethod => {
        this.deliveryMethods.update(list =>
          list.map(m => m.id === updatedMethod.id ? updatedMethod : m)
        );
        this._notificationCtx.addNotification("Delivery method updated successfully", NotificationTypeEnum.Success);
      });
  }

  delete(method: DeliveryMethod) {
    if (!confirm(`Delete delivery method ${method.shortName}?`)) return;
    this.service.deleteDeliveryMethod(method.id).subscribe(() => {
      this.deliveryMethods.update(list => list.filter(m => m.id !== method.id));
      this._notificationCtx.addNotification("Delivery method deleted successfully", NotificationTypeEnum.Success);
    });
  }

  showAddForm() {
    this.isAdding.set(true);
    this.newMethod = {
      shortName: '',
      description: '',
      deliveryTime: '',
      cost: 0
    };
  }

  cancelAdd() {
    this.isAdding.set(false);
  }

  createMethod() {
    if (!this.newMethod.shortName || !this.newMethod.description || !this.newMethod.deliveryTime) {
      this._notificationCtx.addNotification("Please fill all required fields", NotificationTypeEnum.Error);
      return;
    }

    this.service.createDeliveryMethod(this.newMethod).subscribe(method => {
      if (method)
        this.deliveryMethods.update(list => [...list, method]);
      this.isAdding.set(false);
      this._notificationCtx.addNotification("Delivery method created successfully", NotificationTypeEnum.Success);
    });
  }
}
