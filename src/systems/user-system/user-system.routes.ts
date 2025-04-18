import {Routes} from '@angular/router';
import {isUserGuard} from './guards/is-user.guard';
import {isAuthorizedGuard} from '../auth-system/guards/is-authorized.guard';

const userRoutes : Routes = [
  {
    path: 'user',
    loadComponent: () => import("./user-decorator-layout.component").then(l => l.default),
    children: [
      {
        path: "main",
        loadComponent: () => import("./pages/main-page/main-page.component")
          .then(l => l.MainPageComponent),
      },
      {
        path: 'cart',
        loadComponent: () => import("./pages/cart-page/cart-page.component")
          .then(l => l.CartPageComponent),
      },
      {
        path: "favorite",
        loadComponent: () => import("./pages/favorite-products-page/favorite-products-page.component")
          .then(l => l.FavoriteProductsPageComponent),
      },
      {
        path: "profile",
        loadComponent: () => import("./pages/profile-page/profile-page.component")
          .then(l => l.ProfilePageComponent),
      },
      {
        path: "product-details/:productId",
        loadComponent: () => import("./pages/product-details-page/product-details-page.component")
          .then(l => l.ProductDetailsPageComponent),
      },
      {
        path: "products",
        loadComponent: () => import("./pages/products-page/products-page.component")
          .then(l => l.ProductsPageComponent),
      }
    ],
    // canActivateChild: [isUserGuard, isAuthorizedGuard]
  }
]

export default userRoutes;
