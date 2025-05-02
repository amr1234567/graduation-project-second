import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { paginationModel } from '../../services/products.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination/pagination.component';
import { NotificationContext } from '../../../../shared/contexts/notification.context';
import { PaginationContext } from '../../../../shared/contexts/pagination.context';
import { NotificationTypeEnum } from '../../../../shared/models/notification.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent implements OnInit {

  categories = signal<CategoryModel[]>([]);
  products = signal<ProductModel[]>([]);
  selectedCategory = signal<string | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  featuredProduct = signal<ProductModel | null>(null);
  processingProduct = signal<{ [key: string]: { fav: boolean, cart: boolean } }>({});
  pageSize = 20;

  private destroyRef = inject(DestroyRef);

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private notCtx: NotificationContext,
    private paginationService: PaginationContext
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const categoryId = params['categoryId'];
        const page = params['page'] ? parseInt(params['page']) : 1;
        const query = params["search"] as string;
        this.paginationService.setPaginationState({
          currentPage: page,
          totalPages: 1,
          onPageChange: (page) => this.onPageChange(page)
        });
        if (categoryId) {
          this.selectedCategory.set(categoryId);
        }
        this.loadProducts(query);
      });
  }

  private loadCategories() {
    this.categoriesService.getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
        },
        error: (err) => {
          this.notCtx.addNotification("Failed to load categories", NotificationTypeEnum.Error, 3000);
          console.error('Error loading categories:', err);
        }
      });
  }

  private loadProducts(querySearch: string | null = null) {
    this.isLoading.set(true);
    const query = {
      sort: null,
      categoryId: this.selectedCategory(),
      pageSize: this.pageSize,
      pageIndex: this.paginationService.currentPage(),
      search: querySearch,
      dateFrom: null,
      dateTo: null
    };

    this.productsService.getAllProducts(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: paginationModel<ProductModel>) => {
          this.products.set(response.data);
          this.paginationService.setPaginationState({
            currentPage: this.paginationService.currentPage() || 1,
            totalPages: Math.ceil(response.totalCount / this.pageSize),
            onPageChange: (page) => this.onPageChange(page)
          });
          this.updateFeaturedProduct();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.notCtx.addNotification("Failed to load products", NotificationTypeEnum.Error, 3000);
          this.error.set('Failed to load products');
          this.isLoading.set(false);
          console.error('Error loading products:', err);
        }
      });
  }

  private updateFeaturedProduct() {
    const products = this.products();
    if (products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      this.featuredProduct.set(products[randomIndex]);
    }
  }

  selectCategory(categoryId: string) {
    if (categoryId === this.selectedCategory()) return;

    this.selectedCategory.set(categoryId);
    this.paginationService.setPaginationState({
      currentPage: 1,
      totalPages: this.paginationService.totalPages() || 1,
      onPageChange: (page) => this.onPageChange(page)
    });
    this.isLoading.set(true);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoryId: categoryId, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number) {
    if (page === this.paginationService.currentPage()) return;

    this.paginationService.setPaginationState({
      currentPage: page,
      totalPages: this.paginationService.totalPages() || 1,
      onPageChange: (page) => this.onPageChange(page)
    });
    this.isLoading.set(true);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  addToFavorites(product: ProductModel) {
    const currentProcessing = this.processingProduct();
    if (currentProcessing[product.productId]?.fav) return;

    this.updateProcessingState(product.productId, 'fav', true);

    this.productsService.addProductToFavorite(product.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notCtx.addNotification("Added to favorites successfully", NotificationTypeEnum.Success, 3000);
          this.products.update(v => v.map(p => p.productId == product.productId ? { ...p, isInFav: true } as ProductModel : p));
        },
        error: (err) => {
          this.notCtx.addNotification("Failed to add product to favorites", NotificationTypeEnum.Error, 3000);
          console.error('Error adding to favorites:', err);
        },
        complete: () => {
          this.updateProcessingState(product.productId, 'fav', false);
        }
      });
  }

  addToBasket(product: ProductModel) {
    const currentProcessing = this.processingProduct();
    if (currentProcessing[product.productId]?.cart) return;

    this.updateProcessingState(product.productId, 'cart', true);

    this.productsService.addProductToBasket(product.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notCtx.addNotification("Added to cart successfully", NotificationTypeEnum.Success, 3000);
          this.products.update(v => v.map(p => p.productId == product.productId ? { ...p, isInCart: true } as ProductModel : p));
        },
        error: (err) => {
          this.notCtx.addNotification("Failed to add product to cart", NotificationTypeEnum.Error, 3000);
          console.error('Error adding to cart:', err);
        },
        complete: () => {
          this.updateProcessingState(product.productId, 'cart', false);
        }
      });
  }

  removeToBasket(product: ProductModel) {
    const currentProcessing = this.processingProduct();
    if (currentProcessing[product.productId]?.cart) return;

    this.updateProcessingState(product.productId, 'cart', true);

    this.productsService.removeProductFromBasket(product.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notCtx.addNotification("Removed from cart successfully", NotificationTypeEnum.Success, 3000);
          this.products.update(v => v.map(p => p.productId == product.productId ? { ...p, isInCart: false } as ProductModel : p));
        },
        error: (err) => {
          this.notCtx.addNotification("Failed to remove product from cart", NotificationTypeEnum.Error, 3000);
          console.error('Error removing from cart:', err);
        },
        complete: () => {
          this.updateProcessingState(product.productId, 'cart', false);
        }
      });
  }

  removeFromFavorites(product: ProductModel) {
    const currentProcessing = this.processingProduct();
    if (currentProcessing[product.productId]?.fav) return;

    this.updateProcessingState(product.productId, 'fav', true);

    this.productsService.removeProductFromFavorite(product.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notCtx.addNotification("Removed from favorites successfully", NotificationTypeEnum.Success, 3000);
          this.products.update(v => v.map(p => p.productId == product.productId ? { ...p, isInFav: false } as ProductModel : p));
        },
        error: (err) => {
          this.notCtx.addNotification("Failed to remove product from favorites", NotificationTypeEnum.Error, 3000);
          console.error('Error removing from favorites:', err);
        },
        complete: () => {
          this.updateProcessingState(product.productId, 'fav', false);
        }
      });
  }

  private updateProcessingState(productId: string, type: 'fav' | 'cart', state: boolean) {
    const currentProcessing = this.processingProduct();
    this.processingProduct.set({
      ...currentProcessing,
      [productId]: {
        ...currentProcessing[productId],
        [type]: state
      }
    });
  }

  isProcessing(productId: string, type: 'fav' | 'cart'): boolean {
    return this.processingProduct()[productId]?.[type] || false;
  }

  get filteredProducts() {
    return this.products();
  }
}
