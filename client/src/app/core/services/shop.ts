import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { environment } from '../../../environments/environment';
import { ShopParams } from '../../shared/models/shopParams';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Shop {
  private baseUrl = environment.apiUrl + '/api';
  private http = inject(HttpClient);

  types: string[] = [];
  brands: string[] = [];

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
    if (shopParams.search && shopParams.search.trim() !== '') {
      params = params.set('search', shopParams.search.trim());
    }

    return this.http.get<Pagination<Product>>(`${this.baseUrl}/products`, { params });
  }

  getBrands(): void {
    if (this.brands.length > 0) return;
    this.http.get<string[]>(`${this.baseUrl}/products/brands`).subscribe({
      next: response => (this.brands = response),
      error: error => console.error(error)
    });
  }
getProduct(id: number): Observable<Product> {
  return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
}




  getTypes(): void {
    if (this.types.length > 0) return;
    this.http.get<string[]>(`${this.baseUrl}/products/types`).subscribe({
      next: response => (this.types = response),
      error: error => console.error(error)
    });
  }
}
