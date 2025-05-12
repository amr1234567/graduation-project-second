import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationContext } from '../../../../shared/contexts/pagination.context';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  private paginationService = inject(PaginationContext);
  @ViewChild('footerObserver') footerObserver!: ElementRef;
  isAboveFooter = false;

  ngOnInit() {
    this.setupFooterObserver();
  }

  private setupFooterObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          this.isAboveFooter = entry.isIntersecting;
        });
      },
      {
        threshold: 0.1
      }
    );

    if (this.footerObserver) {
      observer.observe(this.footerObserver.nativeElement);
    }
  }

  private scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  isFirstPage(): boolean {
    return this.paginationService.currentPage() === 1;
  }

  isLastPage(): boolean {
    return this.paginationService.currentPage() === this.paginationService.totalPages();
  }

  isCurrentPage(page: number): boolean {
    return page === this.paginationService.currentPage();
  }

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
    this.scrollToTop();
    const callback = this.paginationService.onPageChange();
    if (callback) {
      callback(page);
    }
  }

  get showPagination() {
    return this.paginationService.totalPages() && this.paginationService.totalPages()! > 1;
  }

  get previosPage() {
    return this.paginationService.currentPage()! - 1;
  }

  get nextPage() {
    return this.paginationService.currentPage()! + 1;
  }
} 