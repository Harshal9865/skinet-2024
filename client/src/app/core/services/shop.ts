import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class Shop {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  brands: string[] = [];
  types: string[] = [];

  private productCache = new Map<number, Product>();

  getProducts(shopParams: ShopParams): Observable<Pagination<Product>> {
    let params = new HttpParams()
      .set('pageIndex', shopParams.pageNumber)
      .set('pageSize', shopParams.pageSize)
      .set('sort', shopParams.sort);

    if (shopParams.brands.length > 0) {
      params = params.set('brands', shopParams.brands.join(','));
    }

    if (shopParams.types.length > 0) {
      params = params.set('types', shopParams.types.join(','));
    }

    if (shopParams.search?.trim()) {
      params = params.set('search', shopParams.search.trim());
    }

    return this.http.get<Pagination<Product>>(`${this.baseUrl}/products`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
      tap(product => this.productCache.set(id, product)),
      catchError(error => {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
      })
    );
  }

 getBrands(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/products/brands`).pipe(
    catchError(err => {
      console.error('Error fetching brands', err);
      return of([]);
    })
  );
}

getTypes(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/products/types`).pipe(
    catchError(err => {
      console.error('Error fetching types', err);
      return of([]);
    })
  );

}

}
