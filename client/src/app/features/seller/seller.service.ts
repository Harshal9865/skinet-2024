import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SellerService {
  private baseUrl = 'https://localhost:5051/api/seller';

  constructor(private http: HttpClient) {}

  uploadProduct(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, data);
  }

  getSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/my-products`);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
