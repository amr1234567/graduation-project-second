import { Component, Input, Output, EventEmitter, input, output, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../models/basket.model';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
    cartItem = input.required<CartItem>();
    increaseQuantity = output<string>();
    decreaseQuantity = output<string>();
    saveQuantity = output<{ id: string, quantity: number }>();
    removeItem = output<string>();

    quantity = signal(0);
    originalQuantity = signal(0);

    ngOnInit() {
        this.quantity.set(this.cartItem().quentity);
        this.originalQuantity.set(this.cartItem().quentity);
    }

    increaseQuantityFn() {
        this.quantity.set(this.quantity() + 1);
    }

    decreaseQuantityFn() {
        if (this.quantity() > 1) {
            this.quantity.set(this.quantity() - 1);
        }
    }

    saveQuantityFn() {
        this.originalQuantity.set(this.quantity());
        this.saveQuantity.emit({ id: this.cartItem().id, quantity: this.originalQuantity() });
    }

    resetQuantityFn() {
        this.quantity.set(this.originalQuantity());
    }

    removeProductFn() {
        this.removeItem.emit(this.cartItem().id);
    }
}
