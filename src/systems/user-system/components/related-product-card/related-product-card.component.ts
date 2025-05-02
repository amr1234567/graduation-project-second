import { Component, input, output } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-related-product-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './related-product-card.component.html',
    styleUrl: './related-product-card.component.scss'
})
export class RelatedProductCardComponent {
    product = input.required<ProductModel>();
    addToCart = output<ProductModel>();
    addToFavorites = output<ProductModel>();
} 