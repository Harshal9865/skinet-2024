import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrdersForUser(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  placeOrder(orderDto: any): Observable<any> {
  return this.http.post(this.baseUrl, orderDto);
}

  }
