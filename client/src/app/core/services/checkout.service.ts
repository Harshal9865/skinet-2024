import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(this.baseUrl + 'orders', order);
  }
}
