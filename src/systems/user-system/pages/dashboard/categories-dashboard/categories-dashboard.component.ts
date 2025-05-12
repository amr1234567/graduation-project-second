import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryModel } from '../../../models/category.model';
import { NotificationContext } from '../../../../../shared/contexts/notification.context';
import { NotificationTypeEnum } from '../../../../../shared/models/notification.model';
import { FormsModule } from '@angular/forms';
import { TableCellComponent } from '../table-cell/table-cell.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categories-dashboard',
  standalone: true,
  imports: [TableCellComponent, FormsModule],
  templateUrl: './categories-dashboard.component.html',
  styleUrl: './categories-dashboard.component.scss'
})
export class CategoriesDashboardComponent {
  private service = inject(CategoriesService);
  private destroyRef = inject(DestroyRef);
  private _notificationCtx = inject(NotificationContext);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  categories = signal<CategoryModel[]>([]);
  isAdding = signal(false);
  newCategory = {
    name: '',
    description: ''
  };

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const sub = this.service.getAllCategories()
      .subscribe(categories => {
        this.categories.set(categories);
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  updateField(category: CategoryModel, field: keyof CategoryModel, value: any) {
    this.service.updateCategory(category.id, { [field]: value })
      .subscribe(updatedCategory => {
        this.categories.update(list =>
          list.map(c => {
            if (c.id === updatedCategory.id)
              return { ...c, [field]: value };
            return c;
          })
        );
        this._notificationCtx.addNotification("Category updated successfully", NotificationTypeEnum.Success);
      });
  }

  delete(category: CategoryModel) {
    if (!category)
      return;
    if (!confirm(`Delete category ${category.name}?`)) return;
    this.service.deleteCategory(category.id).subscribe(() => {
      this.categories.update(list => list.filter(c => c.id !== category.id));
      this._notificationCtx.addNotification("Category deleted successfully", NotificationTypeEnum.Success);
    });
  }

  showAddForm() {
    this.isAdding.set(true);
    this.newCategory = {
      name: '',
      description: ''
    };
  }

  cancelAdd() {
    this.isAdding.set(false);
  }

  createCategory() {
    if (!this.newCategory.name || !this.newCategory.description) {
      this._notificationCtx.addNotification("Please fill all required fields", NotificationTypeEnum.Error);
      return;
    }

    this.service.createCategory(this.newCategory).subscribe(category => {
      if (category)
        this.loadCategories()
      this.isAdding.set(false);
      this._notificationCtx.addNotification("Category created successfully", NotificationTypeEnum.Success);
    });
  }
}
