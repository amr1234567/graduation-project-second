import { Component, inject, type OnInit } from "@angular/core"
import { RouterLink } from "@angular/router"
import { NewArrivalsSectionComponent } from "./new-arrivals-section/new-arrivals-section.component"
import { PaginationContext } from "../../../../shared/contexts/pagination.context"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { forkJoin } from "rxjs"
import { ProductsService } from "../../services/products.service"
import { ProductModel } from "../../models/product.model"

interface PromotionCard {
  title: string
  subtitle: string
  discount: string
  buttonText: string
  products: ProductModel[]
  backgroundColor: string
  categoryId: string
  activeImageIndex: number
}

@Component({
  selector: "app-main-page",
  imports: [RouterLink, NewArrivalsSectionComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./main-page.component.html",
  styleUrl: "./main-page.component.scss",
})
export class MainPageComponent implements OnInit {
  private _paginationCtx = inject(PaginationContext);
  private fb = inject(FormBuilder);

  subscriptionForm!: FormGroup
  isSubmitted = false
  isSuccess = false
  errorMessage = ""

  socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook-f", url: "https://facebook.com" },
    { name: "Instagram", icon: "fab fa-instagram", url: "https://instagram.com" },
    { name: "Twitter", icon: "fab fa-twitter", url: "https://twitter.com" },
  ]

  // Collection cards with real data
  promotionCards: PromotionCard[] = [
    {
      title: "Collection",
      subtitle: "For Girls",
      discount: "Up To 40% Off",
      buttonText: "Shop Now",
      products: [],
      backgroundColor: "#a08b95",
      categoryId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
      activeImageIndex: 0,
    },
    {
      title: "Collection",
      subtitle: "For Men",
      discount: "Up To 40% Off",
      buttonText: "Shop Now",
      products: [],
      backgroundColor: "#f8d7b6",
      categoryId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      activeImageIndex: 0,
    },
  ]

  // Sale banner with real products
  saleBanner = {
    title: "Men & Women Fashion",
    saleText: "SALE!",
    dateRange: "07 to 14 Febuary",
    buttonText: "Shop Now",
    products: [] as ProductModel[],
  }

  // Image rotation intervals
  private imageIntervals: any[] = []

  constructor(private productService: ProductsService) {
  }

  ngOnInit(): void {
    this._paginationCtx.clearPaginationState()
    this.loadProductData()
    this.subscriptionForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    })
  }

  ngOnDestroy(): void {
    // Clear all intervals when component is destroyed
    this.imageIntervals.forEach((interval) => clearInterval(interval))
  }

  loadProductData(): void {
    // Create an array of observables for parallel API calls
    const requests = [
      // Get products for women's collection
      this.productService.getAllProducts({
        categoryId: this.promotionCards[0].categoryId
      }),
      // Get products for men's collection
      this.productService.getAllProducts({
        categoryId: this.promotionCards[1].categoryId
      }),
      // Get random products for sale banner
      this.productService.getAllProducts({ pageSize: 4 }),
    ]

    // Execute all requests in parallel
    forkJoin(requests).subscribe({
      next: ([womenProducts, menProducts, saleProducts]) => {
        // Update promotion cards with real products
        this.promotionCards[0].products = womenProducts.data
        this.promotionCards[1].products = menProducts.data

        // Update sale banner with real products
        this.saleBanner.products = saleProducts.data

        // Start image rotation for each card
      },
      error: (error) => {
        console.error("Error loading product data:", error)
      },
    })
  }

  getActiveProductImage(card: PromotionCard): string {
    if (card.products.length === 0) {
      return "assets/images/placeholder.jpg"
    }

    const product = card.products[card.activeImageIndex % card.products.length]
    return product.pictureUrl // Use first image of the active product
  }

  navigateToCategory(categoryId: string): void {
    // Navigate to category page (implement as needed)
    console.log(`Navigating to category: ${categoryId}`)
  }

  get emailControl() {
    return this.subscriptionForm.get("email")
  }

  onSubmit() {
    this.isSubmitted = true

    if (this.subscriptionForm.valid) {
      // In a real application, you would call a service to handle the subscription
      console.log("Subscribing email:", this.emailControl?.value)

      // Simulate API call
      setTimeout(() => {
        this.isSuccess = true
        this.subscriptionForm.reset()
        this.isSubmitted = false

        // Reset success message after 3 seconds
        setTimeout(() => {
          this.isSuccess = false
        }, 3000)
      }, 1000)
    } else {
      this.errorMessage = "Please enter a valid email address"
    }
  }
}
