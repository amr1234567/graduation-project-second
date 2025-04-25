import { Injectable } from '@angular/core';
import {SharedService} from '../../../shared/services/shared.service';
import {CategoryModel} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends SharedService{

  constructor() {
    super(CategoriesApiRoutes.BaseRoute)
  }

  public getAllCategories(){
    return this.sendGetRequest<CategoryModel[]>(CategoriesApiRoutes.GetCategoriesRoute,{
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

class CategoriesApiRoutes {
  // static readonly BaseRoute: string = "https://localhost:7151/api/Category";
  static readonly BaseRoute: string = "http://ecommercetest2.runasp.net/api/Category";
  static readonly GetCategoriesRoute: string = "";
}
