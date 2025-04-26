import { Routes } from '@angular/router';
import { isUserGuard } from './guards/is-user.guard';
import { isAuthorizedGuard } from '../auth-system/guards/is-authorized.guard';
import isAdminGuard from './guards/is-admin.guard';

import UserDecoratorLayoutComponent from './user-decorator-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { FavoriteProductsPageComponent } from './pages/favorite-products-page/favorite-products-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page/product-details-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsDashboardComponent } from './pages/dashboard/products-dashboard/products-dashboard.component';
import { CategoriesDashboardComponent } from './pages/dashboard/categories-dashboard/categories-dashboard.component';
import { DeliveryMethodsDashboardComponent } from './pages/dashboard/delivery-methods-dashboard/delivery-methods-dashboard.component';
import { OrdersDashboardComponent } from './pages/dashboard/orders-dashboard/orders-dashboard.component';
import { ProductDetailsComponent } from './pages/dashboard/product-details/product-details.component';
import { UpdatingProductComponent } from './pages/dashboard/updating-product/updating-product.component';
import { AddingProductComponent } from './pages/dashboard/adding-product/adding-product.component';

export const userRoutes: Routes = [
  {
    path: 'main',
    component: UserDecoratorLayoutComponent,
    canActivateChild: [isAuthorizedGuard],
    children: [
      {
        path: 'user',
        canActivateChild: [isUserGuard],
        children: [
          { path: '', redirectTo: 'main', pathMatch: 'full' }, // Add this
          { path: 'main', component: MainPageComponent },
          { path: 'cart', component: CartPageComponent },
          { path: 'favorite', component: FavoriteProductsPageComponent },
          { path: 'product-details/:productId', component: ProductDetailsPageComponent },
          { path: 'products', component: ProductsPageComponent },
        ]
      },
      {
        path: 'admin',
        canActivateChild: [isAdminGuard],
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
            children: [
              { path: '', redirectTo: 'products', pathMatch: 'full' }, // Add this
              { path: 'products', component: ProductsDashboardComponent },
              { path: 'categories', component: CategoriesDashboardComponent },
              { path: 'delivery-methods', component: DeliveryMethodsDashboardComponent },
              { path: 'orders', component: OrdersDashboardComponent },
            ]
          },
          { path: 'products/:id', component: ProductDetailsComponent },
          { path: 'products/update/:id', component: UpdatingProductComponent },
          { path: 'products/add', component: AddingProductComponent },
        ]
      }
    ]
  }
];

// Export routes array
export default userRoutes;
