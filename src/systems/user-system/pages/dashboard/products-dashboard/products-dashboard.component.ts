import {
  Component,
  DestroyRef,
  inject,
  signal,
  effect,
  computed, OnInit, ViewChild,
  viewChild
} from '@angular/core';
import { ProductModelToUpdate, ProductsService } from '../../../services/products.service';
import { TableCellComponent } from '../table-cell/table-cell.component';
import { PaginationContext } from '../../../../../shared/contexts/pagination.context';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductModel } from '../../../models/product.model';
import { NotificationContext } from '../../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../../shared/models/notification.model';
import { AddProductOverlayComponent } from '../../../components/add-product-overlay/add-product-overlay.component';

@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [TableCellComponent, AddProductOverlayComponent],
  template: `
    <div class="dashboard-header">
      <h1>Products Dashboard</h1>
      <button class="add-product-btn" (click)="openAddProduct()">Add New Product</button>
    </div>

    <table class="styled-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Size</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Colors</th>
          <th>Rate</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for(product of products(); track product.productId){
          <tr>
            <td>{{ $index + 1 }}</td>
            <td><img [src]="product.pictureUrl" [alt]="product.name" class="thumb"/></td>
            <td>
              <app-table-cell [value]="product.name" (valueChange)="updateField(product, 'name', $event)"></app-table-cell>
            </td>
            <td>
              <app-table-cell [value]="product.categoryName" (valueChange)="updateField(product, 'categoryName', $event)"></app-table-cell>
            </td>
            <td>
              <app-table-cell [value]="product.sizes" (valueChange)="updateField(product, 'sizes', $event)"></app-table-cell>
            </td>
            <td>
              <app-table-cell [value]="product.stockQuantity" (valueChange)="updateField(product, 'stockQuantity', $event)"></app-table-cell>
            </td>
            <td>
              <app-table-cell [value]="product.price" (valueChange)="updateField(product, 'price', $event)"></app-table-cell>
            </td>
            <td>
              <app-table-cell [value]="product.colors" (valueChange)="updateField(product, 'colors', $event)"></app-table-cell>
            </td>
            <td>
              <app-table-cell [value]="product.rate" (valueChange)="updateField(product, 'rate', $event)"></app-table-cell>
            </td>
            <td>
              <button class="delete-row" (click)="delete(product)">Delete</button>
            </td>
          </tr>
        }
      </tbody>
    </table>

    <app-add-product-overlay #addProductOverlay></app-add-product-overlay>
  `,
  styles: [`
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .add-product-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;

      &:hover {
        background: #218838;
      }
    }

    .styled-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.9em;
      font-family: sans-serif;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .styled-table thead tr {
      background-color: #009879;
      color: #ffffff;
      text-align: left;
    }

    .styled-table th,
    .styled-table td {
      padding: 12px 15px;
    }

    .styled-table tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .styled-table tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .styled-table tbody tr:last-of-type {
      border-bottom: 2px solid #009879;
    }

    .thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .delete-row {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #c82333;
      }
    }
  `]
})
export class ProductsDashboardComponent implements OnInit {
  addProductOverlay = viewChild.required<AddProductOverlayComponent>("addProductOverlay")

  private service = inject(ProductsService);
  private destroyRef = inject(DestroyRef);
  private _paginationServices = inject(PaginationContext);
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private _notificationCtx = inject(NotificationContext);

  products = signal<ProductModel[]>([]);

  page = signal(1);
  size = signal(20);
  query = signal("");

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const page = params['page'] ? parseInt(params['page']) : 1;
        this.page.set(page);
        const query = params["search"] as string;
        this.query.set(query);
        const size = params["size"] ? parseInt(params['size']) : 10;
        this.size.set(size);
        this.loadProducts(query, page, size);
      });
  }

  loadProducts(query: string = "", page: number = 1, size: number = 10) {
    const sub = this.service.getAllProducts({
      pageSize: size,
      sort: null,
      search: query,
      categoryId: null,
      dateTo: null,
      dateFrom: null,
      pageIndex: page
    })
      .subscribe(d => {
        this.products.set(d.data);
        this._paginationServices.setPaginationState({
          currentPage: d.pageIndex,
          totalPages: Math.ceil(d.count / d.pageSize),
          onPageChange: this.onPageChange
        })
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onPageChange = (page: number, size: number = 10) => {
    if (page === this._paginationServices.currentPage()) return;

    this._paginationServices.setPaginationState({
      currentPage: page,
      totalPages: this._paginationServices.totalPages() || 1,
      onPageChange: (page) => this.onPageChange(page)
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, size },
      queryParamsHandling: 'merge'
    });
  }

  updateField(product: ProductModel, field: keyof ProductModel, newValue: any) {
    if (product[field] === newValue) {
      return;
    }

    if (Array.isArray(product[field]) && Array.isArray(newValue)) {
      const oldArray = product[field] as any[];
      const newArray = newValue as any[];

      if (oldArray.length === newArray.length &&
        oldArray.every((item, index) => item === newArray[index])) {
        return;
      }
    }

    const updatedProduct = { ...product, [field]: newValue };

    const productToUpdate: ProductModelToUpdate = {
      [field]: newValue
    };

    const conn = this.service.updateProduct(product.productId, productToUpdate).subscribe({
      next: () => {
        this.products.update(list =>
          list.map(p => p.productId === product.productId ? updatedProduct : p)
        );
        this._notificationCtx.addNotification("Product updated successfully", NotificationTypeEnum.Success);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this._notificationCtx.addNotification("Failed to update product", NotificationTypeEnum.Error);
      }
    });
    this.destroyRef.onDestroy(() => conn.unsubscribe());
  }

  delete(product: ProductModel) {
    if (!confirm(`Delete ${product.name}?`)) return;
    this.service.deleteProductById(product.productId).subscribe(() => {
      this.products.update(list => list.filter(p => p.productId !== product.productId));
    });
  }

  openAddProduct() {
    this.addProductOverlay().open();
  }
}
