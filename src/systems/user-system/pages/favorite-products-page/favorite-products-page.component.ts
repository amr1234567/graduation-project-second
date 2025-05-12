import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CartItem } from '../../models/basket.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationContext } from '../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../shared/models/notification.model';
import { PaginationContext } from '../../../../shared/contexts/pagination.context';

@Component({
  selector: 'app-favorite-products-page',
  imports: [CommonModule],
  templateUrl: './favorite-products-page.component.html',
  styleUrl: './favorite-products-page.component.scss'
})
export class FavoriteProductsPageComponent {
  private _productServices = inject(ProductsService);
  private _destroyRef = inject(DestroyRef);
  private _notCtx = inject(NotificationContext);

  favoriteProducts = signal<CartItem[]>([])

  constructor(private _paginationCtx: PaginationContext) {
    _paginationCtx.clearPaginationState();
  }

  ngOnInit(): void {
    const conn = this._productServices.getFavoriteProducts().subscribe(v => {
      this.favoriteProducts.set(v.items);
    })
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  toggleFavorite(product: CartItem): void {
    const conn = this._productServices.removeProductFromFavorite(product.id).subscribe({
      next: (v) => {
        this._notCtx.addNotification("Product deleted from favorite", NotificationTypeEnum.Success);
        const index = this.favoriteProducts().findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.favoriteProducts().splice(index, 1);
        }
      }, error: (err) => {
        this._notCtx.addNotification("Failed to remove product from favorites", NotificationTypeEnum.Error, 3000);
        console.error('Error removing from favorites:', err);
      }
    })
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

}