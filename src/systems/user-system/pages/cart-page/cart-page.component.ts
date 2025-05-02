import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { ProductsService } from '../../services/products.service';
import { CartItem } from '../../models/basket.model';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {
  private _productServices = inject(ProductsService);
  private _destroyRef = inject(DestroyRef);
  cartItems = signal<CartItem[]>([]);

  cartSummary: CartSummary = {
    subtotal: 0,
    shippingFee: 20,
    coupon: null,
    total: 0
  };

  constructor() { }

  ngOnInit(): void {
    const conn = this._productServices.getCartItems().subscribe(v => {
      this.cartItems.set(v.basketItems);
    })
    this._destroyRef.onDestroy(() => conn.unsubscribe());
    this.calculateSummary();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quentity > 1) {
      item.quentity--;
      item.price = item.price * item.quentity;
      this.calculateSummary();
    }
  }

  increaseQuantity(item: CartItem): void {
    item.quentity++;
    item.price = item.price * item.quentity;
    this.calculateSummary();
  }

  calculateSummary(): void {
    this.cartSummary.subtotal = this.cartItems().reduce((sum, item) => sum + item.price, 0);
    this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.shippingFee;
  }

  checkout(): void {
    console.log('Proceeding to checkout with items:', this.cartItems);
    console.log('Order summary:', this.cartSummary);
    // Implement checkout logic or navigate to checkout page
  }
}


export interface CartSummary {
  subtotal: number;
  shippingFee: number;
  coupon: string | null;
  total: number;
}
