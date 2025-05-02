import { Injectable } from '@angular/core';
import {SharedService} from '../../../shared/services/shared.service';
import {Data} from '@angular/router';
import {ProductModel} from '../models/product.model';
import {HttpParams} from '@angular/common/http';
import { BasketModel, FavoriteProductsModel } from '../models/basket.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends SharedService{


  constructor() {
    super(ProductsApiRoutes.BaseRoute)
  }

  public getAllProducts(query: GetProductsQuery){
    return this.sendGetRequest<paginationModel<ProductModel>>(ProductsApiRoutes.GetProductsRoute,{
      headers: {
        'Content-Type': 'application/json'
      },
      params: getParamsFromQuery(query)
    })
  }

  public getProductById(id: string){
    return this.sendGetRequest<ProductModel>(`${ProductsApiRoutes.GetProductByIdRoute}/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public deleteProductById(id: string) {
    return this.sendDeleteRequest<any>(`${ProductsApiRoutes.DeleteProductByIdRoute}/${id}`)
  }

  public updateProduct(updated: ProductModel) {
    return this.sendPutRequest<any>(`${ProductsApiRoutes.UpdateProductRoute}/${updated.productId}`, updated, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public addProductToBasket(productId: string, quantity: number = 1) {
    return this.sendPostRequest<any>(`${ProductsApiRoutes.AddToBasketRoute}`, {
      productId,
      quantity
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public addProductToFavorite(productId: string) {
    return this.sendPostRequest<any>(`${ProductsApiRoutes.AddToFavRoute}`, { productId }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public removeProductFromFavorite(productId: string) {
    return this.sendDeleteRequest<any>(`${ProductsApiRoutes.RemoveFromFavRoute}/${productId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public removeProductFromBasket(productId: string, quantity: number = 1) {
    const httpParams = new HttpParams();
    httpParams.set("quantity", quantity);
    return this.sendDeleteRequest<any>(`${ProductsApiRoutes.RemoveFromBasketRoute}/${productId}`, {
      params: httpParams,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public getCartItems() {
    return this.sendGetRequest<BasketModel>(`${ProductsApiRoutes.GetBasket}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public getFavoriteProducts() {
    return this.sendGetRequest<FavoriteProductsModel>(`${ProductsApiRoutes.GetFavorite}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

class ProductsApiRoutes {
  // static readonly BaseRoute: string = 'https://localhost:7151/api';
  static readonly BaseRoute: string = 'http://ecommercetest2.runasp.net/api';
  static readonly GetProductsRoute: string = "/Product"
  static readonly GetProductByIdRoute: string = "/Product"
  static readonly DeleteProductByIdRoute: string = "/Product"
  static readonly UpdateProductRoute: string = "/Product"
  static readonly AddToFavRoute: string = "/Favorite/AddItems"
  static readonly AddToBasketRoute: string = "/Basket/AddItems"
  static readonly RemoveFromFavRoute: string = "/Favorite/items"
  static readonly RemoveFromBasketRoute: string = "/Basket/items"
  static readonly GetBasket: string = "/Basket"
  static readonly GetFavorite: string = "/Favorite"
}

type GetProductsQuery = {
  sort: string | null;
  categoryId: string | null;
  pageSize: number | null;
  pageIndex: number | null;
  search: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface paginationModel<T> {
  data: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

function getParamsFromQuery(query: GetProductsQuery): HttpParams {
  return Object.entries(query)
    .filter(([, v]) => v != null)                                 // drop null/undefined
    .reduce((params, [key, v]) => {
      const value = v instanceof Date ? v.toISOString() : String(v);
      return params.set(key, value);
    }, new HttpParams());
}

