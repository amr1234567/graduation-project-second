import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { RelatedProductCardComponent } from '../related-product-card/related-product-card.component';

@Component({
    selector: 'app-related-products-section',
    standalone: true,
    imports: [CommonModule, RelatedProductCardComponent],
    templateUrl: './related-products-section.component.html',
    styleUrl: './related-products-section.component.scss'
})
export class RelatedProductsSectionComponent implements OnInit {
    private _productsService = inject(ProductsService);
    private _destroyRef = inject(DestroyRef);

    categoryId = input.required<string>();
    currentProductId = input.required<string>();

    relatedProducts = signal<ProductModel[]>([]);
    page = signal(1);
    pageSize = 4;


    constructor() {

    }
    ngOnInit(): void {
        this.loadRelatedProducts();
    }

    private loadRelatedProducts(): void {
        const conn = this._productsService.getAllProducts({
            pageIndex: this.page(),
            pageSize: this.pageSize,
            categoryId: this.categoryId(),
            sort: null,
            search: null,
            dateFrom: null,
            dateTo: null
        }).subscribe(response => {
            // Filter out the current product
            this.relatedProducts.set(
                response.data.filter(product => product.productId !== this.currentProductId())
            );
        });

        this._destroyRef.onDestroy(() => conn.unsubscribe());
    }

    onAddToCart(product: ProductModel): void {
        this._productsService.addProductToBasket(product.productId, 1).subscribe();
    }

    onAddToFavorites(product: ProductModel): void {
        this._productsService.addProductToFavorite(product.productId).subscribe();
    }
} 