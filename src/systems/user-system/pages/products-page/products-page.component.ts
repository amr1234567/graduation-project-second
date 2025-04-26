import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { paginationModel } from '../../services/products.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface CategoryCount {
  id: string;
  name: string;
  count: number;
}

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
  categoriesWithCount = signal<CategoryCount[]>([]);
  featuredProduct = signal<ProductModel | null>(null);
  processingProduct = signal<{ [key: string]: { fav: boolean, cart: boolean } }>({});

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Load categories first
    this.loadCategories();

    // Subscribe to route params
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      if (categoryId) {
        this.selectedCategory.set(categoryId);
      }
      this.loadProducts();
    });
  }

  private loadCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.updateCategoryCounts();
      },
      error: (err) => {
        this.error.set('Failed to load categories');
        console.error('Error loading categories:', err);
      }
    });
  }

  private updateCategoryCounts() {
    const counts = this.products().reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.categoriesWithCount.set(
      this.categories().map(cat => ({
        id: cat.id,
        name: cat.name,
        count: counts[cat.id] || 0
      }))
    );
  }

  private loadProducts() {
    this.isLoading.set(true);
    const query = {
      sort: null,
      categoryId: this.selectedCategory(),
      pageSize: 20,
      pageIndex: 1,
      search: null,
      dateFrom: null,
      dateTo: null
    };

    this.productsService.getAllProducts(query).subscribe({
      next: (response: paginationModel<ProductModel>) => {
        this.products.set(response.data);
        this.updateCategoryCounts();
        this.updateFeaturedProduct();
        this.isLoading.set(false);
      },
      error: (err) => {
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
    this.isLoading.set(true);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge'
    });
  }

  addToFavorites(product: ProductModel) {
    const currentProcessing = this.processingProduct();
    if (currentProcessing[product.productId]?.fav) return;

    this.updateProcessingState(product.productId, 'fav', true);

    this.productsService.addProductToFavorite(product.productId).subscribe({
      next: () => {
        console.log('Added to favorites successfully');
      },
      error: (err) => {
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

    this.productsService.addProductToBasket(product.productId).subscribe({
      next: () => {
        console.log('Added to cart successfully');
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      },
      complete: () => {
        this.updateProcessingState(product.productId, 'cart', false);
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
