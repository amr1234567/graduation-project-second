import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PaginationContext {
    private _currentPage = signal<number | null>(null);
    private _totalPages = signal<number | null>(null);
    private _onPageChange = signal<((page: number) => void) | null>(null);

    currentPage = this._currentPage.asReadonly();
    totalPages = this._totalPages.asReadonly();
    onPageChange = this._onPageChange.asReadonly();

    setPaginationState(params: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    }) {
        this._currentPage.set(params.currentPage);
        this._totalPages.set(params.totalPages);
        this._onPageChange.set(params.onPageChange);
    }

    clearPaginationState() {
        this._currentPage.set(null);
        this._totalPages.set(null);
        this._onPageChange.set(null);
    }
} 