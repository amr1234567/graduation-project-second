import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CreateProductRequest, ProductsService } from '../../services/products.service';
import { NotificationContext } from '../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../shared/models/notification.model';
import { CategoriesService } from '../../services/categories.service';
import { CategoryModel } from '../../models/category.model';

interface CheckboxItem {
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-add-product-overlay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-product-overlay.component.html',
  styleUrls: ['./add-product-overlay.component.scss']
})
export class AddProductOverlayComponent {
  private _fb = inject(FormBuilder);
  private _productsService = inject(ProductsService);
  private _notificationCtx = inject(NotificationContext);
  private _categoriesService = inject(CategoriesService);
  private _destroyRef = inject(DestroyRef);

  isOpen = signal(false);
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  categories = signal<CategoryModel[]>([]);
  sizes = signal<CheckboxItem[]>([]);
  colors = signal<CheckboxItem[]>([]);
  newSize = signal('');
  newColor = signal('');

  productForm: FormGroup = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    categoryId: ['', Validators.required]
  });

  open() {
    this.isOpen.set(true);
    this.loadCategories();
  }

  close() {
    this.isOpen.set(false);
    this.productForm.reset();
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    this.sizes.set([]);
    this.colors.set([]);
    this.newSize.set('');
    this.newColor.set('');
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  addSize() {
    if (this.newSize()) {
      this.sizes.update(items => [...items, { value: this.newSize(), checked: true }]);
      this.newSize.set('');
    }
  }

  removeSize(item: CheckboxItem) {
    this.sizes.update(items => items.filter(i => i !== item));
  }

  addColor() {
    if (this.newColor()) {
      this.colors.update(items => [...items, { value: this.newColor(), checked: true }]);
      this.newColor.set('');
    }
  }

  removeColor(item: CheckboxItem) {
    this.colors.update(items => items.filter(i => i !== item));
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedFile()) {
      const selectedSizes = this.sizes()
        .filter(item => item.checked)
        .map(item => item.value);

      const selectedColors = this.colors()
        .filter(item => item.checked)
        .map(item => item.value);

      if (selectedSizes.length === 0 || selectedColors.length === 0) {
        this._notificationCtx.addNotification("Please select at least one size and color", NotificationTypeEnum.Error);
        return;
      }

      try {
        const file = this.selectedFile()!;  // a File object from <input type="file">
        const formData = new FormData();

        // Append simple fields
        formData.append('Name', this.productForm.value.name);
        formData.append('Description', this.productForm.value.description);
        formData.append('StockQuantity', this.productForm.value.stockQuantity.toString());
        formData.append('Price', this.productForm.value.price.toString());
        formData.append('CategoryId', this.productForm.value.categoryId);

        // Append arrays
        this.sizes().forEach(size => formData.append('Sizes', size.value));
        this.colors().forEach(color => formData.append('Colors', color.value));

        // Append the file under the same property name as your DTO
        formData.append('Picture', file, file.name);


        const conn = this._productsService.createProduct(formData).subscribe({
          next: () => {
            this._notificationCtx.addNotification("Product created successfully", NotificationTypeEnum.Success);
            this.close();
          },
          error: (error: unknown) => {
            console.error('Error creating product:', error);
          }
        });
        this._destroyRef.onDestroy(() => conn.unsubscribe());
      } catch (error: unknown) {
        console.error('Error creating product:', error);
        this._notificationCtx.addNotification("Failed to create product", NotificationTypeEnum.Error);
      }
    }
  }

  private loadCategories() {
    const conn = this._categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error: unknown) => {
        console.error('Error loading categories:', error);
        this._notificationCtx.addNotification("Failed to load categories", NotificationTypeEnum.Error);
      }
    });
    this._destroyRef.onDestroy(() => conn.unsubscribe());
  }
} 