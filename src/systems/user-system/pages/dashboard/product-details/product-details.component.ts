import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ProductsService} from '../../../services/products.service';
import {ProductModel} from '../../../models/product.model';
import {count} from 'rxjs';
import {AgGridAngular} from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-product-details',
  imports: [
    AgGridAngular
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {


}
