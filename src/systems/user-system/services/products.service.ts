import { Injectable } from '@angular/core';
import {SharedService} from '../../../shared/services/shared.service';
import {Data} from '@angular/router';
import {ProductModel} from '../models/product.model';
import {HttpParams} from '@angular/common/http';

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
    return this.sendGetRequest<ProductModel>(`/${id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public deleteProductById(id: string) {
    return this.sendDeleteRequest<any>(`/${id}`)
  }

  public updateProduct(updated: ProductModel) {
    return this.sendPutRequest<any>(`/${updated.productId}`, updated, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public addProductToBasket(productId: string) {
    return this.sendPostRequest<any>("", {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public addProductToFavorite(productId: string) {
    return this.sendPostRequest<any>("", {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

class ProductsApiRoutes {
  // static readonly BaseRoute: string = 'https://localhost:7151/api/Product';
  static readonly BaseRoute: string = 'http://ecommercetest2.runasp.net/api/Product';
  static readonly GetProductsRoute: string = ""
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

export type paginationModel<T> = {
  pageSize: number,
  pageIndex: number,
  count: number,
  data: T[]
}

function getParamsFromQuery(query: GetProductsQuery): HttpParams {
  return Object.entries(query)
    .filter(([, v]) => v != null)                                 // drop null/undefined
    .reduce((params, [key, v]) => {
      const value = v instanceof Date ? v.toISOString() : String(v);
      return params.set(key, value);
    }, new HttpParams());
}

