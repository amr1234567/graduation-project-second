import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CheckboxItem {
  value: string;
  checked: boolean;
}

type EditValue = string | number | CheckboxItem[];

@Component({
  selector: 'app-table-cell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent {
  value = input<string | number | string[]>([]);
  valueChange = output<string | number | string[]>();

  editing = signal(false);
  hover = signal(false);
  editValue = signal<EditValue>('');

  isArray(value: unknown): value is string[] {
    return Array.isArray(value);
  }

  isCheckboxArray(value: unknown): value is CheckboxItem[] {
    return Array.isArray(value) && value.length > 0 && 'checked' in value[0];
  }

  getValueAsArray(): string[] {
    const currentValue = this.value();
    if (this.isArray(currentValue)) {
      return currentValue;
    }
    return [String(currentValue)];
  }

  getEditValueAsCheckboxArray(): CheckboxItem[] {
    const currentValue = this.editValue();
    if (this.isCheckboxArray(currentValue)) {
      return currentValue;
    }
    return [];
  }

  startEdit(event: Event) {
    event.stopPropagation();
    this.editing.set(true);

    const currentValue = this.value();
    if (this.isArray(currentValue)) {
      this.editValue.set(currentValue.map((item: string) => ({
        value: item,
        checked: true
      })));
    } else {
      this.editValue.set(currentValue);
    }
  }

  confirm() {
    const currentEditValue = this.editValue();
    if (this.isCheckboxArray(currentEditValue)) {
      const selectedValues = currentEditValue
        .filter(item => item.checked)
        .map(item => item.value);
      this.valueChange.emit(selectedValues);
    } else {
      // تحويل القيمة إلى الرقم المناسب إذا كانت القيمة الأصلية رقم
      if (typeof this.value() === 'number') {
        this.valueChange.emit(Number(currentEditValue));
      } else {
        this.valueChange.emit(String(currentEditValue));
      }
    }
    this.editing.set(false);
  }

  cancel() {
    this.editing.set(false);
    this.hover.set(false);
  }

  removeItem(item: CheckboxItem) {
    const currentValue = this.editValue();
    if (this.isCheckboxArray(currentValue)) {
      const index = currentValue.indexOf(item);
      if (index > -1) {
        const newValue = [...currentValue];
        newValue.splice(index, 1);
        this.editValue.set(newValue);
      }
    }
  }

  addNewItem() {
    const currentValue = this.editValue();
    if (this.isCheckboxArray(currentValue)) {
      this.editValue.set([...currentValue, {
        value: '',
        checked: true
      }]);
    }
  }
}
