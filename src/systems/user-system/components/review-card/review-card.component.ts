import { Component, input } from '@angular/core';
import { ReviewModel } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-review-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './review-card.component.html',
    styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {
    review = input.required<ReviewModel>();
} 