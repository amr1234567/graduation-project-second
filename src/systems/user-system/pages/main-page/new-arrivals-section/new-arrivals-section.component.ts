import { Component, computed, DestroyRef, inject, type OnInit, signal } from "@angular/core"
import type { ProductModel } from "../../../models/product.model"
import { type paginationModel, ProductsService } from "../../../services/products.service"
import type { CategoryModel } from "../../../models/category.model"
import { CategoriesService } from "../../../services/categories.service"
import { ActivatedRoute, Router } from "@angular/router"
import { BreakpointObserver } from "@angular/cdk/layout"

@Component({
  selector: "app-new-arrivals-section",
  templateUrl: "./new-arrivals-section.component.html",
  styleUrls: ["./new-arrivals-section.component.scss"],
})
export class NewArrivalsSectionComponent implements OnInit {
  private productsServices = inject(ProductsService)
  private categoriesServices = inject(CategoriesService)
  private _destroyRef = inject(DestroyRef)
  private _router = inject(Router)
  private _route = inject(ActivatedRoute)
  private _bp = inject(BreakpointObserver)

  products = signal<paginationModel<ProductModel>>({
    count: 0,
    pageSize: 0,
    pageIndex: 1,
    data: [],
  })
  categories = signal<CategoryModel[]>([])
  categoryId = signal<string>("")
  page = signal<number>(1)
  isSmallScreen$ = computed<boolean | undefined>(() => false)

  ngOnInit(): void {
    const categorySelectConn = this._route.queryParams.subscribe((d) => {
      this.categoryId.set(d["categoryId"] || "")
    })

    const productsConn = this.productsServices
      .getAllProducts({
        pageIndex: 1,
        dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        dateTo: null,
        categoryId: this.categoryId(),
        search: null,
        sort: null,
        pageSize: 50,
      })
      .subscribe((d) => {
        this.products.set(d)
      })

    const categoriesConn = this.categoriesServices.getAllCategories().subscribe((d) => {
      this.categories.set([...d])
    })

    this._destroyRef.onDestroy(() => {
      productsConn.unsubscribe()
      categoriesConn.unsubscribe()
      categorySelectConn.unsubscribe()
    })
  }

  getRouteForCategory(id: string) {
    this._router.navigate([], {
      queryParams: {
        categoryId: id,
      },
    })

    // Reset page when changing category
    this.page.set(1)

    const productsConn = this.productsServices
      .getAllProducts({
        pageIndex: 1,
        dateFrom: new Date(Date.now() - 1000 * 24 * 60 * 60 * 1000),
        dateTo: null,
        categoryId: id,
        search: null,
        sort: null,
        pageSize: 50,
      })
      .subscribe((d) => {
        this.products.set(d)
      })

    this._destroyRef.onDestroy(() => productsConn.unsubscribe())
  }

  getStarsForProduct(rate: number): boolean[] {
    const stars: boolean[] = []
    for (let num = 0; num < rate; num++) {
      stars.push(true)
    }
    for (let num = 0; num < 5 - rate; num++) {
      stars.push(false)
    }
    return stars
  }

  get productsShown() {
    const startIndex = (this.page() - 1) * 4
    const endIndex = startIndex + 4
    return this.products().data.slice(startIndex, endIndex)
  }

  // Fixed pagination methods
  onNext() {
    if (this.page() * 4 < this.products().data.length) {
      this.page.set(this.page() + 1)
    }
  }

  onBack() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1)
    }
  }

  // Add these methods for the new action buttons
  toggleFavorite(product: ProductModel) {
    if (product.isInFav) {
      this.productsServices.removeProductFromFavorite(product.productId).subscribe(() => {
        // Update product state
        this.updateProductState(product.productId, { isInFav: false })
      })
    } else {
      this.productsServices.addProductToFavorite(product.productId).subscribe(() => {
        // Update product state
        this.updateProductState(product.productId, { isInFav: true })
      })
    }
  }

  addToCart(product: ProductModel) {
    if (product.isInCart) {
      this.productsServices.removeProductFromBasket(product.productId).subscribe(() => {
        // Update product state
        this.updateProductState(product.productId, { isInCart: false })
      })
    } else {
      this.productsServices.addProductToBasket(product.productId).subscribe(() => {
        // Update product state
        this.updateProductState(product.productId, { isInCart: true })
      })
    }
  }

  private updateProductState(productId: string, updates: Partial<ProductModel>) {
    this.products.update((currentProducts) => {
      return {
        ...currentProducts,
        data: currentProducts.data.map((p) => (p.productId === productId ? { ...p, ...updates } : p)),
      }
    })
  }
}
