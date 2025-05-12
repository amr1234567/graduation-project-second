import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ProductModel} from '../../../models/product.model';
import {paginationModel, ProductsService} from '../../../services/products.service';
import {CategoryModel} from '../../../models/category.model';
import {CategoriesService} from '../../../services/categories.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {ArrayType} from '@angular/compiler';

@Component({
  selector: 'app-new-arrivals-section',
  imports: [],
  templateUrl: './new-arrivals-section.component.html',
  styleUrl: './new-arrivals-section.component.scss'
})
export class NewArrivalsSectionComponent implements OnInit {
  private productsServices = inject(ProductsService)
  private categoriesServices = inject(CategoriesService);
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _bp = inject(BreakpointObserver)

  ngOnInit(): void {
    const categorySelectConn = this._route.queryParams.subscribe(d => {
      this.categoryId.set(d["categoryId"] || "");
    })

    const productsConn = this.productsServices.getAllProducts({
      pageIndex: 1,
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      dateTo: null,
      categoryId: this.categoryId(),
      search: null,
      sort: null,
      pageSize: 50
    }).subscribe(d => {
      this.products.set(d);
    })
    const categoriesConn = this.categoriesServices.getAllCategories().subscribe(d => {
      this.categories.set(d);
    })
    this._destroyRef.onDestroy(() => {
      productsConn.unsubscribe();
      categoriesConn.unsubscribe();
      categorySelectConn.unsubscribe();
    });
  }
  products = signal<paginationModel<ProductModel>>({
    count: 0,
    pageSize: 0,
    pageIndex: 1,
    data: []
  })
  categories = signal<CategoryModel[]>([]);
  categoryId = signal<string>("");
  page = signal<number>(1);
  isSmallScreen$ = computed<boolean | undefined>(() => false);

  getRouteForCategory(id: string) {
    this._router.navigate([], {
      queryParams: {
        categoryId: id
      }
    });

    const productsConn = this.productsServices.getAllProducts({
      pageIndex: 1,
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      dateTo: null,
      categoryId: id,
      search: null,
      sort: null,
      pageSize: 50
    }).subscribe(d => {
      this.products.set(d);
    })
    this._destroyRef.onDestroy(() => productsConn.unsubscribe());
  }

  getStarsForProduct(rate: number) : boolean[]{
    const stars : boolean[] = [];
    for(let num = 0; num < rate; num++){
      stars.push(true);
    }
    for(let num = 0; num < 5 - rate; num++){
      stars.push(false);
    }
    return  stars;
  }

  get productsShown(){
    return this.products().data.filter((d, i) => this.page() * 4 > i);
  }

  onNext() {
    if(!(this.page() * 4 > this.products().data.length))
      this.page.update(v => v++);
  }

  onBack(){
    if(!(this.page() - 1 == 0))
      this.page.update(v => v--);
  }
}
