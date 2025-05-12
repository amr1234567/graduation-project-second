import { Component, inject, signal, computed, DestroyRef, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalServices } from '../../services/global.service';
import { DeliveryMethod } from '../../models/delivery-method.model';
import { CreateOrderDto } from '../../models/order.model';
import { NotificationContext } from '../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../shared/models/notification.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-checkout-overlay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-overlay.component.html',
  styleUrls: ['./checkout-overlay.component.scss']
})
export class CheckoutOverlayComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(GlobalServices);
  private _destroyRef = inject(DestroyRef);
  private _notificationCtx = inject(NotificationContext);

  onSuccess = output();

  isOpen = signal(false);
  deliveryMethods = signal<DeliveryMethod[]>([]);
  selectedDeliveryMethod = signal<DeliveryMethod | null>(null);
  isSubmitting = signal(false);

  isFormValid = computed(() => this.addressForm.valid);

  // نمط التحقق من رقم الهاتف المصري
  private readonly phonePattern = '^(010|011|012|015)[0-9]{8}$';

  addressForm: FormGroup;
  constructor() {
    this.addressForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      Country: ['', [Validators.required]],
      // phone: ['', [
      //   Validators.required,
      //   Validators.pattern(this.phonePattern),
      //   Validators.minLength(11),
      //   Validators.maxLength(11)
      // ]],
      deliveryMethodId: ['', [Validators.required]]
    });

    this.loadDeliveryMethods();
  }

  loadDeliveryMethods() {
    const conn = this.apiService.getDeliveryMethods().subscribe({
      next: (methods) => {
        this.deliveryMethods.set(methods);
      },
      error: (error) => {
        console.error('Error loading delivery methods:', error);
      }
    });
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.addressForm.reset();
    this.selectedDeliveryMethod.set(null);
    this.isSubmitting.set(false);
  }

  onDeliveryMethodChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const methodId = select.value;
    const method = this.deliveryMethods().find(m => m.id === methodId) || null;
    this.selectedDeliveryMethod.set(method);
  }

  onSubmit() {
    if (this.isFormValid() && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      const orderData: CreateOrderDto = {
        deliveryMethodId: this.addressForm.get('deliveryMethodId')?.value,
        shippingAddress: {
          firstName: this.addressForm.get('firstName')?.value,
          lastName: this.addressForm.get('lastName')?.value,
          street: this.addressForm.get('street')?.value,
          city: this.addressForm.get('city')?.value,
          Country: this.addressForm.get('Country')?.value
        }
      };

      const conn = this.apiService.createOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          this._notificationCtx.addNotification("Order Done Successfully", NotificationTypeEnum.Success);
          this.onSuccess.emit();
          this.close();
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this._notificationCtx.addNotification("Order Failed", NotificationTypeEnum.Error);
          this.isSubmitting.set(false);
        }
      });

      this._destroyRef.onDestroy(() => conn.unsubscribe());
    }
  }
} 