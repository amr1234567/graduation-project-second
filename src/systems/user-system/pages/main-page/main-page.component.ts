import { Component } from '@angular/core';
import {UserViewHeaderComponent} from '../../components/user-view-header/user-view-header.component';
import {RouterLink} from '@angular/router';
import {NewArrivalsSectionComponent} from './new-arrivals-section/new-arrivals-section.component';
import { PaginationContext } from '../../../../shared/contexts/pagination.context';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface PromotionCard {
  title: string;
  subtitle: string;
  discount: string;
  buttonText: string;
  imageUrl: string;
  backgroundColor: string;
}

interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  url: string;
}


@Component({
  selector: 'app-main-page',
  imports: [
    RouterLink,
    NewArrivalsSectionComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  subscriptionForm: FormGroup;
  isSubmitted = false;
  isSuccess = false;
  errorMessage = '';

  socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com' }
  ];

  discountPercentage: number = 60;

  brands: Brand[] = [
    {
      id: 1,
      name: 'Nike',
      logoUrl: 'assets/images/brands/nike-logo.png',
      url: '/brands/nike'
    },
    {
      id: 2,
      name: 'H&M',
      logoUrl: 'assets/images/brands/hm-logo.png',
      url: '/brands/hm'
    },
    {
      id: 3,
      name: 'Levi\'s',
      logoUrl: 'assets/images/brands/levis-logo.png',
      url: '/brands/levis'
    },
    {
      id: 4,
      name: 'U.S. Polo Assn.',
      logoUrl: 'assets/images/brands/uspolo-logo.png',
      url: '/brands/uspolo'
    },
    {
      id: 5,
      name: 'Puma',
      logoUrl: 'assets/images/brands/puma-logo.png',
      url: '/brands/puma'
    }
  ];

  constructor(private _paginationCtx: PaginationContext, private fb: FormBuilder) {
    _paginationCtx.clearPaginationState();
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl() {
    return this.subscriptionForm.get('email');
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.subscriptionForm.valid) {
      // In a real application, you would call a service to handle the subscription
      console.log('Subscribing email:', this.emailControl?.value);

      // Simulate API call
      setTimeout(() => {
        this.isSuccess = true;
        this.subscriptionForm.reset();
        this.isSubmitted = false;

        // Reset success message after 3 seconds
        setTimeout(() => {
          this.isSuccess = false;
        }, 3000);
      }, 1000);
    } else {
      this.errorMessage = 'Please enter a valid email address';
    }
  }

  promotionCards: PromotionCard[] = [
    {
      title: 'Collection',
      subtitle: 'For Girls',
      discount: 'Up To 40% Off',
      buttonText: 'Shop Now',
      imageUrl: 'assets/images/women-collection.jpg',
      backgroundColor: '#a08b95'
    },
    {
      title: 'Collection',
      subtitle: 'For Men',
      discount: 'Up To 40% Off',
      buttonText: 'Shop Now',
      imageUrl: 'assets/images/men-collection.jpg',
      backgroundColor: '#f8d7b6'
    }
  ];

  saleBanner = {
    title: 'Men & Women Fashion',
    saleText: 'SALE!',
    dateRange: '07 to 14 Febuary',
    buttonText: 'Shop Now',
    womenImageUrl: 'assets/images/women-yellow-dress.jpg',
    menImageUrl: 'assets/images/men-gray-jacket.jpg'
  };
}
