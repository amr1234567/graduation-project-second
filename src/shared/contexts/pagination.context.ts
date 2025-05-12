import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class PaginationContext {
    private _currentPage = signal<number | null>(null);
    private _totalPages = signal<number | null>(null);
    private _onPageChange = signal<((page: number) => void) | null>(null);

    /**
     *
     */
    constructor(private _localStorageServices: LocalStorageService) {
        this._currentPage.set(_localStorageServices.getObject<number>("current-page"));
        this._totalPages.set(_localStorageServices.getObject<number>("total-pages"))
    }

    currentPage = this._currentPage.asReadonly();
    totalPages = this._totalPages.asReadonly();
    onPageChange = this._onPageChange.asReadonly();

    setPaginationState(params: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    }) {
        this._currentPage.set(params.currentPage);
        this._localStorageServices.saveObject("current-page", params.currentPage);
        this._totalPages.set(params.totalPages);
        this._localStorageServices.saveObject("total-pages", params.totalPages);
        this._onPageChange.set(params.onPageChange);
    }

    clearPaginationState() {
        this._currentPage.set(null);
        this._totalPages.set(null);
        this._onPageChange.set(null);
    }
} 