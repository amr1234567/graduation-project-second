import { Injectable, inject } from '@angular/core';
import { CategoryModel } from '../models/category.model';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends SharedService {
  getAllCategories(): Observable<CategoryModel[]> {
    return this.sendGetRequest<CategoryModel[]>(CategoriesApiRoutes.GetCategoriesRoute, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getCategoryById(id: number): Observable<CategoryModel> {
    return this.sendGetRequest<CategoryModel>(`${CategoriesApiRoutes.GetCategoriesRoute}/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  createCategory(category: { name: string; description: string }) {
    return this.sendPostRequest<CategoryModel>(CategoriesApiRoutes.GetCategoriesRoute, category, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateCategory(id: string, category: Partial<CategoryModel>): Observable<CategoryModel> {
    return this.sendPutRequest<CategoryModel>(`${CategoriesApiRoutes.GetCategoriesRoute}/${id}`, category, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  deleteCategory(id: string): Observable<void> {
    return this.sendDeleteRequest(`${CategoriesApiRoutes.GetCategoriesRoute}/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

class CategoriesApiRoutes {
  static readonly GetCategoriesRoute: string = "/Category";
}
