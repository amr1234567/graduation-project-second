import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { ProductsService } from '../../services/products.service';
import { CartItem } from '../../models/basket.model';
import { PaginationContext } from '../../../../shared/contexts/pagination.context';
import { CheckoutOverlayComponent } from '../../components/checkout-overlay/checkout-overlay.component';
import { NotificationContext } from '../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../shared/models/notification.model';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CheckoutOverlayComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {
  private _productServices = inject(ProductsService);
  private _destroyRef = inject(DestroyRef);
  private _notificationCtx = inject(NotificationContext);

  @ViewChild('checkoutOverlay') checkoutOverlay!: CheckoutOverlayComponent;

  cartItems = signal<CartItemWithEdit[]>([]);

  cartSummary = signal<CartSummary>({
    subtotal: 0,
    shippingFee: 20,
    coupon: null,
    total: 0
  });

  constructor(private _paginationCtx: PaginationContext) {
    _paginationCtx.clearPaginationState();
  }

  ngOnInit(): void {
    const conn = this._productServices.getCartItems().subscribe(v => {
      const items = v.basketItems.map(item => ({
        ...item,
        unitPrice: item.price / item.quantity,
        isEditing: false,
        originalQuantity: item.quantity,
        editedQuantity: item.quantity
      }));
      this.cartItems.set(items);
      this.calculateSummary();
    })
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  editQuantity(index: number, newQuantity: number): void {
    this.cartItems.update(v => v.map((o, i) => {
      if (i == index)
        return { ...o, isEditing: true, editedQuantity: newQuantity };
      return o;
    }))
  }

  saveQuantity(index: number): void {
    this.cartItems.update(v => v.map((o, i) => {
      if (i == index) {
        this.update(o)
        return {
          ...o,
          isEditing: false,
          quantity: o.editedQuantity,
          price: o.unitPrice * o.quantity,
          originalQuantity: o.quantity
        };
      }
      return o;
    }))
    this.calculateSummary();
  }

  private update(o: CartItemWithEdit) {
    const conn = this._productServices.addProductToBasket(o.id, o.editedQuantity - o.quantity).subscribe(v => {
      this._notificationCtx.addNotification("basket item updated", NotificationTypeEnum.Success);
    })
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  resetQuantity(index: number): void {
    const items = [...this.cartItems()];
    items[index].editedQuantity = items[index].originalQuantity;
    items[index].isEditing = false;
    this.cartItems.set(items);
  }

  deleteItem(index: number): void {
    const items = [...this.cartItems()];
    items.splice(index, 1);
    this.cartItems.set(items);
    this.calculateSummary();
  }

  calculateSummary(): void {
    this.cartSummary.update(summary => ({
      ...summary,
      subtotal: this.cartItems().reduce((sum, item) => sum + item.price, 0),
      total: this.cartItems().reduce((sum, item) => sum + item.price, 0) + summary.shippingFee
    }));
  }

  checkout(): void {
    this.checkoutOverlay.open();
  }

  orderCreated() {
    this.cartSummary.set({
      subtotal: 0,
      shippingFee: 20,
      coupon: null,
      total: 0
    });
    this.cartItems.set([]);
  }
}

export interface CartSummary {
  subtotal: number;
  shippingFee: number;
  coupon: string | null;
  total: number;
}

interface CartItemWithEdit extends CartItem {
  unitPrice: number;
  isEditing: boolean;
  originalQuantity: number;
  editedQuantity: number;
}
