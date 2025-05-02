import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationContext } from '../../../../../shared/contexts/pagination.context';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" *ngIf="paginationService.totalPages() && paginationService.totalPages()! > 1">
      <button 
        [disabled]="paginationService.currentPage() === 1"
        (click)="onPageChange(paginationService.currentPage()! - 1)"
        class="pagination-button"
      >
        <i class="fa fa-chevron-right"></i>
        السابق
      </button>
      <div class="pages">
        @for (page of getPages(); track page) {
          <button 
            [class.active]="page === paginationService.currentPage()"
            (click)="onPageChange(page)"
            class="page-number"
          >
            {{ page }}
          </button>
        }
      </div>
      <button 
        [disabled]="paginationService.currentPage() === paginationService.totalPages()"
        (click)="onPageChange(paginationService.currentPage()! + 1)"
        class="pagination-button"
      >
        التالي
        <i class="fa fa-chevron-left"></i>
      </button>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background-color: #fff;
      border-top: 1px solid #e0e0e0;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .pagination-button {
      padding: 0.5rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;

      &:hover:not([disabled]) {
        background-color: #f5f5f5;
        border-color: #999;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      i {
        font-size: 0.8rem;
      }
    }

    .pages {
      display: flex;
      gap: 0.5rem;
    }

    .page-number {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f5f5f5;
        border-color: #999;
      }

      &.active {
        background-color: #333;
        color: white;
        border-color: #333;
      }
    }
  `]
})
export class PaginationComponent {
  paginationService = inject(PaginationContext);

  getPages(): number[] {
    if (!this.paginationService.totalPages()) return [];

    const pages: number[] = [];
    const maxVisiblePages = 5;
    const currentPage = this.paginationService.currentPage()!;
    const totalPages = this.paginationService.totalPages()!;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPageChange(page: number) {
    const callback = this.paginationService.onPageChange();
    if (callback) {
      callback(page);
    }
  }
} 