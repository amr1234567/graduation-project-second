import {Component, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-table-cell',
  imports: [
    FormsModule
  ],
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss'
})
export class TableCellComponent {
  value = input.required<string | number>()
  valueChange = output<string | number>();

  hover = signal(false);
  editing = signal(false);
  editValue!: string | number;

  startEdit(event: MouseEvent) {
    event.stopPropagation();
    this.editValue = this.value();
    this.editing.set(true);
  }

  confirm() {
    this.valueChange.emit(this.editValue);
    this.editing.set(false);
  }

  cancel() {
    this.editing.set(false);
  }
}
