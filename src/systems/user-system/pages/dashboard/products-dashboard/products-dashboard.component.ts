import {
  Component,
  DestroyRef,
  inject,
  signal,
  effect,
  computed, OnInit
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ProductsService } from '../../../services/products.service';
import type { ColDef } from 'ag-grid-community';
import { ProductModel } from '../../../models/product.model';
import {TableCellComponent} from '../table-cell/table-cell.component';

@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [AgGridAngular, TableCellComponent],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.scss'
})
export class ProductsDashboardComponent implements OnInit{
  private service = inject(ProductsService);
  private destroyRef = inject(DestroyRef);

  products = signal<ProductModel[]>([]);
  page = signal(1);
  size = 30;
  count = signal(0);

  ngOnInit() {
    const sub = this.service.getAllProducts({ pageSize: this.size, sort: null, search: null, categoryId: null, dateTo: null, dateFrom: null, pageIndex: this.page() })
      .subscribe(d => {
        this.products.set(d.data);
        this.page.set(d.pageIndex);
        this.count.set(d.count);
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  updateField(product: ProductModel, field: keyof ProductModel, newValue: any) {
    const updated = { ...product, [field]: newValue } as ProductModel;
    this.service.updateProduct(updated).subscribe(() => {
      this.products.update(list => list.map(p => p.productId === updated.productId ? updated : p));
    });
  }

  delete(product: ProductModel) {
    if (!confirm(`Delete ${product.name}?`)) return;
    this.service.deleteProductById(product.productId).subscribe(() => {
      this.products.update(list => list.filter(p => p.productId !== product.productId));
    });
  }
}
