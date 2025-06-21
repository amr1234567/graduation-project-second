import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { FormControl, FormsModule, NgModel } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';
import { RelatedProductsSectionComponent } from '../../components/related-products-section/related-products-section.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import UserContext from '../../../../shared/contexts/user.context';
import { PaginationContext } from '../../../../shared/contexts/pagination.context';

interface RatingCircle {
  index: number;
  color: string;
  active: boolean;
  onHover: boolean;
}

@Component({
  selector: 'app-product-details-page',
  imports: [
    CommonModule,
    FormsModule,
    ReviewCardComponent,
    RelatedProductsSectionComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss'
})
export class ProductDetailsPageComponent implements OnInit {

  private _productServices = inject(ProductsService);
  private _destroyRef = inject(DestroyRef);
  private _route = inject(ActivatedRoute);
  private _ctx = inject(UserContext);

  /**
   *
   */
  constructor(private _paginationCtx: PaginationContext) {
    _paginationCtx.clearPaginationState();
  }

  product = signal<ProductModel | null>(null)
  activeTab = signal<"description" | "reviews">("description");
  quantity = signal(1);
  showReviewForm = signal(false);
  selectedRating = signal(0);
  hoverRating = signal(0);
  reviewComment = signal<string>("");

  ratingCircles = signal<RatingCircle[]>([
    { index: 1, color: '#ff0000', active: false, onHover: false },
    { index: 2, color: '#ffa500', active: false, onHover: false },
    { index: 3, color: '#ffff00', active: false, onHover: false },
    { index: 4, color: '#0000ff', active: false, onHover: false },
    { index: 5, color: '#00ff00', active: false, onHover: false }
  ])

  getCircleColor(index: number): string {
    const selectedCircle = this.ratingCircles().find(circle => circle.index === this.selectedRating());
    if (selectedCircle && index <= selectedCircle.index) {
      return selectedCircle.color;
    }
    return 'transparent';
  }

  ngOnInit(): void {
    const conn = this._route.paramMap.pipe(switchMap(d => {
      const productId = d.get("productId") as string;
      return this._productServices.getProductById(productId);
    })).subscribe(d => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // <-- scroll to top
      this.product.set(d);
    })
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  increaseQuantity(): void {
    if (this.quantity() < (this.product()?.stockQuantity || 0)) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  setActiveTab(tab: "description" | "reviews"): void {
    this.activeTab.set(tab);
  }

  addToCart(): void {
    if (this.product() === null)
      return;
    const conn = this._productServices.addProductToBasket(this.product()?.productId!, this.quantity()).subscribe(d => {
      this.product.update(v => ({ ...v, isInCart: !v?.isInCart } as ProductModel));
    });
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  addToFav() {
    if (this.product() === null)
      return;
    const productId = this.product()?.productId;
    console.log(productId);
    const conn = this._productServices.addProductToFavorite(this.product()?.productId!).subscribe(d => {
      this.product.update(v => ({ ...v, isInFav: !v?.isInFav } as ProductModel));
    });
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  removeFromFav() {
    if (this.product() === null)
      return;
    const conn = this._productServices.removeProductFromFavorite(this.product()?.productId!).subscribe(d => {
      this.product.update(v => ({ ...v, isInFav: !v?.isInFav } as ProductModel));
    });
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  removeFromCart() {
    if (this.product() === null)
      return;
    const conn = this._productServices.removeProductFromBasket(this.product()?.productId!, this.quantity()).subscribe(d => {
      this.product.update(v => ({ ...v, isInCart: !v?.isInCart } as ProductModel));
    });
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }

  openAddReviewModal() {
    // TODO: Implement modal opening logic
    this.product.update(v => ({
      ...v, makeReviews: [...v?.makeReviews ?? [], {
        appUserId: this._ctx.user()?.userId,
        comment: this.reviewComment(),
        createdAt: new Date(),
        numberOfPoint: this.selectedRating()
      }]
    } as ProductModel));
    console.log('Opening add review modal');
  }

  toggleReviewForm() {
    this.showReviewForm.update(value => !value);
    if (!this.showReviewForm()) {
      this.resetReviewForm();
    }
  }

  hoverRate(index: number) {
    this.ratingCircles.update(v => v.map(c => {
      if (index >= c.index)
        return { ...c, onHover: true };
      return { ...c, onHover: false };
    }))
  }

  setRating(rating: number) {
    this.selectedRating.set(rating);
    this.ratingCircles().forEach(circle => {
      circle.active = circle.index <= rating;
    });
  }

  resetReviewForm() {
    this.selectedRating.set(0);
    this.hoverRating.set(0);
    this.reviewComment.set("");
    this.ratingCircles().forEach(circle => {
      circle.active = false;
    });
  }

  submitReview() {
    if (!this.product() || !this.selectedRating() || !this.reviewComment) {
      return;
    }

    // TODO: Implement review submission logic
    console.log('Submitting review:', {
      productId: this.product()?.productId,
      rating: this.selectedRating(),
      comment: this.reviewComment
    });

    // Reset form after submission
    this.resetReviewForm();
    this.showReviewForm.set(false);
  }
}
